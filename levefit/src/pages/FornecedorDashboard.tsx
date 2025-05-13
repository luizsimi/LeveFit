import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { FaPlus, FaEdit, FaTrash, FaStar } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard do Fornecedor</h1>
            <button
              onClick={() => {
                logout(); // Usar a função logout do contexto
                navigate("/");
              }}
              className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-50"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {fornecedor && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-start">
              <div className="mr-6">
                {fornecedor.logo ? (
                  <img
                    src={fornecedor.logo}
                    alt={fornecedor.nome}
                    className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-500">
                    <span className="text-2xl font-bold text-green-600">
                      {fornecedor.nome.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {fornecedor.nome}
                </h2>
                <p className="text-gray-600 mb-2">
                  {fornecedor.descricao || "Sem descrição"}
                </p>
                <div className="flex space-x-4 text-sm">
                  <span>
                    <strong>Email:</strong> {fornecedor.email}
                  </span>
                  <span>
                    <strong>WhatsApp:</strong> {fornecedor.whatsapp}
                  </span>
                </div>
              </div>

              <div className="ml-auto">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                    fornecedor.assinaturaAtiva
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  Assinatura {fornecedor.assinaturaAtiva ? "Ativa" : "Inativa"}
                </div>
                <button
                  onClick={() => navigate("/dashboard/fornecedor/assinatura")}
                  className="text-sm px-3 py-1 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
                >
                  {fornecedor.assinaturaAtiva
                    ? "Gerenciar assinatura"
                    : "Ativar assinatura"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Meus Pratos</h2>
          <button
            onClick={handleNovoPrato}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaPlus className="mr-2" /> Novo Prato
          </button>
        </div>

        {pratos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              Você ainda não cadastrou nenhum prato.
            </p>
            <button
              onClick={handleNovoPrato}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Cadastrar meu primeiro prato
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pratos.map((prato) => (
              <div
                key={prato.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-40">
                  {prato.imagem ? (
                    <img
                      src={prato.imagem}
                      alt={prato.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-100">
                      <span className="text-4xl">🍲</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {prato.categoria}
                  </div>
                  {!prato.disponivel && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-bold px-3 py-1 rounded">
                        INDISPONÍVEL
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {prato.nome}
                    </h3>
                    <span className="font-bold text-green-600">
                      R$ {formatarPreco(prato.preco)}
                    </span>
                  </div>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-yellow-400 mr-1">
                      <FaStar />
                    </div>
                    <span className="text-sm">
                      {calcularMediaAvaliacoes(prato.avaliacoes).toFixed(1)} (
                      {prato.avaliacoes.length} avaliações)
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {prato.descricao.length > 80
                      ? prato.descricao.substring(0, 80) + "..."
                      : prato.descricao}
                  </p>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditarPrato(prato.id)}
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      title="Editar prato"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleExcluirPrato(prato.id)}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      title="Excluir prato"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FornecedorDashboard;
