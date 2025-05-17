import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaRegStar,
  FaComments,
  FaUserEdit,
  FaSignOutAlt,
  FaCheck,
  FaUtensils,
  FaExclamationCircle,
  FaSpinner,
  FaTimes,
  FaTag,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import UserProfileModal from "../components/UserProfileModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string;
  categoria: string;
  disponivel: boolean;
  avaliacoes: Avaliacao[];
}

interface Avaliacao {
  id: number;
  nota: number;
  comentario: string;
  cliente: {
    id: number;
    nome: string;
  };
  createdAt: string;
}

interface Fornecedor {
  id: number;
  nome: string;
  email: string;
  whatsapp: string;
  descricao?: string;
  logo?: string;
  status: boolean;
  assinaturaAtiva: boolean;
}

interface ErrorResponse {
  error: string;
}

const FornecedorDashboard = () => {
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarAvaliacoes, setMostrarAvaliacoes] = useState(false);
  const [pratosComAvaliacoes, setPratosComAvaliacoes] = useState<Prato[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pratos");
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    console.log("FornecedorDashboard - Carregando dados");
    const buscarDados = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        console.log(
          "FornecedorDashboard - Token:",
          token ? "Existe" : "Não existe"
        );

        // Buscar dados do fornecedor
        const fornecedorResponse = await axios.get(
          "http://localhost:3333/fornecedores/perfil",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "FornecedorDashboard - Dados recebidos:",
          fornecedorResponse.data
        );
        setFornecedor(fornecedorResponse.data);
        setPratos(fornecedorResponse.data.pratos || []);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          // Se receber erro 401 ou 403, redirecionar para a página inicial
          if (
            axiosError.response &&
            (axiosError.response.status === 401 ||
              axiosError.response.status === 403)
          ) {
            // Usar a função logout do contexto
            logout();
            navigate("/");
          } else {
            setError("Erro ao carregar dados do seu perfil.");
          }
        } else {
          setError("Ocorreu um erro inesperado.");
        }

        setLoading(false);
      }
    };

    buscarDados();
  }, [navigate, logout]);

  const calcularMediaAvaliacoes = (avaliacoes: Avaliacao[]) => {
    if (avaliacoes.length === 0) return 0;
    const soma = avaliacoes.reduce((acc, av) => acc + av.nota, 0);
    return soma / avaliacoes.length;
  };

  const formatarPreco = (preco: number) => {
    return preco.toFixed(2).replace(".", ",");
  };

  const handleNovoPrato = () => {
    navigate("/dashboard/fornecedor/novo-prato");
  };

  const handleEditarPrato = (id: number) => {
    navigate(`/dashboard/fornecedor/editar-prato/${id}`);
  };

  const handleExcluirPrato = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este prato?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3333/pratos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Atualizar a lista de pratos após excluir
      setPratos(pratos.filter((prato) => prato.id !== id));
    } catch (error) {
      console.error("Erro ao excluir prato:", error);
      alert("Erro ao excluir o prato.");
    }
  };

  // Função para renderizar estrelas
  const renderEstrelas = (nota: number) => {
    const estrelas = [];
    const notaArredondada = Math.round(nota);

    for (let i = 1; i <= 5; i++) {
      if (i <= notaArredondada) {
        estrelas.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        estrelas.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return <div className="flex">{estrelas}</div>;
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

  // Calcular total de avaliações de todos os pratos
  const calcularTotalAvaliacoes = () => {
    return pratos.reduce((total, prato) => total + prato.avaliacoes.length, 0);
  };

  // Buscar pratos com avaliações
  const buscarPratosComAvaliacoes = () => {
    const filtrados = pratos.filter((prato) => prato.avaliacoes.length > 0);
    setPratosComAvaliacoes(filtrados);
    setMostrarAvaliacoes(true);
    setActiveTab("avaliacoes");
  };

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    const totalPratos = pratos.length;
    const pratosDisponiveis = pratos.filter((prato) => prato.disponivel).length;
    const totalAvaliacoes = calcularTotalAvaliacoes();
    const mediaPratos =
      totalPratos > 0
        ? pratos.reduce((acc, prato) => acc + prato.preco, 0) / totalPratos
        : 0;

    return {
      totalPratos,
      pratosDisponiveis,
      totalAvaliacoes,
      mediaPratos,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-green-600 dark:text-green-400 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Carregando dashboard...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center">
            <FaExclamationCircle className="text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white px-5 py-2.5 rounded-lg hover:shadow-md transition-all duration-300"
          >
            Voltar para a página inicial
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Estatísticas para o dashboard
  const stats = calcularEstatisticas();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header modernizado */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white mr-2 shadow-sm">
                  <FaUtensils />
                </div>
                Dashboard Fornecedor
                {fornecedor?.assinaturaAtiva ? (
                  <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/40">
                    <FaCheck className="mr-1" /> Assinatura Ativa
                  </span>
                ) : (
                  <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/40">
                    <FaTimes className="mr-1" /> Assinatura Inativa
                  </span>
                )}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => (window.location.href = "/")}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Ir para o site"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center space-x-1 text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                <FaSignOutAlt className="text-gray-500 dark:text-gray-400" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="mb-6">
            {fornecedor && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  {fornecedor.logo ? (
                    <img
                      src={fornecedor.logo}
                      alt={fornecedor.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 text-white">
                      {fornecedor.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {fornecedor.nome}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {fornecedor.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1">
            <button
              onClick={() => {
                setActiveTab("pratos");
                setMostrarAvaliacoes(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "pratos"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaUtensils
                className={
                  activeTab === "pratos"
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              />
              <span>Meus Pratos</span>
            </button>

            <button
              onClick={buscarPratosComAvaliacoes}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "avaliacoes"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              disabled={calcularTotalAvaliacoes() === 0}
            >
              <FaComments
                className={
                  activeTab === "avaliacoes"
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              />
              <span>Avaliações</span>
              {calcularTotalAvaliacoes() > 0 && (
                <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 rounded-full font-medium">
                  {calcularTotalAvaliacoes()}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaUserEdit className="text-gray-500 dark:text-gray-400" />
              <span>Editar Perfil</span>
            </button>

            <button
              onClick={() => navigate("/dashboard/fornecedor/assinatura")}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg ${
                fornecedor?.assinaturaAtiva
                  ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  : "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 font-medium"
              } transition-colors`}
            >
              <FaTag
                className={
                  fornecedor?.assinaturaAtiva
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-yellow-500 dark:text-yellow-400"
                }
              />
              <span>
                {fornecedor?.assinaturaAtiva
                  ? "Gerenciar Assinatura"
                  : "Ativar Assinatura"}
              </span>
            </button>
          </nav>

          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300">
              <p className="font-medium text-green-800 dark:text-green-400 mb-1">
                Dica do dia
              </p>
              <p>
                Mantenha suas descrições detalhadas e atualize suas fotos
                regularmente para atrair mais clientes.
              </p>
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Cabeçalho e Boas-vindas */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {fornecedor
                ? `Olá, ${fornecedor.nome.split(" ")[0]}!`
                : "Carregando..."}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Bem-vindo ao seu painel de controle. Gerencie seus pratos e
              acompanhe seu desempenho.
            </p>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <FaUtensils className="text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total de Pratos
                  </h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.totalPratos}
                    </p>
                    {stats.totalPratos > 0 &&
                      stats.pratosDisponiveis < stats.totalPratos && (
                        <p className="ml-2 text-xs text-red-600 dark:text-red-400">
                          {stats.totalPratos - stats.pratosDisponiveis}{" "}
                          indisponível
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <FaCheck className="text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Disponíveis
                  </h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.pratosDisponiveis}
                    </p>
                    {stats.totalPratos > 0 && (
                      <p className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        de {stats.totalPratos} (
                        {Math.round(
                          (stats.pratosDisponiveis / stats.totalPratos) * 100
                        )}
                        %)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                  <FaStar className="text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Avaliações
                  </h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.totalAvaliacoes}
                    </p>
                    {calcularTotalAvaliacoes() > 0 && (
                      <button
                        onClick={buscarPratosComAvaliacoes}
                        className="ml-2 text-xs text-blue-600 dark:text-blue-400 flex items-center hover:underline"
                      >
                        Ver todas{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                  <FaTag className="text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Preço Médio
                  </h3>
                  <div className="mt-1">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      R$ {stats.mediaPratos.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo da Tab */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Cabeçalho da Tab */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="px-6 flex space-x-4">
                <button
                  onClick={() => {
                    setActiveTab("pratos");
                    setMostrarAvaliacoes(false);
                  }}
                  className={`py-4 px-1 relative font-medium text-sm whitespace-nowrap ${
                    activeTab === "pratos"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  } focus:outline-none`}
                >
                  <span className="flex items-center">
                    <FaUtensils className="mr-2" /> Meus Pratos
                  </span>
                  {activeTab === "pratos" && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-600 dark:bg-green-400"></span>
                  )}
                </button>

                {calcularTotalAvaliacoes() > 0 && (
                  <button
                    onClick={buscarPratosComAvaliacoes}
                    className={`py-4 px-1 relative font-medium text-sm whitespace-nowrap ${
                      activeTab === "avaliacoes"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    } focus:outline-none`}
                  >
                    <span className="flex items-center">
                      <FaComments className="mr-2" /> Avaliações
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        {calcularTotalAvaliacoes()}
                      </span>
                    </span>
                    {activeTab === "avaliacoes" && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-600 dark:bg-green-400"></span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Conteúdo da Tab atual */}
            <div className="p-6">
              {/* Cabeçalho com ações */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-0">
                  {activeTab === "pratos"
                    ? "Gerenciar Pratos"
                    : "Avaliações dos Clientes"}
                </h3>

                {activeTab === "pratos" && (
                  <button
                    onClick={handleNovoPrato}
                    className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors"
                  >
                    <FaPlus className="mr-2" /> Novo Prato
                  </button>
                )}
              </div>

              {/* Exibição de avaliações ou pratos */}
              {mostrarAvaliacoes ? (
                // Conteúdo de avaliações
                <div className="animate-fadeIn space-y-6">
                  {pratosComAvaliacoes.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                        <FaComments className="text-2xl" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                        Sem avaliações
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Ainda não há avaliações para seus pratos
                      </p>
                      <button
                        onClick={() => {
                          setMostrarAvaliacoes(false);
                          setActiveTab("pratos");
                        }}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Voltar para meus pratos
                      </button>
                    </div>
                  ) : (
                    <div>
                      {pratosComAvaliacoes.map((prato) => (
                        <div
                          key={prato.id}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6 last:mb-0"
                        >
                          <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                              {prato.imagem ? (
                                <img
                                  src={prato.imagem}
                                  alt={prato.nome}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400">
                                  <FaUtensils />
                                </div>
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {prato.nome}
                              </h4>
                              <div className="flex items-center mt-1">
                                <div className="flex mr-1 text-yellow-400">
                                  {renderEstrelas(
                                    calcularMediaAvaliacoes(prato.avaliacoes)
                                  )}
                                </div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  {calcularMediaAvaliacoes(
                                    prato.avaliacoes
                                  ).toFixed(1)}
                                  <span className="ml-1 text-gray-500 dark:text-gray-500 font-normal">
                                    ({prato.avaliacoes.length}{" "}
                                    {prato.avaliacoes.length === 1
                                      ? "avaliação"
                                      : "avaliações"}
                                    )
                                  </span>
                                </span>
                              </div>
                            </div>
                            <Link
                              to={`/dashboard/fornecedor/editar-prato/${prato.id}`}
                              className="ml-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                              <FaEdit />
                            </Link>
                          </div>

                          <div className="p-4">
                            <div className="space-y-4">
                              {prato.avaliacoes.map((avaliacao) => (
                                <div
                                  key={avaliacao.id}
                                  className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white text-sm font-medium">
                                        {avaliacao.cliente.nome
                                          .charAt(0)
                                          .toUpperCase()}
                                      </span>
                                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                        {avaliacao.cliente.nome}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {formatarData(avaliacao.createdAt)}
                                    </div>
                                  </div>
                                  <div className="flex items-center my-2">
                                    {renderEstrelas(avaliacao.nota)}
                                    <span className="ml-2 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                      {avaliacao.nota}/5
                                    </span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm">
                                    "{avaliacao.comentario}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Conteúdo de pratos
                <>
                  {pratos.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center text-green-500 dark:text-green-400 mb-4">
                        <FaUtensils className="text-3xl" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                        Comece seu cardápio
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                        Adicione seu primeiro prato para que os clientes possam
                        conhecer suas opções saudáveis
                      </p>
                      <button
                        onClick={handleNovoPrato}
                        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium flex items-center mx-auto"
                      >
                        <FaPlus className="mr-2" /> Adicionar primeiro prato
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pratos.map((prato) => (
                        <div
                          key={prato.id}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group"
                        >
                          <div className="relative h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            {prato.imagem ? (
                              <img
                                src={prato.imagem}
                                alt={prato.nome}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400">
                                <FaUtensils className="text-3xl" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-green-500 dark:bg-green-600 text-white text-xs font-medium">
                              {prato.categoria}
                            </div>
                            {!prato.disponivel && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="bg-red-600 text-white font-bold px-3 py-1 rounded-md shadow-lg transform -rotate-6">
                                  INDISPONÍVEL
                                </span>
                              </div>
                            )}
                            {/* Menu de ações flutuante */}
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleEditarPrato(prato.id)}
                                  className="p-1.5 bg-white/90 hover:bg-white text-blue-600 rounded-md shadow-sm transition-colors"
                                  title="Editar prato"
                                >
                                  <FaEdit size={14} />
                                </button>
                                <button
                                  onClick={() => handleExcluirPrato(prato.id)}
                                  className="p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-md shadow-sm transition-colors"
                                  title="Excluir prato"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                {prato.nome}
                              </h4>
                              <span className="font-medium text-green-600 dark:text-green-400">
                                R$ {formatarPreco(prato.preco)}
                              </span>
                            </div>

                            <div className="flex items-center mt-2 mb-2">
                              <div className="flex text-yellow-400">
                                {renderEstrelas(
                                  calcularMediaAvaliacoes(prato.avaliacoes)
                                )}
                              </div>
                              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                ({prato.avaliacoes.length})
                              </span>
                            </div>

                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3 h-10">
                              {prato.descricao}
                            </p>

                            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                  prato.disponivel
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                                }`}
                              >
                                {prato.disponivel
                                  ? "Disponível"
                                  : "Indisponível"}
                              </span>

                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleEditarPrato(prato.id)}
                                  className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  title="Editar prato"
                                >
                                  <FaEdit size={14} />
                                </button>
                                <button
                                  onClick={() => handleExcluirPrato(prato.id)}
                                  className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  title="Excluir prato"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export default FornecedorDashboard;
