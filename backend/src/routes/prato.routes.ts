import { Router } from "express";
import { PratoController } from "../controllers/PratoController";
import { authMiddleware, isFornecedor } from "../middlewares/auth";

const pratoRouter = Router();
const pratoController = new PratoController();

// Rotas públicas
pratoRouter.get("/", (req, res) => pratoController.listarTodosPratos(req, res));
pratoRouter.get("/promocoes", (req, res) =>
  pratoController.listarPratosPromocao(req, res)
);
pratoRouter.get("/categorias", (req, res) =>
  pratoController.listarCategorias(req, res)
);
pratoRouter.get("/:id", (req, res) => pratoController.getPrato(req, res));

// Rotas protegidas para fornecedores
pratoRouter.use(authMiddleware);
pratoRouter.use(isFornecedor);

// Rotas que exigem autenticação de fornecedor
pratoRouter.post("/", (req, res) => pratoController.create(req, res));
pratoRouter.get("/fornecedor/meus-pratos", (req, res) =>
  pratoController.listarPratosFornecedor(req, res)
);
pratoRouter.put("/:id", (req, res) => pratoController.atualizarPrato(req, res));
pratoRouter.delete("/:id", (req, res) =>
  pratoController.deletarPrato(req, res)
);

export default pratoRouter;
