import { Request, Response } from "express";
import { prisma } from "../server";

export class AvaliacaoController {
  async criarAvaliacao(req: Request, res: Response) {
    try {
      const { pratoId, nota, comentario } = req.body;
      const { userId } = req;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      if (!pratoId || !nota) {
        return res
          .status(400)
          .json({ error: "ID do prato e nota são obrigatórios" });
      }

      // Validar nota (1 a 5)
      if (nota < 1 || nota > 5) {
        return res.status(400).json({ error: "A nota deve ser entre 1 e 5" });
      }

      // Verificar se o prato existe
      const prato = await prisma.prato.findUnique({
        where: { id: Number(pratoId) },
        include: { fornecedor: true },
      });

      if (!prato) {
        return res.status(404).json({ error: "Prato não encontrado" });
      }

      // Verificar se o fornecedor do prato tem assinatura ativa
      if (!prato.fornecedor.assinaturaAtiva) {
        return res
          .status(403)
          .json({ error: "Este prato não está disponível para avaliação" });
      }

      // Verificar se o cliente já avaliou este prato
      const avaliacaoExistente = await prisma.avaliacao.findFirst({
        where: {
          pratoId: Number(pratoId),
          clienteId: userId,
        },
      });

      if (avaliacaoExistente) {
        return res.status(400).json({ error: "Você já avaliou este prato" });
      }

      // Criar avaliação
      const avaliacao = await prisma.avaliacao.create({
        data: {
          nota: Number(nota),
          comentario: comentario || "",
          pratoId: Number(pratoId),
          clienteId: userId,
        },
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
            },
          },
          prato: {
            select: {
              id: true,
              nome: true,
              fornecedorId: true,
            },
          },
        },
      });

      return res.status(201).json(avaliacao);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async atualizarAvaliacao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nota, comentario } = req.body;
      const { userId } = req;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      // Verificar se a avaliação existe e pertence ao cliente
      const avaliacaoExistente = await prisma.avaliacao.findUnique({
        where: { id: Number(id) },
      });

      if (!avaliacaoExistente) {
        return res.status(404).json({ error: "Avaliação não encontrada" });
      }

      if (avaliacaoExistente.clienteId !== userId) {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para editar esta avaliação" });
      }

      // Validar nota (1 a 5)
      if (nota && (nota < 1 || nota > 5)) {
        return res.status(400).json({ error: "A nota deve ser entre 1 e 5" });
      }

      // Atualizar dados
      const dadosAtualizados: any = {};

      if (nota) dadosAtualizados.nota = Number(nota);
      if (comentario !== undefined) dadosAtualizados.comentario = comentario;

      const avaliacaoAtualizada = await prisma.avaliacao.update({
        where: { id: Number(id) },
        data: dadosAtualizados,
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
            },
          },
          prato: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      });

      return res.json(avaliacaoAtualizada);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async excluirAvaliacao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      // Verificar se a avaliação existe e pertence ao cliente
      const avaliacaoExistente = await prisma.avaliacao.findUnique({
        where: { id: Number(id) },
      });

      if (!avaliacaoExistente) {
        return res.status(404).json({ error: "Avaliação não encontrada" });
      }

      if (avaliacaoExistente.clienteId !== userId) {
        return res
          .status(403)
          .json({
            error: "Você não tem permissão para excluir esta avaliação",
          });
      }

      // Excluir avaliação
      await prisma.avaliacao.delete({
        where: { id: Number(id) },
      });

      return res.json({ message: "Avaliação excluída com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async listarAvaliacoesPrato(req: Request, res: Response) {
    try {
      const { pratoId } = req.params;

      const avaliacoes = await prisma.avaliacao.findMany({
        where: { pratoId: Number(pratoId) },
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Calcular média das avaliações
      const totalAvaliacoes = avaliacoes.length;
      const somaNotas = avaliacoes.reduce(
        (acc: number, av: { nota: number }) => acc + av.nota,
        0
      );
      const mediaAvaliacao =
        totalAvaliacoes > 0 ? somaNotas / totalAvaliacoes : 0;

      return res.json({
        avaliacoes,
        mediaAvaliacao,
        totalAvaliacoes,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
