import { Router } from "express";
import { ClienteController } from "../controllers/ClienteController";
import { authMiddleware, isCliente } from "../middlewares/auth";

const clienteRouter = Router();
const clienteController = new ClienteController();

// Rota pública para cadastro
clienteRouter.post("/", (req, res) => clienteController.create(req, res));

// Rotas protegidas
clienteRouter.use(authMiddleware);
clienteRouter.use(isCliente);

// Rotas que exigem autenticação
clienteRouter.get("/perfil", (req, res) =>
  clienteController.getProfile(req, res)
);
clienteRouter.put("/perfil", (req, res) =>
  clienteController.updateProfile(req, res)
);

export default clienteRouter;
