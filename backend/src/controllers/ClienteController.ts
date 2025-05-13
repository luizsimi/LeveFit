import { Request, Response } from "express";
import { prisma } from "../server";
import bcrypt from "bcrypt";

export class ClienteController {
  async create(req: Request, res: Response) {
    try {
      const { nome, email, senha, endereco, telefone } = req.body;

      if (!nome || !email || !senha) {
        return res
          .status(400)
          .json({ error: "Nome, email e senha são obrigatórios" });
      }

      // Verificar se o email já está em uso
      const clienteExistente = await prisma.cliente.findUnique({
        where: { email },
      });

      if (clienteExistente) {
        return res.status(400).json({ error: "Este email já está em uso" });
      }

      // Hash da senha
      const hashSenha = await bcrypt.hash(senha, 10);

      // Criar cliente
      const cliente = await prisma.cliente.create({
        data: {
          nome,
          email,
          senha: hashSenha,
          endereco,
          telefone,
        },
      });

      return res.status(201).json({
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        createdAt: cliente.createdAt,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      const cliente = await prisma.cliente.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nome: true,
          email: true,
          endereco: true,
          telefone: true,
          createdAt: true,
          updatedAt: true,
          avaliacoes: {
            select: {
              id: true,
              nota: true,
              comentario: true,
              prato: {
                select: {
                  id: true,
                  nome: true,
                  fornecedor: {
                    select: {
                      id: true,
                      nome: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      return res.json(cliente);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { nome, endereco, telefone, senha } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      // Verificar se o cliente existe
      const clienteExistente = await prisma.cliente.findUnique({
        where: { id: userId },
      });

      if (!clienteExistente) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      // Atualizar dados
      const dadosAtualizados: any = {};

      if (nome) dadosAtualizados.nome = nome;
      if (endereco) dadosAtualizados.endereco = endereco;
      if (telefone) dadosAtualizados.telefone = telefone;
      if (senha) dadosAtualizados.senha = await bcrypt.hash(senha, 10);

      const clienteAtualizado = await prisma.cliente.update({
        where: { id: userId },
        data: dadosAtualizados,
        select: {
          id: true,
          nome: true,
          email: true,
          endereco: true,
          telefone: true,
          updatedAt: true,
        },
      });

      return res.json(clienteAtualizado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
