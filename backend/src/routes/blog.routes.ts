import { Router } from "express";
import { BlogController } from "../controllers/BlogController";
import { authMiddleware } from "../middlewares/auth";

const blogRouter = Router();
const blogController = new BlogController();

// Rotas públicas
blogRouter.get("/", (req, res) => blogController.listarPosts(req, res));
blogRouter.get("/categorias", (req, res) =>
  blogController.listarCategorias(req, res)
);
blogRouter.get("/:slug", (req, res) => blogController.getPostBySlug(req, res));

// Rotas protegidas para administradores
blogRouter.use(authMiddleware);
// Adicione aqui um middleware para verificar se é admin

// Rotas que exigem autenticação
blogRouter.post("/", (req, res) => blogController.create(req, res));
blogRouter.put("/:id", (req, res) => blogController.atualizarPost(req, res));
blogRouter.delete("/:id", (req, res) => blogController.deletarPost(req, res));

export default blogRouter;
