import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const authRouter = Router();

// Rotas de autenticação
authRouter.post("/login/cliente", AuthController.loginCliente);
authRouter.post("/login/fornecedor", AuthController.loginFornecedor);

export default authRouter;
