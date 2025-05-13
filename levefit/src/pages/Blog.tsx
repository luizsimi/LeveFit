import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogPostCard from "../components/BlogPostCard";
import { FaSearch, FaRss, FaLeaf, FaBookMedical } from "react-icons/fa";

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

interface BlogResponse {
  posts: BlogPost[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postDestaque, setPostDestaque] = useState<BlogPost | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaFiltrada, setCategoriaFiltrada] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  // Buscar posts do blog
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let url = `http://localhost:3333/blog?page=${pagination.currentPage}&limit=9`;

        if (categoriaFiltrada) {
          url += `&categoria=${categoriaFiltrada}`;
        }

        if (searchTerm) {
          url += `&search=${searchTerm}`;
        }

        const response = await axios.get<BlogResponse>(url);
        const data = response.data;

        setPosts(data.posts);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          total: data.total,
        });

        // Se estivermos na primeira página e não estiver filtrando/buscando,
        // separar o post em destaque (se houver)
        if (pagination.currentPage === 1 && !categoriaFiltrada && !searchTerm) {
          const destaques = data.posts.filter((post) => post.destaque);
          if (destaques.length > 0) {
            setPostDestaque(destaques[0]);
            // Remover o post em destaque da lista principal
            setPosts(data.posts.filter((post) => post.id !== destaques[0].id));
          } else {
            setPostDestaque(null);
          }
        } else {
          setPostDestaque(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar posts do blog:", error);
        setError("Erro ao carregar posts do blog.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, [pagination.currentPage, categoriaFiltrada, searchTerm]);

  // Buscar categorias do blog
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3333/blog/categorias"
        );
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  // Lidar com mudança de página
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  // Lidar com filtro de categoria
  const handleCategoriaFilter = (categoria: string | null) => {
    setCategoriaFiltrada(categoria);
    setPagination({ ...pagination, currentPage: 1 });
  };

  // Lidar com busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setPagination({ ...pagination, currentPage: 1 });
  };

  // Renderizar paginação
  const renderPagination = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;

    // Sempre mostrar primeira página
    pages.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            : "bg-white text-green-600 hover:bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
        }`}
      >
        1
      </button>
    );

    // Lógica para mostrar páginas próximas à atual
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adicionar elipses se necessário
    if (startPage > 2) {
      pages.push(
        <span key="ellipsis1" className="px-2">
          ...
        </span>
      );
    }

    // Adicionar páginas intermediárias
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? "bg-green-600 text-white dark:bg-green-700"
              : "bg-white text-green-600 hover:bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    // Adicionar elipses se necessário
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis2" className="px-2">
          ...
        </span>
      );
    }

    // Sempre mostrar última página se houver mais de uma
    if (totalPages > 1) {
      pages.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "bg-green-600 text-white dark:bg-green-700"
              : "bg-white text-green-600 hover:bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-white text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
        >
          Anterior
        </button>
        <div className="flex items-center">{pages}</div>
        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-white text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
        >
          Próxima
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header do Blog */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center">
              <FaBookMedical className="text-xl" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Blog LeveFit
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Dicas e conteúdos sobre alimentação saudável, nutrição e bem-estar
            para ajudar você a manter uma vida equilibrada.
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barra de busca */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por título, conteúdo ou tag..."
                  className="flex-1 border border-gray-200 dark:border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            {/* Filtro de categorias */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoriaFilter(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  categoriaFiltrada === null
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Todos
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => handleCategoriaFilter(categoria)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    categoriaFiltrada === categoria
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Post em destaque */}
        {postDestaque && !isSearching && !categoriaFiltrada && (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
              <FaLeaf className="mr-2 text-green-500" />
              Em Destaque
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <div className="md:flex">
                <div className="md:w-2/5 h-64 md:h-auto relative">
                  {postDestaque.imagem ? (
                    <img
                      src={postDestaque.imagem}
                      alt={postDestaque.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <FaLeaf className="text-4xl text-green-500" />
                    </div>
                  )}
                </div>
                <div className="md:w-3/5 p-6 flex flex-col">
                  <div className="flex items-center mb-3">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                      {postDestaque.categoria}
                    </span>
                    <div className="flex items-center ml-4 text-sm text-gray-500 dark:text-gray-400">
                      <FaCalendarAlt className="mr-1.5 text-gray-400" />
                      {new Date(postDestaque.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    {postDestaque.titulo}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {postDestaque.conteudo.substring(0, 200)}...
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Por: {postDestaque.autor}
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <FaEye className="mr-1.5" />
                        {postDestaque.visualizacoes} visualizações
                      </div>
                      <a
                        href={`/blog/${postDestaque.slug}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Ler artigo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de posts */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
            <FaRss className="mr-2 text-green-500" />
            {isSearching
              ? `Resultados para "${searchTerm}"`
              : categoriaFiltrada
              ? `Artigos sobre ${categoriaFiltrada}`
              : "Artigos Recentes"}
            {pagination.total > 0 && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({pagination.total} artigo{pagination.total !== 1 ? "s" : ""})
              </span>
            )}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md h-80"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
              <FaSearch className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nenhum artigo encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isSearching
                  ? `Não encontramos resultados para "${searchTerm}"`
                  : categoriaFiltrada
                  ? `Não há artigos na categoria ${categoriaFiltrada}`
                  : "Não há artigos publicados ainda"}
              </p>
              {(isSearching || categoriaFiltrada) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoriaFiltrada(null);
                    setIsSearching(false);
                  }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ver todos os artigos
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    id={post.id}
                    titulo={post.titulo}
                    conteudo={post.conteudo}
                    imagem={post.imagem}
                    categoria={post.categoria}
                    slug={post.slug}
                    autor={post.autor}
                    visualizacoes={post.visualizacoes}
                    createdAt={post.createdAt}
                  />
                ))}
              </div>

              {/* Paginação */}
              {pagination.totalPages > 1 && renderPagination()}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
