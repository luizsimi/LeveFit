import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaCalendarAlt,
  FaEye,
  FaArrowLeft,
  FaLeaf,
  FaShare,
  FaTags,
  FaExclamationCircle,
} from "react-icons/fa";

interface BlogPost {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string;
  categoria: string;
  slug: string;
  autor: string;
  tags?: string;
  publicado: boolean;
  destaque: boolean;
  visualizacoes: number;
  createdAt: string;
  updatedAt: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postsRelacionados, setPostsRelacionados] = useState<BlogPost[]>([]);

  // Buscar post pelo slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3333/blog/${slug}`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar post:", error);
        setError("Não foi possível carregar o artigo.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Buscar posts relacionados
  useEffect(() => {
    const fetchPostsRelacionados = async () => {
      if (!post) return;

      try {
        const response = await axios.get(
          `http://localhost:3333/blog?categoria=${post.categoria}&limit=3`
        );

        // Filtrar o post atual dos resultados
        const postsRelacionadosFiltrados = response.data.posts
          .filter((p: BlogPost) => p.id !== post.id)
          .slice(0, 3);

        setPostsRelacionados(postsRelacionadosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar posts relacionados:", error);
      }
    };

    if (post) {
      fetchPostsRelacionados();
    }
  }, [post]);

  // Função para formatar a data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Função para compartilhar o post
  const compartilhar = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post?.titulo,
          text: post?.conteudo.substring(0, 100) + "...",
          url: window.location.href,
        })
        .catch((error) => console.error("Erro ao compartilhar:", error));
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-8"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6 w-1/3"></div>
            <div className="space-y-3">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                ></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-6 rounded-xl shadow-sm flex flex-col items-center text-center py-16">
              <FaExclamationCircle className="text-5xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Artigo não encontrado</h2>
              <p className="mb-6">
                {error ||
                  "O artigo solicitado não existe ou não está disponível."}
              </p>
              <Link
                to="/blog"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FaArrowLeft className="mr-2" />
                Voltar para o Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb e voltar */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <Link
                to="/"
                className="hover:text-green-600 dark:hover:text-green-400"
              >
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link
                to="/blog"
                className="hover:text-green-600 dark:hover:text-green-400"
              >
                Blog
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-500 dark:text-gray-500 truncate max-w-[200px]">
                {post.titulo}
              </span>
            </div>
            <Link
              to="/blog"
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center"
            >
              <FaArrowLeft className="mr-1.5" />
              Voltar para o Blog
            </Link>
          </div>

          {/* Imagem de capa */}
          {post.imagem && (
            <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden shadow-md">
              <img
                src={post.imagem}
                alt={post.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
          )}

          {/* Categoria e data */}
          <div className="flex items-center flex-wrap gap-3 mb-4 text-sm">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full font-medium">
              {post.categoria}
            </span>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <FaCalendarAlt className="mr-1.5" />
              {formatarData(post.createdAt)}
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <FaEye className="mr-1.5" />
              {post.visualizacoes} visualizações
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            {post.titulo}
          </h1>

          {/* Autor */}
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
              {post.autor.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <div className="font-medium text-gray-800 dark:text-white">
                {post.autor}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Autor
              </div>
            </div>
          </div>

          {/* Conteúdo do post */}
          <div className="prose prose-lg dark:prose-invert prose-green max-w-none mb-10">
            {/* Renderizar parágrafos do conteúdo */}
            {post.conteudo.split("\n").map((paragrafo, index) => (
              <p key={index}>{paragrafo}</p>
            ))}
          </div>

          {/* Tags e compartilhar */}
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 flex flex-wrap justify-between items-center">
            {post.tags && (
              <div className="flex items-start mb-4 sm:mb-0">
                <FaTags className="text-gray-400 dark:text-gray-500 mr-2 mt-1" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(",").map((tag) => (
                    <span
                      key={tag.trim()}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={compartilhar}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FaShare className="mr-2" />
              Compartilhar
            </button>
          </div>

          {/* Posts relacionados */}
          {postsRelacionados.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                <FaLeaf className="mr-2 text-green-500" />
                Artigos Relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {postsRelacionados.map((postRelacionado) => (
                  <Link
                    key={postRelacionado.id}
                    to={`/blog/${postRelacionado.slug}`}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
                  >
                    <div className="h-36 overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {postRelacionado.imagem ? (
                        <img
                          src={postRelacionado.imagem}
                          alt={postRelacionado.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-100 dark:bg-green-900/20">
                          <FaLeaf className="text-3xl text-green-500" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                        {postRelacionado.titulo}
                      </h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatarData(postRelacionado.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
