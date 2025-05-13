import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCreditCard,
  FaBarcode,
} from "react-icons/fa";
import { RiQrCodeLine } from "react-icons/ri";
import axios, { AxiosError } from "axios";
import { useAuth } from "../contexts/AuthContext";

interface ErrorResponse {
  error: string;
}

type MetodoPagamento = "cartao" | "boleto" | "pix";

const AssinaturaFornecedor = () => {
  const { userData } = useAuth();
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

  // Dados do plano
  const planoMensal = {
    nome: "Plano Mensal LeveFit",
    valor: 40.0,
    descricao: "Assinatura mensal da plataforma LeveFit para fornecedores",
  };

  useEffect(() => {
    console.log("AssinaturaFornecedor - Página carregada");
    console.log("AssinaturaFornecedor - Dados do usuário:", userData);

    // Verificar o status da assinatura do fornecedor atual
    const verificarAssinatura = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(
          "AssinaturaFornecedor - Token:",
          token ? "Existe" : "Não existe"
        );

        const response = await axios.get(
          "http://localhost:3333/fornecedores/perfil",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "AssinaturaFornecedor - Resposta do perfil:",
          response.data
        );
        setAssinaturaStatus(response.data.assinaturaAtiva);
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
      }
    };

    verificarAssinatura();
  }, [userData]);

  const handleDadosCartaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosCartao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const processarAssinatura = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

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
        { metodoPagamento },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Assinatura ativada com sucesso!");
      setAssinaturaStatus(true);
      // Atualizar informações de usuário no contexto
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-md">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-green-500 flex items-center justify-center"
              aria-label="Voltar"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold">Assinatura LeveFit</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {assinaturaStatus
                ? "Sua assinatura está ativa"
                : "Ative sua assinatura"}
            </h2>

            {assinaturaStatus ? (
              <div className="bg-green-100 p-4 rounded-lg flex items-center">
                <FaCheckCircle className="text-green-600 text-xl mr-3" />
                <div>
                  <p className="text-green-800 font-medium">
                    Sua assinatura está ativa!
                  </p>
                  <p className="text-green-700 text-sm">
                    Você tem acesso completo à plataforma LeveFit.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-blue-100 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    {planoMensal.nome}
                  </h3>
                  <p className="text-blue-700 mb-2">{planoMensal.descricao}</p>
                  <p className="text-2xl font-bold text-blue-800">
                    R$ {planoMensal.valor.toFixed(2)}{" "}
                    <span className="text-sm font-normal">/mês</span>
                  </p>
                  <ul className="mt-4">
                    <li className="flex items-center text-blue-700 mb-2">
                      <FaCheckCircle className="text-blue-600 mr-2" />
                      Destaque na lista de fornecedores
                    </li>
                    <li className="flex items-center text-blue-700 mb-2">
                      <FaCheckCircle className="text-blue-600 mr-2" />
                      Cadastro ilimitado de pratos
                    </li>
                    <li className="flex items-center text-blue-700 mb-2">
                      <FaCheckCircle className="text-blue-600 mr-2" />
                      Suporte prioritário
                    </li>
                    <li className="flex items-center text-blue-700">
                      <FaCheckCircle className="text-blue-600 mr-2" />
                      Estatísticas avançadas
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Escolha o método de pagamento
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setMetodoPagamento("cartao")}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
                        metodoPagamento === "cartao"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      <FaCreditCard
                        className={`text-2xl mb-2 ${
                          metodoPagamento === "cartao"
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={
                          metodoPagamento === "cartao"
                            ? "text-green-600"
                            : "text-gray-600"
                        }
                      >
                        Cartão
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMetodoPagamento("boleto")}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
                        metodoPagamento === "boleto"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      <FaBarcode
                        className={`text-2xl mb-2 ${
                          metodoPagamento === "boleto"
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={
                          metodoPagamento === "boleto"
                            ? "text-green-600"
                            : "text-gray-600"
                        }
                      >
                        Boleto
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMetodoPagamento("pix")}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
                        metodoPagamento === "pix"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      <RiQrCodeLine
                        className={`text-2xl mb-2 ${
                          metodoPagamento === "pix"
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={
                          metodoPagamento === "pix"
                            ? "text-green-600"
                            : "text-gray-600"
                        }
                      >
                        PIX
                      </span>
                    </button>
                  </div>
                </div>

                {metodoPagamento === "cartao" && (
                  <form onSubmit={processarAssinatura} className="mb-6">
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Número do Cartão*
                      </label>
                      <input
                        type="text"
                        name="numero"
                        value={dadosCartao.numero}
                        onChange={handleDadosCartaoChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Nome no Cartão*
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={dadosCartao.nome}
                        onChange={handleDadosCartaoChange}
                        placeholder="Ex: JOÃO P SILVA"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Validade*
                        </label>
                        <input
                          type="text"
                          name="validade"
                          value={dadosCartao.validade}
                          onChange={handleDadosCartaoChange}
                          placeholder="MM/AA"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          CVV*
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={dadosCartao.cvv}
                          onChange={handleDadosCartaoChange}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
                    >
                      {loading ? "Processando..." : "Assinar por R$ 40,00/mês"}
                    </button>
                  </form>
                )}

                {metodoPagamento === "boleto" && (
                  <div className="mb-6">
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                      <p className="text-gray-700 mb-2">
                        Ao clicar em "Gerar Boleto", você receberá um boleto
                        bancário para pagamento.
                      </p>
                      <p className="text-gray-700">
                        Sua assinatura será ativada após a confirmação do
                        pagamento, o que pode levar até 3 dias úteis.
                      </p>
                    </div>
                    <button
                      onClick={processarAssinatura}
                      disabled={loading}
                      className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
                    >
                      {loading ? "Gerando..." : "Gerar Boleto"}
                    </button>
                  </div>
                )}

                {metodoPagamento === "pix" && (
                  <div className="mb-6">
                    <div className="bg-gray-100 p-4 rounded-lg mb-4 flex flex-col items-center">
                      <p className="text-gray-700 mb-4 text-center">
                        Ao clicar em "Gerar QR Code", você receberá um QR Code
                        PIX para pagamento imediato.
                      </p>
                      <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                        <p className="text-gray-500">QR Code PIX</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Sua assinatura será ativada imediatamente após a
                        confirmação do pagamento.
                      </p>
                    </div>
                    <button
                      onClick={processarAssinatura}
                      disabled={loading}
                      className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
                    >
                      {loading ? "Processando..." : "Fazer Pagamento PIX"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssinaturaFornecedor;
