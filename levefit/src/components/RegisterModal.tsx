import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaStore,
  FaUserAlt,
  FaSpinner,
  FaCheck,
  FaExclamationCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
  termosAceitos: boolean;
}

interface ErrorResponse {
  error: string;
}

// Precisamos do any devido a uma limitação na tipagem do yup com campos condicionais
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResolverType = any;

// Função auxiliar para formatação de telefone/WhatsApp
const formatPhoneNumber = (value: string): string => {
  if (!value) return "";

  // Remove todos os caracteres não numéricos
  const numericValue = value.replace(/\D/g, "");

  // Formata de acordo com o comprimento
  if (numericValue.length <= 2) {
    return `(${numericValue}`;
  } else if (numericValue.length <= 6) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
  } else if (numericValue.length <= 10) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      6
    )}-${numericValue.slice(6)}`;
  } else {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      7
    )}-${numericValue.slice(7, 11)}`;
  }
};

const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;

const registerSchema = yup
  .object({
    nome: yup
      .string()
      .required("Nome é obrigatório")
      .min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    senha: yup
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .matches(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .matches(/[0-9]/, "Senha deve conter pelo menos um número")
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
        schema
          .required("WhatsApp é obrigatório para fornecedores")
          .matches(telefoneRegex, "Formato inválido. Use (99) 99999-9999"),
      otherwise: (schema) => schema.optional(),
    }),
    telefone: yup
      .string()
      .optional()
      .test(
        "telefone-format",
        "Formato inválido. Use (99) 99999-9999",
        (value) => {
          if (!value || value.trim() === "") return true;
          return telefoneRegex.test(value);
        }
      ),
    termosAceitos: yup
      .boolean()
      .oneOf([true], "Você deve aceitar os termos de uso")
      .required("Você deve aceitar os termos de uso"),
  })
  .required();

