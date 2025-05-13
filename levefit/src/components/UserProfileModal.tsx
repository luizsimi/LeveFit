import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

interface UserProfileModalProps {
  onClose: () => void;
}

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
const formSchema = yup.object().shape({
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
});

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { userType, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(formSchema) as any,
    defaultValues: {
      nome: "",
      endereco: "",
      telefone: "",
      whatsapp: "",
      descricao: "",
      logo: "",
      senha: "",
      confirmarSenha: "",
    },
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
        console.log("Dados do perfil recebidos:", perfil);

        // Definindo valores iniciais com base no tipo de usuário
        if (userType === "cliente") {
          reset({
            nome: perfil.nome || "",
            endereco: perfil.endereco || "",
            telefone: perfil.telefone || "",
            senha: "",
            confirmarSenha: "",
          });
        } else {
          reset({
            nome: perfil.nome || "",
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
            onClose();
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
      onClose();
    }
  }, [userType, userData, reset, onClose]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Dados a serem enviados:", data);
      const token = localStorage.getItem("token");
      const endpoint =
        userType === "cliente"
          ? "http://localhost:3333/clientes/perfil"
          : "http://localhost:3333/fornecedores/perfil";

      // Remover campos vazios ou que não serão atualizados
      const dadosAtualizados: Partial<ProfileFormData> = {
        nome: data.nome,
      };

      // Adicionar campos com base no tipo de usuário
      if (userType === "cliente") {
        dadosAtualizados.endereco = data.endereco;
        dadosAtualizados.telefone = data.telefone;
      } else {
        dadosAtualizados.whatsapp = data.whatsapp;
        dadosAtualizados.descricao = data.descricao;
        dadosAtualizados.logo = data.logo;
      }

      // Adicionar senha apenas se foi informada
      if (data.senha) {
        dadosAtualizados.senha = data.senha;
      }

      const response = await axios.put(endpoint, dadosAtualizados, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Resposta da atualização:", response.data);
      setSuccess("Perfil atualizado com sucesso!");

      // Limpar campos de senha após atualização bem-sucedida
      reset({
        ...data,
        senha: "",
        confirmarSenha: "",
      });

      // Atualizar os dados do usuário no contexto
      // Aqui você pode adicionar código para atualizar o contexto se necessário

      // Fechar o modal após alguns segundos
      setTimeout(() => {
        onClose();
      }, 2000);
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
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nome*</label>
        <input
          type="text"
          {...register("nome")}
          className={`w-full px-3 py-2 border ${
            errors.nome ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
        />
        {errors.nome && (
          <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Endereço</label>
        <input
          type="text"
          {...register("endereco")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Telefone</label>
        <input
          type="text"
          {...register("telefone")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </>
  );

  const renderFornecedorForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nome*</label>
        <input
          type="text"
          {...register("nome")}
          className={`w-full px-3 py-2 border ${
            errors.nome ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
        />
        {errors.nome && (
          <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">WhatsApp</label>
        <input
          type="text"
          {...register("whatsapp")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="ex: (11) 99999-9999"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          URL da Logo (imagem)
        </label>
        <input
          type="text"
          {...register("logo")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="URL da imagem da sua logo"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Descrição do seu negócio
        </label>
        <textarea
          {...register("descricao")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Descreva seu negócio, especialidades, horários de atendimento, etc."
        ></textarea>
        <p className="text-sm text-gray-500 mt-1">
          Esta descrição será exibida nos cards e no perfil do seu
          estabelecimento.
        </p>
      </div>
    </>
  );

  const renderPasswordFields = () => (
    <>
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="alterarSenha"
            checked={mostrarSenha}
            onChange={() => setMostrarSenha(!mostrarSenha)}
            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
          />
          <label
            htmlFor="alterarSenha"
            className="text-gray-700 font-medium cursor-pointer"
          >
            Alterar senha
          </label>
        </div>
      </div>

      {mostrarSenha && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Nova Senha
            </label>
            <input
              type="password"
              {...register("senha")}
              className={`w-full px-3 py-2 border ${
                errors.senha ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.senha && (
              <p className="text-red-500 text-sm mt-1">
                {errors.senha.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              {...register("confirmarSenha")}
              className={`w-full px-3 py-2 border ${
                errors.confirmarSenha ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.confirmarSenha && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmarSenha.message}
              </p>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
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

          {carregandoPerfil ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Carregando perfil...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit as any)}>
              {userType === "cliente"
                ? renderClienteForm()
                : renderFornecedorForm()}
              {renderPasswordFields()}

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
