import { Router } from "express";
import { AvaliacaoController } from "../controllers/AvaliacaoController";
import { authMiddleware, isCliente } from "../middlewares/auth";

const avaliacaoRouter = Router();
const avaliacaoController = new AvaliacaoController();

// Rota pública para listar avaliações de um prato
avaliacaoRouter.get("/prato/:pratoId", (req, res) =>
  avaliacaoController.listarAvaliacoesPrato(req, res)
);

// Rotas protegidas para clientes
avaliacaoRouter.use(authMiddleware);
avaliacaoRouter.use(isCliente);

// Rotas que exigem autenticação de cliente
avaliacaoRouter.post("/", (req, res) =>
  avaliacaoController.criarAvaliacao(req, res)
);
avaliacaoRouter.put("/:id", (req, res) =>
  avaliacaoController.atualizarAvaliacao(req, res)
);
avaliacaoRouter.delete("/:id", (req, res) =>
  avaliacaoController.excluirAvaliacao(req, res)
);

export default avaliacaoRouter;
