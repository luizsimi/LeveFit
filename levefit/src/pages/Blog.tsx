import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaSearch,
  FaRss,
  FaLeaf,
  FaBookMedical,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string;
  categoria: string;
  slug: string;
  autor: string;
  tags: string;
  publicado: boolean;
  destaque: boolean;
  visualizacoes: number;
  createdAt: string;
}

// Dados estáticos para o blog
const postsMock: BlogPost[] = [
  {
    id: 1,
    titulo: "10 Dicas para uma Alimentação Saudável no Dia a Dia",
    conteudo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Curabitur aliquet quam id dui posuere blandit.",
    imagem:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
    categoria: "Nutrição",
    slug: "dicas-alimentacao-saudavel",
    autor: "Dra. Ana Silva",
    tags: "alimentação,saúde,bem-estar",
    publicado: true,
    destaque: true,
    visualizacoes: 1520,
    createdAt: "2025-05-10T14:30:00.000Z",
  },
  {
    id: 2,
    titulo: "Os Benefícios dos Alimentos Orgânicos",
    conteudo:
      "Donec sollicitudin molestie malesuada. Nulla quis lorem ut libero malesuada feugiat. Nulla porttitor accumsan tincidunt.",
    imagem:
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1974&auto=format&fit=crop",
    categoria: "Alimentos",
    slug: "beneficios-alimentos-organicos",
    autor: "Carlos Mendes",
    tags: "orgânicos,saúde,alimentos",
    publicado: true,
    destaque: false,
    visualizacoes: 980,
    createdAt: "2025-05-07T10:15:00.000Z",
  },
  {
    id: 3,
    titulo: "Proteínas Vegetais: O Guia Completo",
    conteudo:
      "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
    imagem:
      "https://images.unsplash.com/photo-1540914124281-342587941389?q=80&w=2074&auto=format&fit=crop",
    categoria: "Nutrição",
    slug: "proteinas-vegetais",
    autor: "Dra. Paula Costa",
    tags: "proteínas,vegetariano,nutrição",
    publicado: true,
    destaque: false,
    visualizacoes: 1240,
    createdAt: "2025-05-03T09:45:00.000Z",
  },
  {
    id: 4,
    titulo: "Jejum Intermitente: Prós e Contras",
    conteudo:
      "Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Donec rutrum congue leo eget malesuada.",
    imagem:
      "https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=2070&auto=format&fit=crop",
    categoria: "Dietas",
    slug: "jejum-intermitente",
    autor: "Dr. Roberto Alves",
    tags: "jejum,dieta,saúde",
    publicado: true,
    destaque: false,
    visualizacoes: 2150,
    createdAt: "2025-04-28T16:20:00.000Z",
  },
  {
    id: 5,
    titulo: "Receitas Fit para o Café da Manhã",
    conteudo:
      "Pellentesque in ipsum id orci porta dapibus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.",
    imagem:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88815?q=80&w=2070&auto=format&fit=crop",
    categoria: "Receitas",
    slug: "receitas-cafe-manha",
    autor: "Juliana Pires",
    tags: "receitas,café da manhã,fit",
    publicado: true,
    destaque: false,
    visualizacoes: 1890,
    createdAt: "2025-04-21T08:30:00.000Z",
  },
  {
    id: 6,
    titulo: "Como Montar Marmitas Saudáveis para a Semana",
    conteudo:
      "Proin eget tortor risus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    imagem:
      "https://images.unsplash.com/photo-1545216560-68430ad77342?q=80&w=2070&auto=format&fit=crop",
    categoria: "Dicas",
    slug: "marmitas-saudaveis",
    autor: "Marina Souza",
    tags: "marmitas,organização,alimentação",
    publicado: true,
    destaque: false,
    visualizacoes: 3200,
    createdAt: "2025-04-15T11:40:00.000Z",
  },
];

const categoriasMock = [
  "Todos",
  "Nutrição",
  "Alimentos",
  "Dietas",
  "Receitas",
  "Dicas",
];

const Blog = () => {
  const [categoriaFiltrada, setCategoriaFiltrada] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Post em destaque é o primeiro da lista
  const postDestaque = postsMock.find((post) => post.destaque);

  // Posts filtrados
  const filteredPosts = postsMock.filter((post) => {
    // Não incluir o post de destaque na lista principal
    if (post.id === postDestaque?.id) return false;

    // Filtrar por categoria
    if (
      categoriaFiltrada &&
      categoriaFiltrada !== "Todos" &&
      post.categoria !== categoriaFiltrada
    )
      return false;

    // Filtrar por termo de busca
    if (
      searchTerm &&
      !post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !post.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  // Lidar com filtro de categoria
  const handleCategoriaFilter = (categoria: string | null) => {
    setCategoriaFiltrada(categoria);
  };

  // Lidar com busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
          </p>
        </div>

        {/* Barra de ferramentas: busca e filtros */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 mb-8">
          {/* Busca */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar artigos..."
                className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Filtros de categoria */}
          <div className="overflow-x-auto py-2 flex items-center">
            <div className="flex space-x-2">
              {categoriasMock.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() =>
                    handleCategoriaFilter(
                      categoria === "Todos" ? null : categoria
                    )
                  }
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    (categoria === "Todos" && !categoriaFiltrada) ||
                    categoria === categoriaFiltrada
                      ? "bg-green-600 dark:bg-green-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Post em destaque */}
        {postDestaque && !categoriaFiltrada && !searchTerm && (
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-auto bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  <img
                    src={postDestaque.imagem}
                    alt={postDestaque.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Em destaque
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="block mb-2 text-green-600 dark:text-green-400 font-medium text-sm">
                      {postDestaque.categoria}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      {postDestaque.titulo}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {postDestaque.conteudo}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <FaUser className="mr-1" />
                      <span className="mr-4">{postDestaque.autor}</span>
                      <FaClock className="mr-1" />
                      <span>{formatarData(postDestaque.createdAt)}</span>
                    </div>
                    <Link
                      to={`/blog/${postDestaque.slug}`}
                      className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Ler artigo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <img
                  src={post.imagem}
                  alt={post.titulo}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {post.categoria}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {post.titulo}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {post.conteudo}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <FaUser className="mr-1" />
                    <span>{post.autor}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    <span>{formatarData(post.createdAt)}</span>
                  </div>
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-block w-full text-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-green-600 dark:text-green-400 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Ler artigo
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há posts */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FaRss className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? `Não encontramos resultados para "${searchTerm}"`
                : "Não há posts disponíveis nesta categoria."}
            </p>
            <button
              onClick={() => {
                setCategoriaFiltrada(null);
                setSearchTerm("");
              }}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Ver todos os posts
            </button>
          </div>
        )}

        {/* Inscrição para newsletter */}
        <div className="mt-16 bg-gradient-to-r from-green-500 to-green-700 dark:from-green-700 dark:to-green-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <FaLeaf className="text-3xl text-white mb-3" />
              <h3 className="text-xl font-bold mb-2">
                Receba nossas novidades
              </h3>
              <p className="text-green-100">
                Inscreva-se para receber conteúdos exclusivos sobre alimentação
                saudável
              </p>
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-green-900 hover:bg-green-800 rounded-r-lg font-medium transition-colors"
                >
                  Inscrever
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
