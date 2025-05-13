import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar, FaRegStar, FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="h-8 bg-gray-200 w-1/2 animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 w-full animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 w-full animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !prato) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || "Prato não encontrado"}
          </div>
          <Link to="/" className="flex items-center text-green-600 font-medium">
            <FaArrowLeft className="mr-2" /> Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-600 font-medium mb-6"
        >
          <FaArrowLeft className="mr-2" /> Voltar
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              {prato.imagem ? (
                <img
                  src={prato.imagem}
                  alt={prato.nome}
                  className="w-full h-80 object-cover"
                />
              ) : (
                <div className="w-full h-80 flex items-center justify-center bg-green-100">
                  <span className="text-6xl">🍲</span>
                </div>
              )}
            </div>

            <div className="p-6 md:w-1/2">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  {prato.nome}
                </h1>
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {prato.categoria}
                </span>
              </div>

              <div className="flex items-center mb-4">
                {renderEstrelas(prato.mediaAvaliacao)}
                <span className="ml-2 text-gray-600">
                  ({prato.totalAvaliacoes}{" "}
                  {prato.totalAvaliacoes === 1 ? "avaliação" : "avaliações"})
                </span>
              </div>

              <div className="text-2xl font-bold text-green-600 mb-4">
                R$ {prato.preco.toFixed(2).replace(".", ",")}
              </div>

              <p className="text-gray-700 mb-6">{prato.descricao}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Fornecedor</h3>
                <div className="flex items-center">
                  {prato.fornecedor.logo ? (
                    <img
                      src={prato.fornecedor.logo}
                      alt={prato.fornecedor.nome}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mr-3">
                      <span className="text-lg font-bold text-green-800">
                        {prato.fornecedor.nome.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{prato.fornecedor.nome}</div>
                    <Link
                      to={`/fornecedores/${prato.fornecedor.id}`}
                      className="text-green-600 text-sm"
                    >
                      Ver perfil
                    </Link>
                  </div>
                </div>
              </div>

              <a
                href={criarLinkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 transition"
              >
                <FaWhatsapp className="mr-2 text-xl" /> Pedir via WhatsApp
              </a>
            </div>
          </div>

          {/* Seção de Avaliações */}
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
                          {estrela <= (notaHover || novaAvaliacao.nota) ? (
                            <FaStar className="text-yellow-400" />
                          ) : (
                            <FaRegStar className="text-yellow-400" />
                          )}
                        </div>
                      ))}
                      <span className="ml-2 text-gray-600">
                        {novaAvaliacao.nota > 0 && `${novaAvaliacao.nota}/5`}
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
                      enviandoAvaliacao ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={enviandoAvaliacao}
                  >
                    {enviandoAvaliacao ? "Enviando..." : "Enviar Avaliação"}
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
                    <p className="text-gray-700">{avaliacao.comentario}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetalhePrato;
