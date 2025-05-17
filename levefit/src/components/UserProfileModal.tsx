import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import {
  FaTimes,
  FaUser,
  FaKey,
  FaCheck,
  FaExclamationTriangle,
  FaUpload,
  FaImage,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

// Variável estática para controlar se já carregou o perfil (evita múltiplas solicitações)
let alreadyFetchedProfile = false;

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
  const { userType, userData, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isRequestingRef = useRef(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
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

  // Função para buscar perfil sem useEffect
  const buscarPerfil = async () => {
    // Só executar uma vez
    if (alreadyFetchedProfile || isRequestingRef.current) return;

    try {
      isRequestingRef.current = true;
      alreadyFetchedProfile = true;

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token de autenticação não encontrado");
        setCarregandoPerfil(false);
        return;
      }

      const endpoint =
        userType === "cliente"
          ? "http://localhost:3333/clientes/perfil"
          : "http://localhost:3333/fornecedores/perfil";

      console.log("Buscando perfil do usuário tipo:", userType);
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const perfil = response.data;
      console.log("Dados do perfil recebidos com sucesso");

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
    } finally {
      setCarregandoPerfil(false);
      isRequestingRef.current = false;
    }
  };

  // Chamar buscarPerfil manualmente
  if (carregandoPerfil && userType && userData && !isRequestingRef.current) {
    buscarPerfil();
  }

  // Resetar flag quando o componente for fechado
  const handleCloseModal = () => {
    alreadyFetchedProfile = false;
    onClose();
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (isRequestingRef.current) return;

    setLoading(true);
    setError("");
    setSuccess("");
    isRequestingRef.current = true;

    try {
      console.log("Enviando dados do perfil para atualização");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token de autenticação não encontrado");
        return;
      }

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

      console.log("Perfil atualizado com sucesso");

      // Atualizar os dados no contexto diretamente para evitar uma chamada adicional
      if (response.data) {
        updateUserData(response.data);
      }

      setSuccess("Perfil atualizado com sucesso!");

      // Limpar campos de senha após atualização bem-sucedida
      reset({
        ...data,
        senha: "",
        confirmarSenha: "",
      });

      // Fechar o modal após alguns segundos
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (
          axiosError.response?.status === 401 ||
          axiosError.response?.status === 403
        ) {
          setError("Sessão expirada, faça login novamente");
          setTimeout(() => handleCloseModal(), 2000);
        } else if (axiosError.response?.data) {
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
      // Adicionar delay antes de permitir nova requisição
      setTimeout(() => {
        isRequestingRef.current = false;
      }, 1000);
    }
  };

  // Função para fazer upload da imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validar tamanho do arquivo
    if (file.size > maxSize) {
      setError("A imagem deve ter no máximo 5MB");
      return;
    }

    // Validar tipo de arquivo
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/i)) {
      setError("Por favor, selecione uma imagem válida (JPEG, PNG, GIF, WEBP)");
      return;
    }

    setUploadingImage(true);
    setError("");

    // Criar URL para pré-visualização da imagem
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const formData = new FormData();
      formData.append("imagem", file);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token de autenticação não encontrado");
        setUploadingImage(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:3333/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Atualizar o valor do campo logo com a URL da imagem
      if (response.data.imageUrl) {
        reset({
          ...getValues(),
          logo: response.data.imageUrl,
        });
      }

      setSuccess("Imagem carregada com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(
            axiosError.response.data.error || "Erro ao fazer upload da imagem"
          );
        } else {
          setError("Erro ao conectar-se ao servidor");
        }
      } else {
        setError("Ocorreu um erro inesperado ao fazer upload da imagem");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderClienteForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Nome*
        </label>
        <input
          type="text"
          {...register("nome")}
          className={`w-full px-3 py-2 border ${
            errors.nome
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        />
        {errors.nome && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.nome.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Endereço
        </label>
        <input
          type="text"
          {...register("endereco")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Informe seu endereço completo"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Telefone
        </label>
        <input
          type="text"
          {...register("telefone")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Ex: (11) 99999-9999"
        />
      </div>
    </>
  );

  const renderFornecedorForm = () => (
    <>
      <div className="mb-4">
        <label
          htmlFor="nome"
          className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
        >
          Nome do Estabelecimento *
        </label>
        <input
          id="nome"
          type="text"
          {...register("nome")}
          placeholder="Nome completo"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
        />
        {errors.nome && (
          <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="whatsapp"
          className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
        >
          WhatsApp *
        </label>
        <input
          id="whatsapp"
          type="text"
          {...register("whatsapp")}
          placeholder="Ex: (11) 99999-9999"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
        />
        {errors.whatsapp && (
          <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="descricao"
          className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
        >
          Descrição
        </label>
        <textarea
          id="descricao"
          {...register("descricao")}
          placeholder="Descreva seu estabelecimento brevemente"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white h-32"
        />
        {errors.descricao && (
          <p className="text-red-500 text-sm mt-1">
            {errors.descricao.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Logo do Estabelecimento
        </label>

        <div className="flex flex-col items-center">
          {/* Área de preview da imagem */}
          <div className="mb-3 w-full flex justify-center">
            {(imagePreview || getValues().logo) && (
              <div className="relative group">
                <img
                  src={imagePreview || getValues().logo}
                  alt="Logo do estabelecimento"
                  className="h-32 w-32 object-cover rounded-full border-4 border-green-100 dark:border-green-900 shadow-md"
                />
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <FaUpload className="text-white text-xl" />
                </div>
              </div>
            )}

            {!imagePreview && !getValues().logo && (
              <div
                className="h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center border-4 border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={triggerFileInput}
              >
                <FaImage className="text-gray-400 dark:text-gray-500 text-4xl mb-2" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Adicionar logo
                </span>
              </div>
            )}
          </div>

          {/* Campo oculto para a URL da imagem */}
          <input id="logo" type="hidden" {...register("logo")} />

          {/* Input de arquivo oculto */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />

          {/* Botão de upload */}
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={uploadingImage}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm flex items-center justify-center shadow-sm"
          >
            {uploadingImage ? (
              <>
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Enviando...
              </>
            ) : (
              <>
                <FaUpload className="mr-2" />
                {getValues().logo || imagePreview
                  ? "Trocar imagem"
                  : "Carregar logo"}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Tamanho máximo: 5MB. Formatos: JPG, PNG, GIF, WEBP
          </p>
        </div>
      </div>
    </>
  );

  const renderPasswordFields = () => (
    <>
      <div className="mt-6 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="alterarSenha"
            checked={mostrarSenha}
            onChange={() => setMostrarSenha(!mostrarSenha)}
            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
          <label
            htmlFor="alterarSenha"
            className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer flex items-center"
          >
            <FaKey className="mr-2 text-green-600 dark:text-green-400" />{" "}
            Alterar senha
          </label>
        </div>
      </div>

      {mostrarSenha && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-fadeIn">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("senha")}
                className={`w-full px-3 py-2 border ${
                  errors.senha
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
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

          <div className="mb-2">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmarSenha")}
                className={`w-full px-3 py-2 border ${
                  errors.confirmarSenha
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.confirmarSenha && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.confirmarSenha.message}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center">
            <FaUser className="text-green-600 dark:text-green-400 mr-2" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Editar Perfil
            </h2>
          </div>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 flex items-start">
              <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-4 flex items-center">
              <FaCheck className="mr-2 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {carregandoPerfil ? (
            <div className="text-center py-8 animate-pulse">
              <div className="inline-block rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent animate-spin"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Carregando perfil...
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit as any)}
              className="animate-slideUp"
            >
              {userType === "cliente"
                ? renderClienteForm()
                : renderFornecedorForm()}
              {renderPasswordFields()}

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Salvando...
                    </span>
                  ) : (
                    "Salvar Alterações"
                  )}
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