const RegisterModal = ({ onClose }: RegisterModalProps) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as ResolverType,
    defaultValues: {
      tipoUsuario: "cliente",
      termosAceitos: false,
    },
    mode: "onChange",
  });

  const tipoUsuario = watch("tipoUsuario");

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "telefone" | "whatsapp"
  ) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setValue(field, formattedValue, { shouldValidate: true });
  };

  const nextStep = async () => {
    if (step === 1) {
      const isStepValid = await trigger([
        "nome",
        "email",
        "tipoUsuario",
        "whatsapp",
      ]);
      if (isStepValid) {
        setStep(2);
      }
    }
  };

  const prevStep = () => {
    setStep(1);
  };

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
          ? {
              endereco: data.endereco || "",
              telefone: data.telefone || "",
            }
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
      }, 3000);
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

  const modalContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalContentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalContainerVariants}
        onClick={(e: React.MouseEvent) =>
          e.target === e.currentTarget && onClose()
        }
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-xl"
          variants={modalContentVariants}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {step === 1 ? "Informações Pessoais" : "Defina sua Senha"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="Fechar"
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

          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 h-2 rounded-full transition-all duration-300"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 flex items-center">
              <FaExclamationCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-4 flex items-center">
              <FaCheck className="mr-2 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Tipo de Usuário
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        tipoUsuario === "cliente"
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600"
                          : "border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-900"
                      }`}
                    >
                      <input
                        type="radio"
                        value="cliente"
                        {...register("tipoUsuario")}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <FaUserAlt
                          className={`text-2xl mb-2 ${
                            tipoUsuario === "cliente"
                              ? "text-green-500"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            tipoUsuario === "cliente"
                              ? "text-green-700 dark:text-green-500"
                              : "text-gray-700 dark:text-gray-400"
                          }`}
                        >
                          Cliente
                        </span>
                      </div>
                    </label>
                    <label
                      className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        tipoUsuario === "fornecedor"
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600"
                          : "border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-900"
                      }`}
                    >
                      <input
                        type="radio"
                        value="fornecedor"
                        {...register("tipoUsuario")}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <FaStore
                          className={`text-2xl mb-2 ${
                            tipoUsuario === "fornecedor"
                              ? "text-green-500"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            tipoUsuario === "fornecedor"
                              ? "text-green-700 dark:text-green-500"
                              : "text-gray-700 dark:text-gray-400"
                          }`}
                        >
                          Fornecedor
                        </span>
                      </div>
                    </label>
                  </div>
                  {errors.tipoUsuario && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {errors.tipoUsuario.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Nome{" "}
                    {tipoUsuario === "fornecedor"
                      ? "do Estabelecimento"
                      : "Completo"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      {...register("nome")}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors"
                      placeholder={
                        tipoUsuario === "fornecedor"
                          ? "Nome do seu negócio"
                          : "Seu nome completo"
                      }
                    />
                  </div>
                  {errors.nome && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {tipoUsuario === "fornecedor" && (
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      WhatsApp
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaWhatsapp className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="text"
                        {...register("whatsapp")}
                        onChange={(e) => handlePhoneChange(e, "whatsapp")}
                        value={watch("whatsapp") || ""}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors"
                        placeholder="(99) 99999-9999"
                      />
                    </div>
                    {errors.whatsapp && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.whatsapp.message}
                      </p>
                    )}
                  </div>
                )}

                {tipoUsuario === "cliente" && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        Endereço (opcional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="text"
                          {...register("endereco")}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors"
                          placeholder="Seu endereço"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        Telefone (opcional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="text"
                          {...register("telefone")}
                          onChange={(e) => handlePhoneChange(e, "telefone")}
                          value={watch("telefone") || ""}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors"
                          placeholder="(99) 99999-9999"
                        />
                      </div>
                      {errors.telefone && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {errors.telefone.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("senha")}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors"
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
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {errors.senha.message}
                    </p>
                  )}
                  <ul className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li
                      className={`flex items-center ${
                        watch("senha")?.length >= 6
                          ? "text-green-500 dark:text-green-400"
                          : ""
                      }`}
                    >
                      <span className="mr-1">
                        {watch("senha")?.length >= 6 ? "✓" : "•"}
                      </span>
                      Pelo menos 6 caracteres
                    </li>
                    <li
                      className={`flex items-center ${
                        /[A-Z]/.test(watch("senha") || "")
                          ? "text-green-500 dark:text-green-400"
                          : ""
                      }`}
                    >
                      <span className="mr-1">
                        {/[A-Z]/.test(watch("senha") || "") ? "✓" : "•"}
                      </span>
                      Pelo menos uma letra maiúscula
                    </li>
                    <li
                      className={`flex items-center ${
                        /[0-9]/.test(watch("senha") || "")
                          ? "text-green-500 dark:text-green-400"
                          : ""
                      }`}
                    >
                      <span className="mr-1">
                        {/[0-9]/.test(watch("senha") || "") ? "✓" : "•"}
                      </span>
                      Pelo menos um número
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmarSenha")}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors"
                      placeholder="Confirme sua senha"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {errors.confirmarSenha && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {errors.confirmarSenha.message}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      {...register("termosAceitos")}
                      className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Eu concordo com os{" "}
                      <a
                        href="#"
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline"
                        onClick={(e: React.MouseEvent) => e.preventDefault()}
                      >
                        Termos de Uso
                      </a>{" "}
                      e{" "}
                      <a
                        href="#"
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline"
                        onClick={(e: React.MouseEvent) => e.preventDefault()}
                      >
                        Política de Privacidade
                      </a>
                    </span>
                  </label>
                  {errors.termosAceitos && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {errors.termosAceitos.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center mt-6">
              {step === 1 ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg hover:shadow-md transition-all"
                  >
                    Próximo
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Cadastrando...
                      </span>
                    ) : (
                      "Finalizar Cadastro"
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegisterModal;
