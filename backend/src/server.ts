import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";

// Importação das rotas
import authRouter from "./routes/auth.routes";
import clienteRouter from "./routes/cliente.routes";
import fornecedorRouter from "./routes/fornecedor.routes";
import pratoRouter from "./routes/prato.routes";
import avaliacaoRouter from "./routes/avaliacao.routes";
import blogRouter from "./routes/blog.routes";
import { authMiddleware, isFornecedor } from "./middlewares/auth";

// Carrega as variáveis de ambiente
dotenv.config();

// Inicializa o Express e o Prisma
const app = express();
const prisma = new PrismaClient();

// Configurar CORS
app.use(cors());

// Configurar tipo de content
app.use(express.json());

// Diretório para armazenar uploads
const uploadsDir = path.join(__dirname, "../uploads");

// Garantir que o diretório de uploads existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar diretório de uploads como estático
app.use("/uploads", express.static(uploadsDir));

// Configurar Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens
    if (!file.mimetype.match(/^image\/(jpeg|jpg|png|gif|webp)$/i)) {
      return cb(new Error("Apenas imagens são permitidas"));
    }
    cb(null, true);
  },
});

// Endpoint para upload de imagens
app.post("/upload", authMiddleware, upload.single("imagem"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    // Gerar URL completa para a imagem
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    return res.json({ imageUrl });
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    return res.status(500).json({ error: "Falha ao processar o upload" });
  }
});

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
app.use("/blog", blogRouter);

// Porta do servidor
const PORT = process.env.PORT || 3333;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exporta o app e o prisma para uso em outros arquivos
export { app, prisma };
