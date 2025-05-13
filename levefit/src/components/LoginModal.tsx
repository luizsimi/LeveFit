import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { useAuth } from "../contexts/AuthContext";
import {
  FaTimes,
  FaEnvelope,
  FaLock,
  FaUserAlt,
  FaStore,
  FaExclamationTriangle,
} from "react-icons/fa";

interface LoginModalProps {
  onClose: () => void;
}

interface LoginFormData {
  email: string;
  senha: string;
  tipoUsuario: "cliente" | "fornecedor";
}

interface ErrorResponse {
  error: string;
}

const loginSchema = yup
  .object({
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    senha: yup.string().required("Senha é obrigatória"),
    tipoUsuario: yup
      .string()
      .oneOf(["cliente", "fornecedor"], "Selecione um tipo de usuário")
      .required("Tipo de usuário é obrigatório"),
  })
  .required();

const LoginModal = ({ onClose }: LoginModalProps) => {
  const [error, setError] = useState("");
  const [assinaturaWarning, setAssinaturaWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      tipoUsuario: "cliente",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setAssinaturaWarning("");
    setLoading(true);

    try {
      console.log("DEBUG - LoginModal - Iniciando login:", {
        email: data.email,
        tipoUsuario: data.tipoUsuario,
        url: `http://localhost:3333/auth/login/${data.tipoUsuario}`,
      });

      const response = await axios.post(
        `http://localhost:3333/auth/login/${data.tipoUsuario}`,
        {
          email: data.email,
          senha: data.senha,
        }
      );

      console.log("DEBUG - LoginModal - Resposta do servidor:", {
        status: response.status,
        token: response.data.token ? "Recebido" : "Não recebido",
        userData: response.data[data.tipoUsuario] ? "Recebido" : "Não recebido",
      });

      // Verificar se os dados do usuário e token foram recebidos corretamente
      if (!response.data.token || !response.data[data.tipoUsuario]) {
        console.error(
          "DEBUG - LoginModal - Dados incompletos na resposta:",
          response.data
        );
        setError("Resposta do servidor incompleta. Tente novamente.");
        setLoading(false);
        return;
      }

      // Armazenar token e informações do usuário no localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", data.tipoUsuario);
      localStorage.setItem(
        "userData",
        JSON.stringify(response.data[data.tipoUsuario])
      );

      console.log("DEBUG - LoginModal - Dados salvos no localStorage");

      // Usar o context login
      login(
        response.data.token,
        data.tipoUsuario,
        response.data[data.tipoUsuario]
      );

      // Verificar assinatura para fornecedores
      if (data.tipoUsuario === "fornecedor") {
        console.log(
          "DEBUG - LoginModal - Verificando assinatura do fornecedor"
        );
        const fornecedor = response.data.fornecedor;
        console.log("DEBUG - LoginModal - Dados do fornecedor:", {
          id: fornecedor.id,
          nome: fornecedor.nome,
          assinaturaAtiva: fornecedor.assinaturaAtiva,
        });

        if (fornecedor.assinaturaAtiva === false) {
          console.log(
            "DEBUG - LoginModal - Fornecedor sem assinatura ativa, redirecionando"
          );
          setAssinaturaWarning("Sua assinatura não está ativa");

          // Fechar modal e redirecionar após um curto delay
          setTimeout(() => {
            onClose();
            console.log(
              "DEBUG - LoginModal - Redirecionando para página de assinatura"
            );
            window.location.href = "/dashboard/fornecedor/assinatura";
          }, 1500);

          return;
        }
      }

      // Fechar modal e não redireciona (mantém na página atual)
      console.log("DEBUG - LoginModal - Login concluído com sucesso");
      onClose();
    } catch (error: unknown) {
      console.error("DEBUG - LoginModal - Erro no login:", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        console.log("DEBUG - LoginModal - Detalhes do erro:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });

        if (axiosError.response && axiosError.response.data) {
          setError(axiosError.response.data.error || "Erro ao fazer login");
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Login
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FaExclamationTriangle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {assinaturaWarning && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FaExclamationTriangle className="mr-2 flex-shrink-0" />
            <span>{assinaturaWarning}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="animate-slideUp">
          <div className="mb-5">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Tipo de Usuário
            </label>
            <div className="flex space-x-4">
              <label className="flex-1 flex items-center justify-center p-3 border rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group [&:has(input:checked)]:bg-green-50 [&:has(input:checked)]:dark:bg-green-900/20 [&:has(input:checked)]:border-green-500">
                <input
                  type="radio"
                  value="cliente"
                  {...register("tipoUsuario")}
                  className="sr-only"
                />
                <FaUserAlt className="mr-2 text-gray-500 dark:text-gray-400 group-[:has(input:checked)]:text-green-600 dark:group-[:has(input:checked)]:text-green-400" />
                <span className="text-gray-700 dark:text-gray-300 group-[:has(input:checked)]:text-green-700 dark:group-[:has(input:checked)]:text-green-400 font-medium">
                  Cliente
                </span>
              </label>
              <label className="flex-1 flex items-center justify-center p-3 border rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group [&:has(input:checked)]:bg-green-50 [&:has(input:checked)]:dark:bg-green-900/20 [&:has(input:checked)]:border-green-500">
                <input
                  type="radio"
                  value="fornecedor"
                  {...register("tipoUsuario")}
                  className="sr-only"
                />
                <FaStore className="mr-2 text-gray-500 dark:text-gray-400 group-[:has(input:checked)]:text-green-600 dark:group-[:has(input:checked)]:text-green-400" />
                <span className="text-gray-700 dark:text-gray-300 group-[:has(input:checked)]:text-green-700 dark:group-[:has(input:checked)]:text-green-400 font-medium">
                  Fornecedor
                </span>
              </label>
            </div>
            {errors.tipoUsuario && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.tipoUsuario.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="email"
                {...register("email")}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="seu@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("senha")}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Sua senha"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.senha && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.senha.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300 font-medium shadow-sm ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
