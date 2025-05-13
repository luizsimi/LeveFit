import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";

// Importação das rotas
import authRouter from "./routes/auth.routes";
import clienteRouter from "./routes/cliente.routes";
import fornecedorRouter from "./routes/fornecedor.routes";
import pratoRouter from "./routes/prato.routes";
import avaliacaoRouter from "./routes/avaliacao.routes";

// Carrega as variáveis de ambiente
dotenv.config();

// Inicializa o Express e o Prisma
const app = express();
const prisma = new PrismaClient();

// Configurações CORS detalhadas
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Log das requisições para depuração
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rota básica para teste
app.get("/", (req, res) => {
  res.json({ message: "API do LeveFit está funcionando!" });
});

// Definição das rotas
app.use("/auth", authRouter);
app.use("/clientes", clienteRouter);
app.use("/fornecedores", fornecedorRouter);
app.use("/pratos", pratoRouter);
app.use("/avaliacoes", avaliacaoRouter);

// Porta do servidor
const PORT = process.env.PORT || 3333;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exporta o app e o prisma para uso em outros arquivos
export { app, prisma };
