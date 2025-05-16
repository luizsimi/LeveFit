import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCreditCard,
  FaBarcode,
  FaHistory,
  FaInfoCircle,
  FaFileInvoiceDollar,
  FaLock,
  FaTimesCircle,
} from "react-icons/fa";
import { RiQrCodeLine } from "react-icons/ri";
import { BsShieldLock, BsCreditCard2Front } from "react-icons/bs";
import axios, { AxiosError } from "axios";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface ErrorResponse {
  error: string;
}

type MetodoPagamento = "cartao" | "boleto" | "pix";

interface PlanoAssinatura {
  id: string;
  nome: string;
  valor: number;
  descricao: string;
  beneficios: string[];
}

interface Fatura {
  id: string;
  data: string;
  valor: number;
  status: "paga" | "pendente" | "cancelada";
}

const AssinaturaFornecedor = () => {
  const { userData, updateUserData, refreshUserData, isRefreshing } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [assinaturaStatus, setAssinaturaStatus] = useState(false);
  const [metodoPagamento, setMetodoPagamento] =
    useState<MetodoPagamento>("cartao");
  const [dadosCartao, setDadosCartao] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
  });
  const [tabAtiva, setTabAtiva] = useState<
    "assinar" | "historico" | "detalhes"
  >("assinar");
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [assinaturaInfo, setAssinaturaInfo] = useState({
    dataInicio: "",
    dataRenovacao: "",
    planoAtual: "",
    metodoPagamento: "",
  });
  const [mostrarCancelamentoModal, setMostrarCancelamentoModal] =
    useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<string>("mensal");
  const [dadosCarregados, setDadosCarregados] = useState(false);

  // Dados do plano
  const planos: PlanoAssinatura[] = [
    {
      id: "mensal",
      nome: "Plano Mensal LeveFit",
      valor: 40.0,
      descricao: "Assinatura mensal da plataforma LeveFit para fornecedores",
      beneficios: [
        "Destaque na lista de fornecedores",
        "Cadastro ilimitado de pratos",
        "Suporte prioritário",
        "Estatísticas avançadas",
      ],
    },
    {
      id: "semestral",
      nome: "Plano Semestral LeveFit",
      valor: 35.0,
      descricao: "Assinatura semestral com 12% de desconto",
      beneficios: [
        "Destaque na lista de fornecedores",
        "Cadastro ilimitado de pratos",
        "Suporte prioritário",
        "Estatísticas avançadas",
        "Economia de 12% em relação ao plano mensal",
      ],
    },
  ];

  useEffect(() => {
    console.log("AssinaturaFornecedor - Página carregada");

    // Verificar o status da assinatura do fornecedor atual e atualizar o contexto
    const verificarAssinatura = async () => {
      // Evitar recarregar os dados se já foram carregados
      if (dadosCarregados || isRefreshing) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log(
          "AssinaturaFornecedor - Token:",
          token ? "Existe" : "Não existe"
        );

        // Buscar dados atualizados do perfil apenas uma vez
        if (!isRefreshing && userData?.id) {
          await refreshUserData();
        }

        // Atualizar o estado local com base nos dados atualizados
        if (userData?.assinaturaAtiva) {
          setAssinaturaStatus(userData.assinaturaAtiva);

          // Simular dados de assinatura para demonstração
          setAssinaturaInfo({
            dataInicio: "01/05/2025",
            dataRenovacao: "01/06/2025",
            planoAtual: "Plano Mensal LeveFit",
            metodoPagamento: "Cartão de crédito",
          });

          // Simular faturas para demonstração
          setFaturas([
            {
              id: "inv-2025-05",
              data: "01/05/2025",
              valor: 40.0,
              status: "paga",
            },
            {
              id: "inv-2025-04",
              data: "01/04/2025",
              valor: 40.0,
              status: "paga",
            },
            {
              id: "inv-2025-03",
              data: "01/03/2025",
              valor: 40.0,
              status: "paga",
            },
          ]);
        }

        // Marcar que os dados já foram carregados
        setDadosCarregados(true);
      } catch (error) {
        console.error("Erro ao verificar status da assinatura:", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response?.data) {
            setError(
              axiosError.response.data.error || "Erro ao verificar assinatura"
            );
          } else {
            setError("Erro ao conectar-se ao servidor");
          }
        } else {
          setError("Ocorreu um erro inesperado");
        }
      } finally {
        setLoading(false);
      }
    };

    verificarAssinatura();
  }, [userData?.id, refreshUserData, isRefreshing, dadosCarregados]);

  const handleDadosCartaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosCartao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatarNumeroCartao = (value: string) => {
    if (!value) return "";

    // Remove todos os espaços e caracteres não numéricos
    const numeroLimpo = value.replace(/\D/g, "");

    // Limita a 16 dígitos
    const limitado = numeroLimpo.slice(0, 16);

    // Adiciona um espaço a cada 4 dígitos
    const formatado = limitado.replace(/(\d{4})(?=\d)/g, "$1 ");

    return formatado;
  };

  const formatarValidade = (value: string) => {
    if (!value) return "";

    // Remove todos os caracteres não numéricos
    const numeroLimpo = value.replace(/\D/g, "");

    // Limita a 4 dígitos
    const limitado = numeroLimpo.slice(0, 4);

    // Adiciona a barra após os 2 primeiros dígitos
    if (limitado.length > 2) {
      return limitado.slice(0, 2) + "/" + limitado.slice(2);
    }

    return limitado;
  };

  const formatarCVV = (value: string) => {
    if (!value) return "";

    // Remove todos os caracteres não numéricos
    const numeroLimpo = value.replace(/\D/g, "");

    // Limita a 3 ou 4 dígitos, dependendo da bandeira do cartão
    return numeroLimpo.slice(0, 4);
  };

  const cancelarAssinatura = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:3333/fornecedores/${userData?.id}/cancelar-assinatura`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Assinatura cancelada com sucesso!");
      setAssinaturaStatus(false);
      setMostrarCancelamentoModal(false);

      // Atualizar o contexto global
      updateUserData({ assinaturaAtiva: false });

      // Redirecionamento após cancelamento
      setTimeout(() => {
        navigate("/dashboard/fornecedor");
      }, 3000);
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(
            axiosError.response.data.error || "Erro ao cancelar assinatura"
          );
        } else {
          setError("Erro ao conectar-se ao servidor");
        }
      } else {
        setError("Ocorreu um erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  const processarAssinatura = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const planoEscolhido = planos.find((p) => p.id === planoSelecionado);

      // Em um ambiente de produção, os dados do cartão seriam processados por um sistema de pagamento
      // como Stripe, PagSeguro, etc. e não seriam enviados diretamente para o backend

      // Simulação de chamada de API para processamento de pagamento
      if (metodoPagamento === "cartao") {
        // Validações básicas do cartão
        if (
          !dadosCartao.numero ||
          !dadosCartao.nome ||
          !dadosCartao.validade ||
          !dadosCartao.cvv
        ) {
          setError("Por favor, preencha todos os dados do cartão");
          setLoading(false);
          return;
        }
      }

      // Após o processamento do pagamento, ativar a assinatura no backend
      await axios.post(
        `http://localhost:3333/fornecedores/${userData?.id}/ativar-assinatura`,
        {
          metodoPagamento,
          planoId: planoSelecionado,
          valorPlano: planoEscolhido?.valor || 40.0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Assinatura ativada com sucesso!");
      setAssinaturaStatus(true);

      // Atualizar informações de usuário no contexto
      updateUserData({ assinaturaAtiva: true });

      setTimeout(() => {
        navigate("/dashboard/fornecedor");
      }, 3000);
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(
            axiosError.response.data.error || "Erro ao processar pagamento"
          );
        } else {
          setError("Erro ao conectar-se ao servidor");
        }
      } else {
        setError("Ocorreu um erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shadow-sm transition-all duration-200"
            aria-label="Voltar"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Gerenciamento de Assinatura
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center">
            <FaTimesCircle className="text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl mb-6 flex items-center">
            <FaCheckCircle className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300">
          {/* Cabeçalho do Card */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {assinaturaStatus
                    ? "Assinatura LeveFit Ativa"
                    : "Ativar Assinatura LeveFit"}
                </h2>
                <p className="text-green-100">
                  {assinaturaStatus
                    ? "Gerencie sua assinatura e acesse todos os benefícios"
                    : "Desbloqueie seu acesso completo à plataforma"}
                </p>
              </div>
              {assinaturaStatus && (
                <div className="mt-4 md:mt-0">
                  <span className="bg-green-500/30 border border-green-400 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    <FaCheckCircle className="inline-block mr-1" /> Assinatura
                    Ativa
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navegação de Tabs */}
          {assinaturaStatus && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-1 px-4">
                <button
                  onClick={() => setTabAtiva("detalhes")}
                  className={`py-4 px-6 font-medium border-b-2 transition-colors duration-200 ${
                    tabAtiva === "detalhes"
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FaInfoCircle className="inline-block mr-2" /> Detalhes da
                  Assinatura
                </button>
                <button
                  onClick={() => setTabAtiva("historico")}
                  className={`py-4 px-6 font-medium border-b-2 transition-colors duration-200 ${
                    tabAtiva === "historico"
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FaHistory className="inline-block mr-2" /> Histórico de
                  Pagamentos
                </button>
              </nav>
            </div>
          )}

          {/* Corpo do Card */}
          <div className="p-6">
            {/* Conteúdo para assinatura ativa */}
            {assinaturaStatus && (
              <div className="animate-fadeIn">
                {/* Tab de Detalhes da Assinatura */}
                {tabAtiva === "detalhes" && (
                  <div className="space-y-6">
                    {/* Resumo da assinatura */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Detalhes do Plano Atual
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Plano:
                            </span>
                            <span className="font-medium text-gray-800 dark:text-white">
                              {assinaturaInfo.planoAtual}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Data de início:
                            </span>
                            <span className="font-medium text-gray-800 dark:text-white">
                              {assinaturaInfo.dataInicio}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Próxima renovação:
                            </span>
                            <span className="font-medium text-gray-800 dark:text-white">
                              {assinaturaInfo.dataRenovacao}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Valor mensal:
                            </span>
                            <span className="font-medium text-gray-800 dark:text-white">
                              R$ 40,00
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Forma de pagamento:
                            </span>
                            <span className="font-medium text-gray-800 dark:text-white">
                              {assinaturaInfo.metodoPagamento}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Status:
                            </span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              Ativo
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informações do Método de Pagamento */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          Método de Pagamento
                        </h3>
                        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                          Atualizar
                        </button>
                      </div>
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                          <BsCreditCard2Front className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            Cartão de Crédito
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Visa •••• 4242 (Expira em 12/2025)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Benefícios da Assinatura */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Benefícios da Sua Assinatura
                      </h3>
                      <ul className="space-y-3">
                        {planos[0].beneficios.map((beneficio, index) => (
                          <li key={index} className="flex items-start">
                            <FaCheckCircle className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {beneficio}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Botão de Cancelamento */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                      <button
                        onClick={() => setMostrarCancelamentoModal(true)}
                        className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Cancelar assinatura
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab de Histórico de Pagamentos */}
                {tabAtiva === "historico" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                      Histórico de Pagamentos
                    </h3>

                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Fatura
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Data
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Valor
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                          {faturas.map((fatura) => (
                            <tr
                              key={fatura.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex items-center">
                                  <FaFileInvoiceDollar className="text-gray-400 mr-2" />
                                  {fatura.id}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                                {fatura.data}
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                R$ {fatura.valor.toFixed(2).replace(".", ",")}
                              </td>
                              <td className="py-4 px-4 text-sm">
                                {fatura.status === "paga" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                    Paga
                                  </span>
                                )}
                                {fatura.status === "pendente" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                                    Pendente
                                  </span>
                                )}
                                {fatura.status === "cancelada" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                                    Cancelada
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-4 text-sm">
                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                                  Ver Recibo
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conteúdo para assinatura inativa */}
            {!assinaturaStatus && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      Escolha seu plano
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Selecione o plano que melhor atende às suas necessidades
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {planos.map((plano) => (
                        <div
                          key={plano.id}
                          onClick={() => setPlanoSelecionado(plano.id)}
                          className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                            planoSelecionado === plano.id
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600 shadow-md"
                              : "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                              {plano.nome}
                            </h4>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                planoSelecionado === plano.id
                                  ? "border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {planoSelecionado === plano.id && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {plano.descricao}
                          </p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                            R$ {plano.valor.toFixed(2).replace(".", ",")}{" "}
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              /mês
                            </span>
                          </p>
                          <ul className="space-y-2">
                            {plano.beneficios.map((beneficio, index) => (
                              <li
                                key={index}
                                className="flex items-start text-sm"
                              >
                                <FaCheckCircle className="text-green-500 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {beneficio}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Escolha o método de pagamento
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setMetodoPagamento("cartao")}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
                          metodoPagamento === "cartao"
                            ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600"
                            : "border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                        }`}
                      >
                        <FaCreditCard
                          className={`text-2xl mb-2 ${
                            metodoPagamento === "cartao"
                              ? "text-green-500 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            metodoPagamento === "cartao"
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Cartão
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMetodoPagamento("boleto")}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
                          metodoPagamento === "boleto"
                            ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600"
                            : "border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                        }`}
                      >
                        <FaBarcode
                          className={`text-2xl mb-2 ${
                            metodoPagamento === "boleto"
                              ? "text-green-500 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            metodoPagamento === "boleto"
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Boleto
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMetodoPagamento("pix")}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
                          metodoPagamento === "pix"
                            ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600"
                            : "border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                        }`}
                      >
                        <RiQrCodeLine
                          className={`text-2xl mb-2 ${
                            metodoPagamento === "pix"
                              ? "text-green-500 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            metodoPagamento === "pix"
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          PIX
                        </span>
                      </button>
                    </div>
                  </div>

                  {metodoPagamento === "cartao" && (
                    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                      <div className="flex items-center mb-4">
                        <BsShieldLock className="text-green-500 dark:text-green-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Seus dados são criptografados e protegidos
                        </span>
                      </div>

                      <form onSubmit={processarAssinatura}>
                        <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            Número do Cartão*
                          </label>
                          <input
                            type="text"
                            name="numero"
                            value={dadosCartao.numero}
                            onChange={(e) => {
                              const formatted = formatarNumeroCartao(
                                e.target.value
                              );
                              setDadosCartao({
                                ...dadosCartao,
                                numero: formatted,
                              });
                            }}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            Nome no Cartão*
                          </label>
                          <input
                            type="text"
                            name="nome"
                            value={dadosCartao.nome}
                            onChange={handleDadosCartaoChange}
                            placeholder="Ex: JOÃO P SILVA"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                              Validade*
                            </label>
                            <input
                              type="text"
                              name="validade"
                              value={dadosCartao.validade}
                              onChange={(e) => {
                                const formatted = formatarValidade(
                                  e.target.value
                                );
                                setDadosCartao({
                                  ...dadosCartao,
                                  validade: formatted,
                                });
                              }}
                              placeholder="MM/AA"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                              CVV*
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={dadosCartao.cvv}
                              onChange={(e) => {
                                const formatted = formatarCVV(e.target.value);
                                setDadosCartao({
                                  ...dadosCartao,
                                  cvv: formatted,
                                });
                              }}
                              placeholder="123"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processando...
                            </span>
                          ) : (
                            `Assinar ${
                              planos.find((p) => p.id === planoSelecionado)
                                ?.nome || "Plano"
                            }`
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {metodoPagamento === "boleto" && (
                    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                        <p className="text-yellow-800 dark:text-yellow-400 flex items-start">
                          <FaInfoCircle className="flex-shrink-0 mr-2 mt-1" />
                          <span>
                            Ao gerar o boleto, você terá até 3 dias úteis para
                            efetuar o pagamento. Sua assinatura será ativada
                            após a confirmação do pagamento, o que pode levar
                            até 3 dias úteis adicionais.
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-4">
                        <div className="text-center">
                          <FaBarcode className="text-5xl text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Clique no botão abaixo para gerar o boleto
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={processarAssinatura}
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? "Gerando boleto..." : "Gerar Boleto"}
                      </button>
                    </div>
                  )}

                  {metodoPagamento === "pix" && (
                    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                        <p className="text-yellow-800 dark:text-yellow-400 flex items-start">
                          <FaInfoCircle className="flex-shrink-0 mr-2 mt-1" />
                          <span>
                            O pagamento via PIX é processado instantaneamente.
                            Sua assinatura será ativada assim que o pagamento
                            for confirmado.
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-4">
                        <div className="w-48 h-48 bg-white flex items-center justify-center mb-3 rounded-lg">
                          <div className="w-40 h-40 border border-gray-300 flex items-center justify-center">
                            <RiQrCodeLine className="text-5xl text-gray-400" />
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                          Clique no botão abaixo para gerar o QR Code PIX
                        </p>
                      </div>

                      <button
                        onClick={processarAssinatura}
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? "Gerando QR Code..." : "Gerar QR Code PIX"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-start">
                    <FaLock className="text-gray-500 dark:text-gray-400 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Todos os pagamentos são processados de forma segura. Seus
                      dados estão protegidos com criptografia de ponta a ponta e
                      não são armazenados em nossos servidores.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Cancelamento */}
      {mostrarCancelamentoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-scaleIn">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Cancelar assinatura?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ao cancelar sua assinatura, você perderá acesso a todos os
              benefícios premium ao final do período atual. Tem certeza que
              deseja continuar?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setMostrarCancelamentoModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={cancelarAssinatura}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70"
              >
                {loading ? "Processando..." : "Confirmar Cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AssinaturaFornecedor;
