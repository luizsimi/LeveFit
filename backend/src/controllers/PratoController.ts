import { Request, Response } from "express";
import { prisma } from "../server";

interface Avaliacao {
  id: number;
  nota: number;
  comentario: string;
  cliente?: {
    id: number;
    nome: string;
  };
  createdAt?: Date;
}

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string | null;
  categoria: string;
  disponivel: boolean;
  emPromocao?: boolean;
  precoOriginal?: number | null;
  dataFimPromocao?: Date | null;
  calorias?: number | null;
  proteinas?: number | null;
  carboidratos?: number | null;
  gorduras?: number | null;
  fibras?: number | null;
  porcao?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  fornecedor?: {
    id: number;
    nome: string;
    whatsapp: string;
    logo?: string | null;
  };
  avaliacoes: Avaliacao[];
}

export class PratoController {
  async create(req: Request, res: Response) {
    try {
      const {
        nome,
        descricao,
        preco,
        imagem,
        categoria,
        emPromocao,
        precoOriginal,
        dataFimPromocao,
        calorias,
        proteinas,
        carboidratos,
        gorduras,
        fibras,
        porcao,
      } = req.body;
      const { userId } = req;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      if (!nome || !descricao || !preco || !categoria) {
        return res.status(400).json({
          error: "Nome, descrição, preço e categoria são obrigatórios",
        });
      }

      // Verificar se o fornecedor existe e tem assinatura ativa
      const fornecedor = await prisma.fornecedor.findUnique({
        where: { id: userId },
      });

      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }

      if (!fornecedor.assinaturaAtiva) {
        return res.status(403).json({
          error:
            "Sua assinatura não está ativa. Ative-a para cadastrar pratos.",
        });
      }

      // Processar campos de promoção
      let dadosPromocao = {};
      if (emPromocao) {
        if (!precoOriginal || precoOriginal <= 0) {
          return res.status(400).json({
            error: "Preço original é obrigatório para itens em promoção",
          });
        }

        dadosPromocao = {
          emPromocao: true,
          precoOriginal: Number(precoOriginal),
          dataFimPromocao: dataFimPromocao ? new Date(dataFimPromocao) : null,
        };
      }

      // Processar informações nutricionais (todos opcionais)
      const dadosNutricionais = {
        calorias: calorias ? Number(calorias) : null,
        proteinas: proteinas ? Number(proteinas) : null,
        carboidratos: carboidratos ? Number(carboidratos) : null,
        gorduras: gorduras ? Number(gorduras) : null,
        fibras: fibras ? Number(fibras) : null,
        porcao: porcao || null,
      };

      // Criar prato (imagem é opcional)
      const prato = await prisma.prato.create({
        data: {
          nome,
          descricao,
          preco: Number(preco),
          imagem: imagem || null, // Permite valor null explicitamente
          categoria,
          fornecedorId: userId,
          ...dadosPromocao,
          ...dadosNutricionais,
        },
      });

      return res.status(201).json(prato);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async listarPratosFornecedor(req: Request, res: Response) {
    try {
      const { userId } = req;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      const pratos = await prisma.prato.findMany({
        where: { fornecedorId: userId },
        include: {
          avaliacoes: {
            select: {
              id: true,
              nota: true,
              comentario: true,
              cliente: {
                select: {
                  id: true,
                  nome: true,
                },
              },
              createdAt: true,
            },
          },
        },
      });

      return res.json(pratos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async listarTodosPratos(req: Request, res: Response) {
    try {
      const { categoria } = req.query;

      // Filtro por categoria (opcional)
      const filtro: any = {
        fornecedor: {
          assinaturaAtiva: true,
          status: true,
        },
        disponivel: true,
      };

      if (categoria) {
        filtro.categoria = String(categoria);
      }

      const pratos = await prisma.prato.findMany({
        where: filtro,
        select: {
          id: true,
          nome: true,
          descricao: true,
          preco: true,
          imagem: true,
          categoria: true,
          disponivel: true,
          emPromocao: true,
          precoOriginal: true,
          dataFimPromocao: true,
          createdAt: true,
          updatedAt: true,
          fornecedor: {
            select: {
              id: true,
              nome: true,
              whatsapp: true,
              logo: true,
            },
          },
          avaliacoes: {
            select: {
              id: true,
              nota: true,
              comentario: true,
              cliente: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
          },
        },
      });

      // Remover promoções expiradas
      const hoje = new Date();
      const pratosAtualizados = pratos.map((prato: any) => {
        if (
          prato.emPromocao &&
          prato.dataFimPromocao &&
          new Date(prato.dataFimPromocao) < hoje
        ) {
          // Se a promoção expirou, atualizamos no banco de dados
          prisma.prato
            .update({
              where: { id: prato.id },
              data: {
                emPromocao: false,
                precoOriginal: null,
                dataFimPromocao: null,
              },
            })
            .catch((err) =>
              console.error("Erro ao atualizar promoção expirada:", err)
            );

          // E retornamos o prato sem promoção
          return {
            ...prato,
            emPromocao: false,
            precoOriginal: null,
            dataFimPromocao: null,
          };
        }
        return prato;
      });

      // Calcular média das avaliações para cada prato
      const pratosComMediaAvaliacao = pratosAtualizados.map((prato: Prato) => {
        const totalAvaliacoes = prato.avaliacoes.length;
        const somaNotas = prato.avaliacoes.reduce(
          (acc: number, av: Avaliacao) => acc + av.nota,
          0
        );
        const mediaAvaliacao =
          totalAvaliacoes > 0 ? somaNotas / totalAvaliacoes : 0;

        return {
          ...prato,
          mediaAvaliacao,
          totalAvaliacoes,
        };
      });

      return res.json(pratosComMediaAvaliacao);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async listarCategorias(req: Request, res: Response) {
    try {
      const categorias = await prisma.prato.findMany({
        where: {
          fornecedor: {
            assinaturaAtiva: true,
            status: true,
          },
          disponivel: true,
        },
        select: {
          categoria: true,
        },
        distinct: ["categoria"],
      });

      const listaCategorias = categorias.map(
        (item: { categoria: string }) => item.categoria
      );

      return res.json(listaCategorias);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getPrato(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const prato = await prisma.prato.findUnique({
        where: { id: Number(id) },
        include: {
          fornecedor: {
            select: {
              id: true,
              nome: true,
              whatsapp: true,
              logo: true,
            },
          },
          avaliacoes: {
            include: {
              cliente: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
          },
        },
      });

      if (!prato) {
        return res.status(404).json({ error: "Prato não encontrado" });
      }

      // Calcular média das avaliações
      const totalAvaliacoes = prato.avaliacoes.length;
      const somaNotas = prato.avaliacoes.reduce(
        (acc: number, av: Avaliacao) => acc + av.nota,
        0
      );
      const mediaAvaliacao =
        totalAvaliacoes > 0 ? somaNotas / totalAvaliacoes : 0;

      return res.json({
        ...prato,
        mediaAvaliacao,
        totalAvaliacoes,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async atualizarPrato(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        nome,
        descricao,
        preco,
        imagem,
        categoria,
        disponivel,
        emPromocao,
        precoOriginal,
        dataFimPromocao,
        calorias,
        proteinas,
        carboidratos,
        gorduras,
        fibras,
        porcao,
      } = req.body;
      const { userId } = req;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      // Verificar se o prato existe e pertence ao fornecedor
      const pratoExistente = await prisma.prato.findUnique({
        where: { id: Number(id) },
      });

      if (!pratoExistente) {
        return res.status(404).json({ error: "Prato não encontrado" });
      }

      if (pratoExistente.fornecedorId !== userId) {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para editar este prato" });
      }

      // Atualizar dados
      const dadosAtualizados: any = {};

      if (nome) dadosAtualizados.nome = nome;
      if (descricao) dadosAtualizados.descricao = descricao;
      if (preco) dadosAtualizados.preco = Number(preco);
      if (imagem !== undefined) dadosAtualizados.imagem = imagem || null;
      if (categoria) dadosAtualizados.categoria = categoria;
      if (disponivel !== undefined) dadosAtualizados.disponivel = disponivel;

      // Processar campos de promoção
      if (emPromocao !== undefined) {
        dadosAtualizados.emPromocao = emPromocao;

        if (emPromocao) {
          if (precoOriginal)
            dadosAtualizados.precoOriginal = Number(precoOriginal);
          dadosAtualizados.dataFimPromocao = dataFimPromocao
            ? new Date(dataFimPromocao)
            : null;
        } else {
          dadosAtualizados.precoOriginal = null;
          dadosAtualizados.dataFimPromocao = null;
        }
      }

      // Processar informações nutricionais
      if (calorias !== undefined)
        dadosAtualizados.calorias = calorias ? Number(calorias) : null;
      if (proteinas !== undefined)
        dadosAtualizados.proteinas = proteinas ? Number(proteinas) : null;
      if (carboidratos !== undefined)
        dadosAtualizados.carboidratos = carboidratos
          ? Number(carboidratos)
          : null;
      if (gorduras !== undefined)
        dadosAtualizados.gorduras = gorduras ? Number(gorduras) : null;
      if (fibras !== undefined)
        dadosAtualizados.fibras = fibras ? Number(fibras) : null;
      if (porcao !== undefined) dadosAtualizados.porcao = porcao || null;

      const pratoAtualizado = await prisma.prato.update({
        where: { id: Number(id) },
        data: dadosAtualizados,
      });

      return res.json(pratoAtualizado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async deletarPrato(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      // Verificar se o prato existe e pertence ao fornecedor
      const pratoExistente = await prisma.prato.findUnique({
        where: { id: Number(id) },
      });

      if (!pratoExistente) {
        return res.status(404).json({ error: "Prato não encontrado" });
      }

      if (pratoExistente.fornecedorId !== userId) {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para excluir este prato" });
      }

      // Primeiro excluir as avaliações associadas
      await prisma.avaliacao.deleteMany({
        where: { pratoId: Number(id) },
      });

      // Excluir o prato
      await prisma.prato.delete({
        where: { id: Number(id) },
      });

      return res.json({ message: "Prato excluído com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async listarPratosPromocao(req: Request, res: Response) {
    try {
      const hoje = new Date();

      const pratosPromocao = await prisma.prato.findMany({
        where: {
          fornecedor: {
            assinaturaAtiva: true,
            status: true,
          },
          disponivel: true,
          emPromocao: true,
          OR: [{ dataFimPromocao: null }, { dataFimPromocao: { gte: hoje } }],
        },
        select: {
          id: true,
          nome: true,
          descricao: true,
          preco: true,
          imagem: true,
          categoria: true,
          disponivel: true,
          emPromocao: true,
          precoOriginal: true,
          dataFimPromocao: true,
          createdAt: true,
          updatedAt: true,
          fornecedor: {
            select: {
              id: true,
              nome: true,
              whatsapp: true,
              logo: true,
            },
          },
          avaliacoes: {
            select: {
              id: true,
              nota: true,
              comentario: true,
              cliente: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
          },
        },
      });

      // Calcular média das avaliações para cada prato
      const pratosComMediaAvaliacao = pratosPromocao.map((prato: Prato) => {
        const totalAvaliacoes = prato.avaliacoes.length;
        const somaNotas = prato.avaliacoes.reduce(
          (acc: number, av: Avaliacao) => acc + av.nota,
          0
        );
        const mediaAvaliacao =
          totalAvaliacoes > 0 ? somaNotas / totalAvaliacoes : 0;

        return {
          ...prato,
          mediaAvaliacao,
          totalAvaliacoes,
        };
      });

      return res.json(pratosComMediaAvaliacao);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
