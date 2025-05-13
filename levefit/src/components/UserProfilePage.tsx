import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

interface ErrorResponse {
  error: string;
}

interface ProfileFormData {
  nome: string;
  endereco?: string;
  telefone?: string;
  whatsapp?: string;
  descricao?: string;
  logo?: string;
  senha?: string;
  confirmarSenha?: string;
}

// Schema genérico que contém todos os campos possíveis
const formSchema = yup
  .object({
    nome: yup.string().required("Nome é obrigatório"),
    // Campos do cliente
    endereco: yup.string().optional(),
    telefone: yup.string().optional(),
    // Campos do fornecedor
    whatsapp: yup.string().optional(),
    descricao: yup.string().optional(),
    logo: yup.string().optional(),
    // Campos comuns
    senha: yup
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .optional(),
    confirmarSenha: yup
      .string()
      .oneOf([yup.ref("senha")], "As senhas devem coincidir")
      .optional(),
  })
  .required();

const UserProfilePage = () => {
  const { userType, userData, logout } = useAuth();
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
  } = useForm<ProfileFormData>({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    const buscarPerfil = async () => {
      try {
        setCarregandoPerfil(true);
        const token = localStorage.getItem("token");
        const endpoint =
          userType === "cliente"
            ? "http://localhost:3333/clientes/perfil"
            : "http://localhost:3333/fornecedores/perfil";

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const perfil = response.data;

        // Definindo valores iniciais com base no tipo de usuário
        if (userType === "cliente") {
          reset({
            nome: perfil.nome,
            endereco: perfil.endereco || "",
            telefone: perfil.telefone || "",
            senha: "",
            confirmarSenha: "",
          });
        } else {
          reset({
            nome: perfil.nome,
            whatsapp: perfil.whatsapp || "",
            descricao: perfil.descricao || "",
            logo: perfil.logo || "",
            senha: "",
            confirmarSenha: "",
          });
        }

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

    if (userType && userData) {
      buscarPerfil();
    } else {
      navigate("/");
    }
  }, [userType, userData, reset, navigate, logout]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const endpoint =
        userType === "cliente"
          ? "http://localhost:3333/clientes/perfil"
          : "http://localhost:3333/fornecedores/perfil";

      // Remover campos vazios ou que não serão atualizados
      const dadosAtualizados: Partial<ProfileFormData> = {};

      // Adicionar campos com base no tipo de usuário
      if (userType === "cliente") {
        dadosAtualizados.nome = data.nome;
        dadosAtualizados.endereco = data.endereco;
        dadosAtualizados.telefone = data.telefone;
      } else {
        dadosAtualizados.nome = data.nome;
        dadosAtualizados.whatsapp = data.whatsapp;
        dadosAtualizados.descricao = data.descricao;
        dadosAtualizados.logo = data.logo;
      }

      // Adicionar senha apenas se foi informada
      if (data.senha) {
        dadosAtualizados.senha = data.senha;
      }

      await axios.put(endpoint, dadosAtualizados, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const renderClienteForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Nome*</label>
          <input
            type="text"
            {...register("nome")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.nome && (
            <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Telefone*
          </label>
          <input
            type="text"
            {...register("telefone")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="(00) 00000-0000"
          />
          {errors.telefone && (
            <p className="text-red-600 text-sm mt-1">
              {errors.telefone.message}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Endereço*
        </label>
        <input
          type="text"
          {...register("endereco")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Rua, número, bairro, cidade, estado"
        />
        {errors.endereco && (
          <p className="text-red-600 text-sm mt-1">{errors.endereco.message}</p>
        )}
      </div>
    </>
  );

  const renderFornecedorForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Nome*</label>
          <input
            type="text"
            {...register("nome")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.nome && (
            <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>
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
            placeholder="(00) 00000-0000"
          />
          {errors.whatsapp && (
            <p className="text-red-600 text-sm mt-1">
              {errors.whatsapp.message}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          URL da Logo (opcional)
        </label>
        <input
          type="text"
          {...register("logo")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="https://exemplo.com/sua-logo.jpg"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Descrição (opcional)
        </label>
        <textarea
          {...register("descricao")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={4}
          placeholder="Descreva o seu negócio..."
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-md">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
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
                {userData?.imagem || userData?.logo ? (
                  <img
                    src={userData?.imagem || userData?.logo}
                    alt={userData?.nome}
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
                {userType === "fornecedor" && (
                  <div
                    className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${
                      userData?.assinaturaAtiva
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Assinatura {userData?.assinaturaAtiva ? "Ativa" : "Inativa"}
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 className="text-lg font-semibold mb-4">
                Informações Pessoais
              </h3>

              {userType === "cliente"
                ? renderClienteForm()
                : renderFornecedorForm()}

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

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/")}
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

export default UserProfilePage;
