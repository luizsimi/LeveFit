import { Request, Response } from "express";
import { prisma } from "../server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthController {
  static async loginCliente(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios" });
      }

      const cliente = await prisma.cliente.findUnique({
        where: { email },
      });

      if (!cliente) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      const senhaCorreta = await bcrypt.compare(senha, cliente.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      const token = jwt.sign(
        { id: cliente.id, tipo: "cliente" },
        process.env.JWT_SECRET || "levefit-default-secret",
        { expiresIn: "1d" }
      );

      return res.json({
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async loginFornecedor(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios" });
      }

      const fornecedor = await prisma.fornecedor.findUnique({
        where: { email },
      });

      if (!fornecedor) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      const senhaCorreta = await bcrypt.compare(senha, fornecedor.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      const token = jwt.sign(
        { id: fornecedor.id, tipo: "fornecedor" },
        process.env.JWT_SECRET || "levefit-default-secret",
        { expiresIn: "1d" }
      );

      return res.json({
        fornecedor: {
          id: fornecedor.id,
          nome: fornecedor.nome,
          email: fornecedor.email,
          assinaturaAtiva: fornecedor.assinaturaAtiva,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
