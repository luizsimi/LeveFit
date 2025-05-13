import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
  id: number;
  tipo: "cliente" | "fornecedor";
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authorization.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "levefit-default-secret"
    ) as TokenPayload;

    req.userId = decoded.id;
    req.userType = decoded.tipo;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// Middleware para verificar se o usuário é um fornecedor
export function isFornecedor(req: Request, res: Response, next: NextFunction) {
  if (req.userType !== "fornecedor") {
    return res
      .status(403)
      .json({ error: "Acesso permitido apenas para fornecedores" });
  }

  return next();
}

// Middleware para verificar se o usuário é um cliente
export function isCliente(req: Request, res: Response, next: NextFunction) {
  if (req.userType !== "cliente") {
    return res
      .status(403)
      .json({ error: "Acesso permitido apenas para clientes" });
  }

  return next();
}
