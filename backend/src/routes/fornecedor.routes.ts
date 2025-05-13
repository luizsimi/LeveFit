import { Router } from "express";
import { FornecedorController } from "../controllers/FornecedorController";
import { authMiddleware, isFornecedor } from "../middlewares/auth";

const fornecedorRouter = Router();
const fornecedorController = new FornecedorController();

// Rotas públicas
fornecedorRouter.post("/", (req, res) => fornecedorController.create(req, res));
fornecedorRouter.get("/ativos", (req, res) =>
  fornecedorController.listarFornecedoresAtivos(req, res)
);
fornecedorRouter.post("/:id/ativar-assinatura", (req, res) =>
  fornecedorController.ativarAssinatura(req, res)
);

// Rotas protegidas
fornecedorRouter.use(authMiddleware);
fornecedorRouter.use(isFornecedor);

// Rotas que exigem autenticação
fornecedorRouter.get("/perfil", (req, res) =>
  fornecedorController.getProfile(req, res)
);
fornecedorRouter.put("/perfil", (req, res) =>
  fornecedorController.updateProfile(req, res)
);

export default fornecedorRouter;
