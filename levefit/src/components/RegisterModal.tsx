import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";

interface RegisterModalProps {
  onClose: () => void;
}

interface RegisterFormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  tipoUsuario: "cliente" | "fornecedor";
  whatsapp?: string;
  endereco?: string;
  telefone?: string;
}

interface ErrorResponse {
  error: string;
}

// Precisamos do any devido a uma limitação na tipagem do yup com campos condicionais
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResolverType = any;

const registerSchema = yup
  .object({
    nome: yup.string().required("Nome é obrigatório"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    senha: yup
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .required("Senha é obrigatória"),
    confirmarSenha: yup
      .string()
      .oneOf([yup.ref("senha")], "As senhas devem corresponder")
      .required("Confirmação de senha é obrigatória"),
    tipoUsuario: yup
      .string()
      .oneOf(["cliente", "fornecedor"], "Selecione um tipo de usuário")
      .required("Tipo de usuário é obrigatório"),
    whatsapp: yup.string().when("tipoUsuario", {
      is: "fornecedor",
      then: (schema) =>
        schema.required("WhatsApp é obrigatório para fornecedores"),
      otherwise: (schema) => schema.optional(),
    }),
  })
  .required();

const RegisterModal = ({ onClose }: RegisterModalProps) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as ResolverType,
    defaultValues: {
      tipoUsuario: "cliente",
    },
  });

  const tipoUsuario = watch("tipoUsuario");

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint =
        data.tipoUsuario === "cliente"
          ? "http://localhost:3333/clientes"
          : "http://localhost:3333/fornecedores";

      const userData = {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        ...(data.tipoUsuario === "cliente"
          ? { endereco: data.endereco, telefone: data.telefone }
          : { whatsapp: data.whatsapp }),
      };

      console.log("Enviando dados para:", endpoint);
      console.log("Dados:", userData);

      const response = await axios.post(endpoint, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Resposta:", response.data);
      setSuccess(`Cadastro realizado com sucesso! Faça login para continuar.`);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: unknown) {
      console.error("Erro completo:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        console.error("Detalhes do erro:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          message: axiosError.message,
        });

        if (axiosError.response && axiosError.response.data) {
          setError(
            axiosError.response.data.error || "Erro ao realizar cadastro"
          );
        } else if (axiosError.request) {
          // A requisição foi feita mas não recebeu resposta
          console.error("Sem resposta do servidor:", axiosError.request);
          setError(
            "Servidor não está respondendo. Verifique se o backend está em execução."
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Cadastro</h2>
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

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
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
            <label className="block text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              {...register("nome")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Seu nome completo"
            />
            {errors.nome && (
              <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>
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

          {tipoUsuario === "fornecedor" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">WhatsApp</label>
              <input
                type="text"
                {...register("whatsapp")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="(99) 99999-9999"
              />
              {errors.whatsapp && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>
          )}

          {tipoUsuario === "cliente" && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Endereço (opcional)
                </label>
                <input
                  type="text"
                  {...register("endereco")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Seu endereço"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Telefone (opcional)
                </label>
                <input
                  type="text"
                  {...register("telefone")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="(99) 99999-9999"
                />
              </div>
            </>
          )}

          <div className="mb-4">
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

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirmar Senha</label>
            <input
              type="password"
              {...register("confirmarSenha")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirme sua senha"
            />
            {errors.confirmarSenha && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmarSenha.message}
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
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
