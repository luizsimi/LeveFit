import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaStar,
  FaRegStar,
  FaArrowLeft,
  FaWhatsapp,
  FaHeart,
  FaRegHeart,
  FaShoppingBasket,
  FaExclamationCircle,
  FaInfoCircle,
  FaClock,
  FaLeaf,
  FaFire,
} from "react-icons/fa";
import { GiSlicedBread } from "react-icons/gi";
import { BiDumbbell } from "react-icons/bi";
import { IoNutrition } from "react-icons/io5";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

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

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string;
  categoria: string;
  disponivel: boolean;
  mediaAvaliacao: number;
  totalAvaliacoes: number;
  calorias?: number;
  proteinas?: number;
  carboidratos?: number;
  gorduras?: number;
  fibras?: number;
  porcao?: string;
  fornecedor: {
    id: number;
    nome: string;
    whatsapp: string;
    logo?: string;
  };
  avaliacoes: Avaliacao[];
}

const DetalhePrato = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prato, setPrato] = useState<Prato | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    nota: 0,
    comentario: "",
  });
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);
  const [avaliacaoSucesso, setAvaliacaoSucesso] = useState("");
  const [avaliacaoErro, setAvaliacaoErro] = useState("");
  const [notaHover, setNotaHover] = useState(0);
  const { isAuthenticated, userType } = useAuth();
  const [activeTab, setActiveTab] = useState("descricao");
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    const fetchPrato = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3333/pratos/${id}`);
        setPrato(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar detalhes do prato:", error);
        setError("Erro ao carregar os detalhes do prato.");
        setLoading(false);
      }
    };

    fetchPrato();
  }, [id]);

  // Criar link do WhatsApp
  const criarLinkWhatsApp = () => {
    if (!prato) return "#";

    const numero = prato.fornecedor.whatsapp.replace(/\D/g, "");
    const mensagem = encodeURIComponent(
      `Olá, gostaria de encomendar o prato "${prato.nome}"`
    );
    return `https://wa.me/${numero}?text=${mensagem}`;
  };

  // Renderizar as estrelas de avaliação
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNovaAvaliacao({
      ...novaAvaliacao,
      [name]: name === "nota" ? parseInt(value) : value,
    });
  };

  const handleSubmitAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || userType !== "cliente") {
      setAvaliacaoErro(
        "Você precisa estar logado como cliente para avaliar um prato."
      );
      return;
    }

    if (novaAvaliacao.nota === 0) {
      setAvaliacaoErro("Selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    setEnviandoAvaliacao(true);
    setAvaliacaoErro("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3333/avaliacoes",
        {
          pratoId: id,
          nota: novaAvaliacao.nota,
          comentario: novaAvaliacao.comentario,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAvaliacaoSucesso("Sua avaliação foi enviada com sucesso!");
      setNovaAvaliacao({ nota: 0, comentario: "" });

      // Atualizar os dados do prato para mostrar a nova avaliação
      const response = await axios.get(`http://localhost:3333/pratos/${id}`);
      setPrato(response.data);

      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setAvaliacaoSucesso("");
      }, 5000);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setAvaliacaoErro("Você já avaliou este prato anteriormente.");
      } else {
        setAvaliacaoErro(
          "Ocorreu um erro ao enviar sua avaliação. Tente novamente mais tarde."
        );
      }
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  const toggleFavorito = () => {
    setFavorito(!favorito);
    // Aqui adicionaríamos a lógica para salvar nos favoritos
  };

  // Adicionar este componente para renderizar a tabela nutricional detalhada
  const TabelaNutricional = ({ prato }: { prato: Prato }) => {
    // Se não houver informações nutricionais, retornar mensagem informativa
    if (
      !prato.calorias &&
      !prato.proteinas &&
      !prato.carboidratos &&
      !prato.gorduras &&
      !prato.fibras
    ) {
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg text-sm">
          <div className="flex items-center">
            <FaInfoCircle className="text-yellow-500 mr-2" />
            <span>
              As informações nutricionais deste prato ainda não estão
              disponíveis.
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Informações Nutricionais
          </h3>
          {prato.porcao && (
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
              Porção: {prato.porcao}
            </span>
          )}
        </div>

        {/* Cards com macro informações */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {prato.calorias && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 flex items-center">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3">
                <FaFire className="text-orange-500" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {prato.calorias}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Calorias (kcal)
                </div>
              </div>
            </div>
          )}

          {prato.proteinas && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 flex items-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                <BiDumbbell className="text-blue-500" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {prato.proteinas}g
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Proteínas
                </div>
              </div>
            </div>
          )}

          {prato.carboidratos && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 flex items-center">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mr-3">
                <GiSlicedBread className="text-yellow-500" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {prato.carboidratos}g
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Carboidratos
                </div>
              </div>
            </div>
          )}

          {prato.gorduras && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 flex items-center">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                <IoNutrition className="text-purple-500" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {prato.gorduras}g
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Gorduras
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabela nutricional detalhada */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <table className="w-full text-sm">
            <tbody>
              {prato.calorias && (
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 text-gray-600 dark:text-gray-400">
                    Valor energético
                  </td>
                  <td className="py-2 font-medium text-gray-800 dark:text-white text-right">
                    {prato.calorias} kcal
                  </td>
                </tr>
              )}
              {prato.proteinas && (
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 text-gray-600 dark:text-gray-400">
                    Proteínas
                  </td>
                  <td className="py-2 font-medium text-gray-800 dark:text-white text-right">
                    {prato.proteinas}g
                  </td>
                </tr>
              )}
              {prato.carboidratos && (
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 text-gray-600 dark:text-gray-400">
                    Carboidratos totais
                  </td>
                  <td className="py-2 font-medium text-gray-800 dark:text-white text-right">
                    {prato.carboidratos}g
                  </td>
                </tr>
              )}
              {prato.gorduras && (
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 text-gray-600 dark:text-gray-400">
                    Gorduras totais
                  </td>
                  <td className="py-2 font-medium text-gray-800 dark:text-white text-right">
                    {prato.gorduras}g
                  </td>
                </tr>
              )}
              {prato.fibras && (
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 text-gray-600 dark:text-gray-400">
                    Fibras alimentares
                  </td>
                  <td className="py-2 font-medium text-gray-800 dark:text-white text-right">
                    {prato.fibras}g
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          <p className="flex items-center">
            <FaInfoCircle className="mr-2 text-blue-500" /> Os valores
            nutricionais são aproximados e podem variar conforme o preparo.
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 w-40 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 h-96 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="p-6 md:w-1/2">
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 w-3/4 rounded-lg animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 w-1/4 rounded-lg animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 w-1/2 rounded-lg animate-pulse"></div>
                    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex space-x-3">
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 w-1/2 rounded-lg animate-pulse"></div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 w-1/2 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !prato) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl shadow-sm mb-6 flex items-center">
              <FaExclamationCircle className="mr-2 flex-shrink-0" />
              <span>{error || "Prato não encontrado"}</span>
            </div>
            <Link
              to="/"
              className="inline-flex items-center text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-green-600 dark:text-green-400 font-medium bg-white dark:bg-gray-800 px-4 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <FaArrowLeft className="mr-2" /> Voltar
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="md:flex">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:w-1/2 relative group"
              >
                {prato.imagem ? (
                  <img
                    src={prato.imagem}
                    alt={prato.nome}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <span className="text-6xl">🍲</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-sm bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <div className="flex items-center">
                      <FaLeaf className="mr-1 text-green-400" />
                      <span>Alimento 100% natural</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <FaClock className="mr-1 text-green-400" />
                      <span>Preparado no dia do pedido</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 md:w-1/2"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {prato.nome}
                      </h1>
                      <span className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {prato.categoria}
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      {renderEstrelas(prato.mediaAvaliacao)}
                      <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
                        {prato.mediaAvaliacao.toFixed(1)} (
                        {prato.totalAvaliacoes}{" "}
                        {prato.totalAvaliacoes === 1
                          ? "avaliação"
                          : "avaliações"}
                        )
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={toggleFavorito}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={
                      favorito
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                  >
                    {favorito ? (
                      <FaHeart className="text-red-500 text-xl" />
                    ) : (
                      <FaRegHeart className="text-gray-400 hover:text-red-500 text-xl transition-colors" />
                    )}
                  </button>
                </div>

                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6 flex items-baseline">
                  <span className="mr-2">
                    R$ {prato.preco.toFixed(2).replace(".", ",")}
                  </span>
                  {prato.disponivel ? (
                    <span className="text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">
                      Disponível
                    </span>
                  ) : (
                    <span className="text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-2 py-1 rounded-full">
                      Indisponível
                    </span>
                  )}
                </div>

                <div className="mt-8">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                      <button
                        onClick={() => setActiveTab("descricao")}
                        className={`pb-4 px-1 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                          activeTab === "descricao"
                            ? "text-green-600 dark:text-green-400 border-b-2 border-green-500 dark:border-green-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        Descrição
                      </button>
                      <button
                        onClick={() => setActiveTab("nutrientes")}
                        className={`pb-4 px-1 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                          activeTab === "nutrientes"
                            ? "text-green-600 dark:text-green-400 border-b-2 border-green-500 dark:border-green-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        Informações Nutricionais
                      </button>
                      <button
                        onClick={() => setActiveTab("avaliacoes")}
                        className={`pb-4 px-1 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                          activeTab === "avaliacoes"
                            ? "text-green-600 dark:text-green-400 border-b-2 border-green-500 dark:border-green-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        Avaliações ({prato?.totalAvaliacoes || 0})
                      </button>
                    </nav>
                  </div>

                  <div className="mt-4">
                    {/* Conteúdo da aba Descrição */}
                    {activeTab === "descricao" && (
                      <div className="prose prose-green dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {prato?.descricao}
                        </p>
                      </div>
                    )}

                    {/* Conteúdo da aba Informações Nutricionais */}
                    {activeTab === "nutrientes" && prato && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TabelaNutricional prato={prato} />
                      </motion.div>
                    )}

                    {/* Conteúdo da aba Avaliações */}
                    {activeTab === "avaliacoes" && (
                      <div className="border-t border-gray-200 p-6">
                        <h2 className="text-xl font-bold mb-4">Avaliações</h2>

                        {/* Formulário de avaliação para usuários logados como clientes */}
                        {isAuthenticated && userType === "cliente" && (
                          <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold mb-2">
                              Avalie este prato
                            </h3>

                            {avaliacaoSucesso && (
                              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                {avaliacaoSucesso}
                              </div>
                            )}

                            {avaliacaoErro && (
                              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {avaliacaoErro}
                              </div>
                            )}

                            <form onSubmit={handleSubmitAvaliacao}>
                              <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                  Nota
                                </label>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((estrela) => (
                                    <div
                                      key={estrela}
                                      className="cursor-pointer text-xl"
                                      onClick={() =>
                                        setNovaAvaliacao({
                                          ...novaAvaliacao,
                                          nota: estrela,
                                        })
                                      }
                                      onMouseEnter={() => setNotaHover(estrela)}
                                      onMouseLeave={() => setNotaHover(0)}
                                    >
                                      {estrela <=
                                      (notaHover || novaAvaliacao.nota) ? (
                                        <FaStar className="text-yellow-400" />
                                      ) : (
                                        <FaRegStar className="text-yellow-400" />
                                      )}
                                    </div>
                                  ))}
                                  <span className="ml-2 text-gray-600">
                                    {novaAvaliacao.nota > 0 &&
                                      `${novaAvaliacao.nota}/5`}
                                  </span>
                                </div>
                              </div>
                              <div className="mb-4">
                                <label
                                  htmlFor="comentario"
                                  className="block text-gray-700 font-medium mb-2"
                                >
                                  Comentário
                                </label>
                                <textarea
                                  id="comentario"
                                  name="comentario"
                                  value={novaAvaliacao.comentario}
                                  onChange={handleInputChange}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Compartilhe sua experiência com este prato..."
                                ></textarea>
                              </div>
                              <button
                                type="submit"
                                className={`bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition ${
                                  enviandoAvaliacao
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={enviandoAvaliacao}
                              >
                                {enviandoAvaliacao
                                  ? "Enviando..."
                                  : "Enviar Avaliação"}
                              </button>
                            </form>
                          </div>
                        )}

                        {prato.avaliacoes.length === 0 ? (
                          <p className="text-gray-600">
                            Este prato ainda não possui avaliações.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {prato.avaliacoes.map((avaliacao) => (
                              <div
                                key={avaliacao.id}
                                className="border-b border-gray-200 pb-4 last:border-b-0"
                              >
                                <div className="flex justify-between">
                                  <div className="font-semibold">
                                    {avaliacao.cliente.nome}
                                  </div>
                                  <div className="text-gray-500 text-sm">
                                    {formatarData(avaliacao.createdAt)}
                                  </div>
                                </div>
                                <div className="flex items-center my-1">
                                  {renderEstrelas(avaliacao.nota)}
                                  <span className="ml-2 text-gray-600 text-sm">
                                    {avaliacao.nota}/5
                                  </span>
                                </div>
                                <p className="text-gray-700">
                                  {avaliacao.comentario}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <a
                    href={criarLinkWhatsApp()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:brightness-110"
                  >
                    <FaWhatsapp className="mr-2 text-lg animate-pulse" />
                    <span>Pedir agora</span>
                  </a>

                  <button className="flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm">
                    <FaShoppingBasket className="mr-2" />
                    <span>Adicionar ao carrinho</span>
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="bg-green-500 p-2 rounded-full mr-3">
                      {prato.fornecedor.logo ? (
                        <img
                          src={prato.fornecedor.logo}
                          alt={prato.fornecedor.nome}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <span className="text-green-500 font-bold">
                            {prato.fornecedor.nome.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                        Fornecido por
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {prato.fornecedor.nome}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DetalhePrato;
