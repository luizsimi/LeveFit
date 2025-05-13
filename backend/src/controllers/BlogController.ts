import { Request, Response } from "express";
import { prisma } from "../server";
import { CreateBlogPostDTO, UpdateBlogPostDTO } from "../types/blog";

export class BlogController {
  // Criar um novo post
  async create(req: Request, res: Response) {
    try {
      const {
        titulo,
        conteudo,
        imagem,
        categoria,
        slug,
        autor,
        tags,
        publicado,
        destaque,
      }: CreateBlogPostDTO = req.body;

      if (!titulo || !conteudo || !categoria) {
        return res.status(400).json({
          error: "Título, conteúdo e categoria são obrigatórios",
        });
      }

      // Gerar slug a partir do título se não for fornecido
      const slugFormatado =
        slug ||
        titulo
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-");

      // Verificar se já existe um post com este slug
      const postExistente = await prisma.blogPost.findUnique({
        where: { slug: slugFormatado },
      });

      if (postExistente) {
        return res.status(400).json({
          error:
            "Já existe um post com este slug. Por favor, escolha outro título ou forneça um slug personalizado.",
        });
      }

      const post = await prisma.blogPost.create({
        data: {
          titulo,
          conteudo,
          imagem: imagem || null,
          categoria,
          slug: slugFormatado,
          autor: autor || "Equipe LeveFit",
          tags: tags || null,
          publicado: publicado !== undefined ? publicado : true,
          destaque: destaque || false,
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error("Erro ao criar post:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Listar todos os posts (com paginação)
  async listarPosts(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, categoria, destaque, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const filtro: any = {
        publicado: true, // Por padrão, mostrar apenas posts publicados
      };

      // Filtro por categoria
      if (categoria) {
        filtro.categoria = String(categoria);
      }

      // Filtro por destaque
      if (destaque === "true") {
        filtro.destaque = true;
      }

      // Filtro por pesquisa em título ou conteúdo
      if (search) {
        filtro.OR = [
          { titulo: { contains: String(search) } },
          { conteudo: { contains: String(search) } },
          { tags: { contains: String(search) } },
        ];
      }

      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where: filtro,
          orderBy: { createdAt: "desc" },
          skip,
          take: Number(limit),
        }),
        prisma.blogPost.count({ where: filtro }),
      ]);

      return res.json({
        posts,
        total,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
      });
    } catch (error) {
      console.error("Erro ao listar posts:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Listar categorias de blog
  async listarCategorias(req: Request, res: Response) {
    try {
      const posts = await prisma.blogPost.findMany({
        where: { publicado: true },
        select: { categoria: true },
        distinct: ["categoria"],
      });

      const categorias = posts.map((post) => post.categoria);

      return res.json(categorias);
    } catch (error) {
      console.error("Erro ao listar categorias:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Obter um post específico pelo slug
  async getPostBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const post = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (!post) {
        return res.status(404).json({ error: "Post não encontrado" });
      }

      // Incrementar visualizações
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { visualizacoes: post.visualizacoes + 1 },
      });

      // Retornar o post com visualizações já incrementadas
      post.visualizacoes += 1;

      return res.json(post);
    } catch (error) {
      console.error("Erro ao buscar post:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Atualizar um post
  async atualizarPost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        titulo,
        conteudo,
        imagem,
        categoria,
        slug,
        autor,
        tags,
        publicado,
        destaque,
      }: UpdateBlogPostDTO = req.body;

      // Verificar se o post existe
      const postExistente = await prisma.blogPost.findUnique({
        where: { id: Number(id) },
      });

      if (!postExistente) {
        return res.status(404).json({ error: "Post não encontrado" });
      }

      // Se estiver modificando o slug, verificar se já existe outro post com este slug
      if (slug && slug !== postExistente.slug) {
        const slugConflito = await prisma.blogPost.findUnique({
          where: { slug },
        });

        if (slugConflito && slugConflito.id !== Number(id)) {
          return res.status(400).json({
            error:
              "Já existe outro post com este slug. Por favor, escolha outro.",
          });
        }
      }

      const post = await prisma.blogPost.update({
        where: { id: Number(id) },
        data: {
          titulo,
          conteudo,
          imagem,
          categoria,
          slug,
          autor,
          tags,
          publicado,
          destaque,
        },
      });

      return res.json(post);
    } catch (error) {
      console.error("Erro ao atualizar post:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Excluir um post
  async deletarPost(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const post = await prisma.blogPost.findUnique({
        where: { id: Number(id) },
      });

      if (!post) {
        return res.status(404).json({ error: "Post não encontrado" });
      }

      await prisma.blogPost.delete({
        where: { id: Number(id) },
      });

      return res.json({ message: "Post excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
