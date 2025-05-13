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
  imagem?: string;
  categoria: string;
  disponivel: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  fornecedor?: {
    id: number;
    nome: string;
    whatsapp: string;
    logo?: string;
  };
  avaliacoes: Avaliacao[];
}

export class PratoController {
  async create(req: Request, res: Response) {
    try {
      const { nome, descricao, preco, imagem, categoria } = req.body;
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

      // Criar prato
      const prato = await prisma.prato.create({
        data: {
          nome,
          descricao,
          preco: Number(preco),
          imagem,
          categoria,
          fornecedorId: userId,
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
      const pratosComMediaAvaliacao = pratos.map((prato: Prato) => {
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
      const { nome, descricao, preco, imagem, categoria, disponivel } =
        req.body;
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
      if (imagem !== undefined) dadosAtualizados.imagem = imagem;
      if (categoria) dadosAtualizados.categoria = categoria;
      if (disponivel !== undefined) dadosAtualizados.disponivel = disponivel;

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
}
