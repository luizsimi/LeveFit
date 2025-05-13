import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { useAuth } from "../contexts/AuthContext";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {assinaturaWarning && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {assinaturaWarning}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tipo de Usuário</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="cliente"
                  {...register("tipoUsuario")}
                  className="form-radio h-5 w-5 text-green-600"
                />
                <span className="ml-2 text-gray-700">Cliente</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="fornecedor"
                  {...register("tipoUsuario")}
                  className="form-radio h-5 w-5 text-green-600"
                />
                <span className="ml-2 text-gray-700">Fornecedor</span>
              </label>
            </div>
            {errors.tipoUsuario && (
              <p className="text-red-600 text-sm mt-1">
                {errors.tipoUsuario.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              {...register("senha")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Sua senha"
            />
            {errors.senha && (
              <p className="text-red-600 text-sm mt-1">
                {errors.senha.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
