import { Request, Response } from "express";
import { prisma } from "../server";
import bcrypt from "bcrypt";

export class FornecedorController {
  async create(req: Request, res: Response) {
    try {
      const { nome, email, senha, whatsapp, descricao, logo } = req.body;

      if (!nome || !email || !senha || !whatsapp) {
        return res
          .status(400)
          .json({ error: "Nome, email, senha e whatsapp são obrigatórios" });
      }

      // Verificar se o email já está em uso
      const fornecedorExistente = await prisma.fornecedor.findUnique({
        where: { email },
      });

      if (fornecedorExistente) {
        return res.status(400).json({ error: "Este email já está em uso" });
      }

      // Hash da senha
      const hashSenha = await bcrypt.hash(senha, 10);

      // Criar fornecedor
      const fornecedor = await prisma.fornecedor.create({
        data: {
          nome,
          email,
          senha: hashSenha,
          whatsapp,
          descricao,
          logo,
          status: true,
          assinaturaAtiva: false, // Por padrão, a assinatura não está ativa
        },
      });

      return res.status(201).json({
        id: fornecedor.id,
        nome: fornecedor.nome,
        email: fornecedor.email,
        whatsapp: fornecedor.whatsapp,
        assinaturaAtiva: fornecedor.assinaturaAtiva,
        createdAt: fornecedor.createdAt,
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

      const fornecedor = await prisma.fornecedor.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nome: true,
          email: true,
          whatsapp: true,
          descricao: true,
          logo: true,
          status: true,
          assinaturaAtiva: true,
          createdAt: true,
          updatedAt: true,
          pratos: {
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
          },
        },
      });

      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }

      return res.json(fornecedor);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { nome, whatsapp, descricao, logo, senha } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      // Verificar se o fornecedor existe
      const fornecedorExistente = await prisma.fornecedor.findUnique({
        where: { id: userId },
      });

      if (!fornecedorExistente) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }

      // Atualizar dados
      const dadosAtualizados: any = {};

      if (nome) dadosAtualizados.nome = nome;
      if (whatsapp) dadosAtualizados.whatsapp = whatsapp;
      if (descricao !== undefined) dadosAtualizados.descricao = descricao;
      if (logo !== undefined) dadosAtualizados.logo = logo;
      if (senha) dadosAtualizados.senha = await bcrypt.hash(senha, 10);

      const fornecedorAtualizado = await prisma.fornecedor.update({
        where: { id: userId },
        data: dadosAtualizados,
        select: {
          id: true,
          nome: true,
          email: true,
          whatsapp: true,
          descricao: true,
          logo: true,
          status: true,
          assinaturaAtiva: true,
          updatedAt: true,
        },
      });

      return res.json(fornecedorAtualizado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async ativarAssinatura(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Em um cenário real, essa chamada seria feita após confirmação de pagamento
      // de uma API de pagamento como Stripe, PagSeguro, etc.

      const fornecedor = await prisma.fornecedor.update({
        where: { id: Number(id) },
        data: { assinaturaAtiva: true },
        select: {
          id: true,
          nome: true,
          email: true,
          assinaturaAtiva: true,
        },
      });

      return res.json({
        message: "Assinatura ativada com sucesso",
        fornecedor,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async listarFornecedoresAtivos(req: Request, res: Response) {
    try {
      const fornecedores = await prisma.fornecedor.findMany({
        where: {
          status: true,
          assinaturaAtiva: true,
        },
        select: {
          id: true,
          nome: true,
          descricao: true,
          logo: true,
          whatsapp: true,
        },
      });

      return res.json(fornecedores);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
