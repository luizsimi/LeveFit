import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FaChartBar,
  FaThumbsUp,
  FaList,
  FaUtensils,
  FaExclamationCircle,
  FaSpinner,
  FaBell,
  FaTimes,
  FaTag,
  FaCheck,
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
      <header className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Dashboard do Fornecedor</h1>
              {fornecedor?.assinaturaAtiva ? (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800">
                  <FaCheck className="mr-1" /> Assinatura Ativa
                </span>
              ) : (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-200 text-red-800">
                  <FaTimes className="mr-1" /> Assinatura Inativa
                </span>
              )}
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-white text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors shadow-sm hover:shadow-md flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {fornecedor && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 animate-fadeIn">
            <div className="md:flex">
              <div className="md:flex-shrink-0 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-6 text-white flex justify-center items-center">
                {fornecedor.logo ? (
                  <img
                    src={fornecedor.logo}
                    alt={fornecedor.nome}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-md">
                    <span className="text-4xl font-bold text-green-600">
                      {fornecedor.nome.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 md:flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {fornecedor.nome}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                      {fornecedor.descricao || "Sem descrição"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <span className="font-semibold mr-1">Email:</span>{" "}
                        {fornecedor.email}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <span className="font-semibold mr-1">WhatsApp:</span>{" "}
                        {fornecedor.whatsapp}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <FaUserEdit className="mr-2" /> Editar Perfil
                    </button>
                    <button
                      onClick={() =>
                        navigate("/dashboard/fornecedor/assinatura")
                      }
                      className={`px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center ${
                        fornecedor.assinaturaAtiva
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-yellow-600 hover:bg-yellow-700 text-white"
                      }`}
                    >
                      {fornecedor.assinaturaAtiva
                        ? "Gerenciar Assinatura"
                        : "Ativar Assinatura"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 flex items-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
              <FaUtensils className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total de Pratos
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.totalPratos}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 flex items-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
              <FaCheck className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pratos Disponíveis
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.pratosDisponiveis}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 flex items-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mr-4">
              <FaStar className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total de Avaliações
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.totalAvaliacoes}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 flex items-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
              <FaTag className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Preço Médio
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                R$ {stats.mediaPratos.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs de navegação */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => {
                setActiveTab("pratos");
                setMostrarAvaliacoes(false);
              }}
              className={`py-3 px-4 font-medium ${
                activeTab === "pratos"
                  ? "border-b-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
              }`}
            >
              <div className="flex items-center">
                <FaList className="mr-2" /> Meus Pratos
              </div>
            </button>
            {calcularTotalAvaliacoes() > 0 && (
              <button
                onClick={buscarPratosComAvaliacoes}
                className={`py-3 px-4 font-medium ${
                  activeTab === "avaliacoes"
                    ? "border-b-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                }`}
              >
                <div className="flex items-center">
                  <FaComments className="mr-2" /> Avaliações
                  <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-full text-xs">
                    {calcularTotalAvaliacoes()}
                  </span>
                </div>
              </button>
            )}
          </nav>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {activeTab === "pratos"
              ? "Gerenciar Pratos"
              : "Avaliações dos Clientes"}
          </h2>
          {activeTab === "pratos" && (
            <button
              onClick={handleNovoPrato}
              className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white px-5 py-2.5 rounded-lg hover:shadow-lg flex items-center transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <FaPlus className="mr-2" /> Novo Prato
            </button>
          )}
        </div>

        {/* Exibição de avaliações */}
        {mostrarAvaliacoes ? (
          <div className="animate-fadeIn">
            {pratosComAvaliacoes.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <FaComments className="text-5xl mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Sem avaliações
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Seus pratos ainda não receberam avaliações.
                </p>
                <button
                  onClick={() => {
                    setMostrarAvaliacoes(false);
                    setActiveTab("pratos");
                  }}
                  className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white px-5 py-2.5 rounded-lg hover:shadow-md transition-all duration-300"
                >
                  Voltar para meus pratos
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {pratosComAvaliacoes.map((prato) => (
                  <div
                    key={prato.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fadeIn"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className="w-16 h-16 mr-4 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                          {prato.imagem ? (
                            <img
                              src={prato.imagem}
                              alt={prato.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                              <FaUtensils className="text-green-500 dark:text-green-400 text-2xl" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            {prato.nome}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center mr-1">
                              {renderEstrelas(
                                calcularMediaAvaliacoes(prato.avaliacoes)
                              )}
                            </div>
                            <span className="font-medium">
                              {calcularMediaAvaliacoes(
                                prato.avaliacoes
                              ).toFixed(1)}
                            </span>
                            <span className="ml-2">
                              ({prato.avaliacoes.length}{" "}
                              {prato.avaliacoes.length === 1
                                ? "avaliação"
                                : "avaliações"}
                              )
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                        <FaComments className="mr-2 text-green-500 dark:text-green-400" />
                        Feedback dos clientes
                      </h4>
                      <div className="space-y-4">
                        {prato.avaliacoes.map((avaliacao) => (
                          <div
                            key={avaliacao.id}
                            className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0"
                          >
                            <div className="flex justify-between items-center">
                              <div className="font-semibold text-gray-800 dark:text-white flex items-center">
                                <span className="inline-block w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-full mr-2 flex items-center justify-center text-sm font-bold">
                                  {avaliacao.cliente.nome.charAt(0)}
                                </span>
                                {avaliacao.cliente.nome}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-sm">
                                {formatarData(avaliacao.createdAt)}
                              </div>
                            </div>
                            <div className="flex items-center my-2">
                              {renderEstrelas(avaliacao.nota)}
                              <span className="ml-2 text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                                {avaliacao.nota}/5
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
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
          <>
            {pratos.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 text-center animate-fadeIn overflow-hidden">
                <div className="relative">
                  {/* Decoração de fundo */}
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-100 dark:bg-green-900/20 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full opacity-70"></div>

                  {/* Conteúdo principal */}
                  <div className="relative z-10">
                    <div className="mb-6 bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400 transform transition-all duration-500 hover:scale-110">
                      <FaUtensils className="text-4xl" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                      Vamos começar seu cardápio!
                    </h3>

                    <div className="max-w-lg mx-auto">
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Você ainda não cadastrou nenhum prato. Adicione seu
                        primeiro item e comece a atrair clientes com opções
                        saudáveis e deliciosas.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600 dark:text-green-400">
                            <span className="font-bold">1</span>
                          </div>
                          <p>
                            Adicione fotos e descrições detalhadas dos seus
                            pratos
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600 dark:text-green-400">
                            <span className="font-bold">2</span>
                          </div>
                          <p>
                            Organize por categorias para facilitar a escolha dos
                            clientes
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600 dark:text-green-400">
                            <span className="font-bold">3</span>
                          </div>
                          <p>
                            Receba avaliações e feedback para melhorar seu
                            negócio
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleNovoPrato}
                      className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 font-medium flex items-center mx-auto"
                    >
                      <FaPlus className="mr-2" /> Cadastrar meu primeiro prato
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pratos.map((prato, index) => (
                  <div
                    key={prato.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {prato.imagem ? (
                        <img
                          src={prato.imagem}
                          alt={prato.nome}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                          <FaUtensils className="text-green-500 dark:text-green-400 text-4xl" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm">
                        {prato.categoria}
                      </div>
                      {!prato.disponivel && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                          <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg transform -rotate-12">
                            INDISPONÍVEL
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight leading-tight">
                          {prato.nome}
                        </h3>
                        <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                          R$ {formatarPreco(prato.preco)}
                        </span>
                      </div>

                      <div className="flex items-center mb-3">
                        <div className="flex mr-1">
                          {renderEstrelas(
                            calcularMediaAvaliacoes(prato.avaliacoes)
                          )}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({prato.avaliacoes.length}{" "}
                          {prato.avaliacoes.length === 1
                            ? "avaliação"
                            : "avaliações"}
                          )
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                        {prato.descricao}
                      </p>

                      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              prato.disponivel
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                            }`}
                          >
                            {prato.disponivel ? "Disponível" : "Indisponível"}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditarPrato(prato.id)}
                            className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            title="Editar prato"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleExcluirPrato(prato.id)}
                            className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            title="Excluir prato"
                          >
                            <FaTrash />
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
      </main>

      <Footer />

      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export default FornecedorDashboard;
