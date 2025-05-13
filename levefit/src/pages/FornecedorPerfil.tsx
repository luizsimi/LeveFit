import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

interface PerfilFormData {
  nome: string;
  whatsapp: string;
  descricao: string;
  logo: string;
  senha: string;
  confirmarSenha: string;
}

interface ErrorResponse {
  error: string;
}

// Usando typecasting aqui por causa da limitação com campos condicionais no yup
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResolverType = any;

const perfilSchema = yup
  .object({
    nome: yup.string().required("Nome é obrigatório"),
    whatsapp: yup.string().required("WhatsApp é obrigatório"),
    descricao: yup.string(),
    logo: yup.string(),
    senha: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: yup
      .string()
      .oneOf([yup.ref("senha")], "As senhas devem coincidir"),
  })
  .required();

const FornecedorPerfil = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PerfilFormData>({
    resolver: yupResolver(perfilSchema) as ResolverType,
  });

  useEffect(() => {
    const buscarPerfil = async () => {
      try {
        setCarregandoPerfil(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:3333/fornecedores/perfil",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const perfil = response.data;
        reset({
          nome: perfil.nome,
          whatsapp: perfil.whatsapp,
          descricao: perfil.descricao || "",
          logo: perfil.logo || "",
          senha: "",
          confirmarSenha: "",
        });

        setCarregandoPerfil(false);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (
            axiosError.response?.status === 401 ||
            axiosError.response?.status === 403
          ) {
            logout();
            navigate("/", { replace: true });
          } else {
            setError("Erro ao buscar dados do perfil");
          }
        } else {
          setError("Ocorreu um erro inesperado");
        }
        setCarregandoPerfil(false);
      }
    };

    buscarPerfil();
  }, [reset, navigate, logout]);

  const onSubmit = async (data: PerfilFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      // Remover campos vazios ou que não serão atualizados
      const dadosAtualizados: Partial<PerfilFormData> = {
        nome: data.nome,
        whatsapp: data.whatsapp,
        descricao: data.descricao,
        logo: data.logo,
      };

      // Adicionar senha apenas se foi informada
      if (data.senha) {
        dadosAtualizados.senha = data.senha;
      }

      await axios.put(
        "http://localhost:3333/fornecedores/perfil",
        dadosAtualizados,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Perfil atualizado com sucesso!");

      // Atualizar o formulário com os dados atualizados mas sem a senha
      reset({
        ...data,
        senha: "",
        confirmarSenha: "",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(
            axiosError.response.data.error || "Erro ao atualizar perfil"
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
              onClick={() => navigate("/dashboard/fornecedor")}
              className="mr-4 p-2 rounded-full hover:bg-green-500 flex items-center justify-center"
              aria-label="Voltar"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {carregandoPerfil ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
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

            <div className="flex items-center mb-6">
              <div className="mr-4">
                {userData?.logo ? (
                  <img
                    src={userData.logo}
                    alt={userData.nome}
                    className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-500">
                    <FaUser className="text-3xl text-green-600" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {userData?.nome}
                </h2>
                <p className="text-gray-600">{userData?.email}</p>
                <button
                  onClick={() => navigate("/dashboard/fornecedor/assinatura")}
                  className="mt-2 text-sm px-3 py-1 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
                >
                  {userData?.assinaturaAtiva
                    ? "Gerenciar assinatura"
                    : "Ativar assinatura"}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nome*
                </label>
                <input
                  type="text"
                  {...register("nome")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.nome && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  WhatsApp*
                </label>
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

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  URL da Logo (opcional)
                </label>
                <input
                  type="text"
                  {...register("logo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://sua-imagem.com/logo.jpg"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Insira a URL de uma imagem online para sua logo. Recomendado:
                  imagem quadrada.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  {...register("descricao")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Descreva seu negócio, especialidades, horários de funcionamento, etc."
                ></textarea>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Alteração de Senha
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Preencha os campos abaixo apenas se desejar alterar sua senha
                  atual.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("senha")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                    {errors.senha && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.senha.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmarSenha")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                    {errors.confirmarSenha && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.confirmarSenha.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/fornecedor")}
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
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default FornecedorPerfil;
