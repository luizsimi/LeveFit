import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import {
  FaArrowLeft,
  FaImage,
  FaUpload,
  FaUtensils,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaTags,
  FaMoneyBillWave,
  FaAlignLeft,
  FaTimes,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Definir interface com tipagem correta para imagem opcional
interface PratoFormData {
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string | null;
  categoria: string;
  disponivel: boolean;
  emPromocao: boolean;
  precoOriginal?: number;
  dataFimPromocao?: string;
  calorias?: number | null;
  proteinas?: number | null;
  carboidratos?: number | null;
  gorduras?: number | null;
  fibras?: number | null;
  porcao?: string | null;
}

interface ErrorResponse {
  error: string;
}

// Schema com validação adequada para imagem opcional
const pratoSchema = yup
  .object({
    nome: yup.string().required("Nome do prato é obrigatório"),
    descricao: yup.string().required("Descrição é obrigatória"),
    preco: yup
      .number()
      .typeError("Preço deve ser um número")
      .positive("Preço deve ser positivo")
      .required("Preço é obrigatório"),
    imagem: yup.string().nullable().optional(),
    categoria: yup.string().required("Categoria é obrigatória"),
    disponivel: yup.boolean().required("Disponibilidade é obrigatória"),
    emPromocao: yup.boolean().default(false),
    precoOriginal: yup
      .number()
      .typeError("Preço original deve ser um número")
      .positive("Preço original deve ser positivo")
      .when("emPromocao", {
        is: true,
        then: (schema) =>
          schema.required("Preço original é obrigatório quando em promoção"),
        otherwise: (schema) => schema.optional(),
      }),
    dataFimPromocao: yup.string().optional(),
    calorias: yup
      .number()
      .transform((value) => (isNaN(value) || value === 0 ? null : value))
      .nullable()
      .typeError("Calorias devem ser um número")
      .min(0, "Calorias não podem ser negativas")
      .optional(),
    proteinas: yup
      .number()
      .transform((value) => (isNaN(value) || value === 0 ? null : value))
      .nullable()
      .typeError("Proteínas devem ser um número")
      .min(0, "Proteínas não podem ser negativas")
      .optional(),
    carboidratos: yup
      .number()
      .transform((value) => (isNaN(value) || value === 0 ? null : value))
      .nullable()
      .typeError("Carboidratos devem ser um número")
      .min(0, "Carboidratos não podem ser negativas")
      .optional(),
    gorduras: yup
      .number()
      .transform((value) => (isNaN(value) || value === 0 ? null : value))
      .nullable()
      .typeError("Gorduras devem ser um número")
      .min(0, "Gorduras não podem ser negativas")
      .optional(),
    fibras: yup
      .number()
      .transform((value) => (isNaN(value) || value === 0 ? null : value))
      .nullable()
      .typeError("Fibras devem ser um número")
      .min(0, "Fibras não podem ser negativas")
      .optional(),
    porcao: yup.string().nullable().optional(),
  })
  .required();

const categoriasDisponiveis = [
  "Saladas",
  "Vegano",
  "Vegetariano",
  "Proteico",
  "Low Carb",
  "Fit",
  "Bowls",
  "Sopas",
  "Orgânico",
  "Café da Manhã",
  "Snacks",
  "Sobremesas Saudáveis",
];

const FormularioPrato = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buscandoPrato, setBuscandoPrato] = useState(id ? true : false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [exibirInfoNutricional, setExibirInfoNutricional] = useState(true);
  const editando = !!id;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<PratoFormData>({
    resolver: yupResolver(pratoSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      preco: 0,
      categoria: "",
      imagem: null,
      disponivel: true,
      emPromocao: false,
      precoOriginal: undefined,
      dataFimPromocao: undefined,
      calorias: null,
      proteinas: null,
      carboidratos: null,
      gorduras: null,
      fibras: null,
      porcao: null,
    },
    mode: "onChange",
  });

  const imagemValue = watch("imagem");
  const categoriaValue = watch("categoria");
  const disponivelValue = watch("disponivel");
  const emPromocaoValue = watch("emPromocao");
  const precoValue = watch("preco");

  useEffect(() => {
    const buscarPrato = async () => {
      if (!id) return;

      try {
        setBuscandoPrato(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3333/pratos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Definir os valores do formulário com os dados do prato
        reset({
          nome: response.data.nome,
          descricao: response.data.descricao,
          preco: response.data.preco,
          imagem: response.data.imagem || null,
          categoria: response.data.categoria,
          disponivel: response.data.disponivel,
          emPromocao: response.data.emPromocao || false,
          precoOriginal: response.data.precoOriginal,
          dataFimPromocao: response.data.dataFimPromocao
            ? new Date(response.data.dataFimPromocao)
                .toISOString()
                .split("T")[0]
            : undefined,
          calorias: response.data.calorias || null,
          proteinas: response.data.proteinas || null,
          carboidratos: response.data.carboidratos || null,
          gorduras: response.data.gorduras || null,
          fibras: response.data.fibras || null,
          porcao: response.data.porcao || null,
        });

        // Se houver imagem, definir o preview
        if (response.data.imagem) {
          setImagePreview(response.data.imagem);
        }

        // Se houver informações nutricionais, exibir a seção
        if (
          response.data.calorias ||
          response.data.proteinas ||
          response.data.carboidratos ||
          response.data.gorduras ||
          response.data.fibras ||
          response.data.porcao
        ) {
          setExibirInfoNutricional(true);
        }

        setBuscandoPrato(false);
      } catch (error) {
        console.error("Erro ao buscar prato:", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response && axiosError.response.data) {
            setError(
              axiosError.response.data.error || "Erro ao carregar prato"
            );
          } else {
            setError("Erro ao conectar-se ao servidor");
          }
        } else {
          setError("Ocorreu um erro inesperado");
        }
        setBuscandoPrato(false);
      }
    };

    buscarPrato();
  }, [id, reset]);

  // Lidar com drag and drop de imagem
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  // Lidar com upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFiles(file);
  };

  const handleFiles = (file: File) => {
    // Verificar tipo de arquivo
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      setError("O arquivo deve ser uma imagem (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // Verificar tamanho do arquivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setValue("imagem", previewUrl, { shouldValidate: true, shouldDirty: true });
  };

  // Remover imagem
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setValue("imagem", null, { shouldValidate: true, shouldDirty: true });
  };

  // Função para fazer upload da imagem para o servidor
  const uploadImage = async (file: File): Promise<string> => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("imagem", file);

      const token = localStorage.getItem("token");
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

      return response.data.imageUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw new Error("Falha ao fazer upload da imagem");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PratoFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Se houver um arquivo de imagem, fazer o upload primeiro
      if (imageFile) {
        try {
          const imageUrl = await uploadImage(imageFile);
          data.imagem = imageUrl;
        } catch (error) {
          setError("Falha ao fazer upload da imagem. Tente novamente.");
          setLoading(false);
          return;
        }
      } else if (!data.imagem || data.imagem === "") {
        // Se não tiver nem arquivo nem URL, definir como null explicitamente
        data.imagem = null;
      }

      const token = localStorage.getItem("token");

      if (editando) {
        // Atualizar prato existente
        await axios.put(`http://localhost:3333/pratos/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSuccess("Prato atualizado com sucesso!");
      } else {
        // Criar novo prato
        await axios.post("http://localhost:3333/pratos", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSuccess("Prato criado com sucesso!");
      }

      // Resetar o formulário após sucesso e navegar de volta
      setTimeout(() => {
        navigate("/dashboard/fornecedor");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar prato:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data?.error ||
            "Ocorreu um erro ao salvar o prato. Tente novamente."
        );
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/dashboard/fornecedor")}
            className="mr-4 p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shadow-sm transition-all duration-200"
            aria-label="Voltar"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {editando ? "Editar Prato" : "Novo Prato"}
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FaExclamationCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FaCheckCircle className="mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {buscandoPrato ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 p-6 text-white">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <FaUtensils className="text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {editando
                      ? "Editar prato existente"
                      : "Cadastrar novo prato"}
                  </h2>
                  <p className="text-green-100 text-sm">
                    Preencha todos os campos obrigatórios marcados com *
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Coluna da esquerda - Informações básicas */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
                      <FaUtensils className="mr-2 text-green-600 dark:text-green-400" />
                      Nome do Prato*
                    </label>
                    <input
                      type="text"
                      {...register("nome")}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors"
                      placeholder="Ex: Salada Caesar com Frango Grelhado"
                    />
                    {errors.nome && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                        <FaExclamationCircle className="mr-1" />
                        {errors.nome.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
                      <FaAlignLeft className="mr-2 text-green-600 dark:text-green-400" />
                      Descrição*
                    </label>
                    <textarea
                      {...register("descricao")}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors resize-none"
                      placeholder="Descreva os ingredientes, modo de preparo e características especiais do prato..."
                    ></textarea>
                    {errors.descricao && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                        <FaExclamationCircle className="mr-1" />
                        {errors.descricao.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                      Seja detalhado e mencione informações relevantes como
                      ingredientes principais e benefícios nutricionais.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
                        <FaMoneyBillWave className="mr-2 text-green-600 dark:text-green-400" />
                        Preço (R$)*
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
                          R$
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register("preco")}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors"
                          placeholder="0,00"
                        />
                      </div>
                      {errors.preco && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                          <FaExclamationCircle className="mr-1" />
                          {errors.preco.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
                        <FaTags className="mr-2 text-green-600 dark:text-green-400" />
                        Categoria*
                      </label>
                      <select
                        {...register("categoria")}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors"
                      >
                        <option value="">Selecione uma categoria</option>
                        {categoriasDisponiveis.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {errors.categoria && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                          <FaExclamationCircle className="mr-1" />
                          {errors.categoria.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        id="disponivel"
                        {...register("disponivel")}
                        className="h-5 w-5 text-green-600 dark:text-green-400 rounded focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 border-gray-300 dark:border-gray-600"
                      />
                      <span className="ml-2 block text-gray-700 dark:text-gray-300">
                        Disponível para pedidos
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7 italic">
                      Marque esta opção para que o prato fique visível para os
                      clientes realizarem pedidos
                    </p>
                  </div>
                </div>

                {/* Coluna da direita - Imagem */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
                    <FaImage className="mr-2 text-green-600 dark:text-green-400" />
                    Imagem do Prato (recomendado)
                  </label>

                  <div
                    className={`border-2 ${
                      dragActive
                        ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                        : "border-dashed border-gray-300 dark:border-gray-600"
                    } rounded-lg p-6 mb-4 transition-all duration-200`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  >
                    {/* Preview da imagem */}
                    {imagePreview || imagemValue ? (
                      <div className="mb-4 relative">
                        <img
                          src={imagePreview || imagemValue || ""}
                          alt="Preview"
                          className="w-full h-48 object-contain rounded-md border border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          title="Remover imagem"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <FaCloudUploadAlt className="text-5xl text-gray-400 dark:text-gray-500 mb-3" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          Arraste e solte uma imagem aqui ou
                        </p>
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition-colors"
                        >
                          <FaUpload className="mr-2" />
                          Selecionar arquivo
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        <div className="mt-4">
                          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                            <FaInfoCircle className="mr-1 text-blue-500" />
                            <span>
                              Formatos aceitos: JPG, PNG, GIF ou WEBP (máx. 5MB)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* URL da imagem alternativa */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                        Ou insira a URL de uma imagem
                      </p>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                          <FaImage />
                        </span>
                        <input
                          type="text"
                          {...register("imagem")}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400"
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dicas e benefícios */}
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center">
                      <FaInfoCircle className="mr-2" />
                      Dicas para fotos atrativas
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                      <li>
                        • Use iluminação natural para destacar as cores dos
                        alimentos
                      </li>
                      <li>
                        • Fotografe de ângulos que mostrem bem os ingredientes
                      </li>
                      <li>
                        • Prefira fundos simples e neutros para destacar o prato
                      </li>
                      <li>
                        • Imagens de qualidade aumentam em até 30% a chance de
                        venda
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Seção de Promoção */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <FaTags className="mr-2 text-green-600 dark:text-green-400" />
                    Configurar Promoção
                  </h3>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="emPromocao"
                      {...register("emPromocao")}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="emPromocao"
                      className="ml-2 text-gray-700 dark:text-gray-300"
                    >
                      Colocar este prato em promoção
                    </label>
                  </div>

                  {emPromocaoValue && (
                    <div className="space-y-4 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg animate-fadeIn">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                          Preço Promocional (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          {...register("preco")}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                          Preço Original (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          {...register("precoOriginal")}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                        />
                        {errors.precoOriginal && (
                          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                            {errors.precoOriginal.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                          Válido até (opcional)
                        </label>
                        <input
                          type="date"
                          {...register("dataFimPromocao")}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Deixe em branco para promoção sem data de término.
                        </p>
                      </div>

                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                        <div className="flex">
                          <FaInfoCircle className="text-yellow-600 dark:text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-medium">
                                Economia para o cliente:
                              </span>{" "}
                              {watch("precoOriginal") && watch("preco")
                                ? `R$ ${(
                                    watch("precoOriginal") - watch("preco")
                                  ).toFixed(2)} (${Math.round(
                                    ((watch("precoOriginal") - watch("preco")) /
                                      watch("precoOriginal")) *
                                      100
                                  )}% de desconto)`
                                : "Defina os preços para calcular a economia"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção de Informações Nutricionais */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <FaInfoCircle className="mr-2 text-green-600 dark:text-green-400" />
                    Informações Nutricionais
                  </h3>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/50 mb-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full p-2 mr-3">
                      <FaInfoCircle className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-blue-800 dark:text-blue-300 font-medium">
                      Pratos com informações nutricionais detalhadas são
                      preferidos por 78% dos clientes preocupados com saúde e
                      bem-estar
                    </p>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 ml-11">
                    Adicionar estas informações aumenta a visibilidade e as
                    chances de venda do seu prato na plataforma.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setExibirInfoNutricional(!exibirInfoNutricional)
                  }
                  className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors w-full justify-center font-medium border border-green-200 dark:border-green-800/50 shadow-sm"
                >
                  {exibirInfoNutricional ? (
                    <FaTimes className="mr-2" />
                  ) : (
                    <FaInfoCircle className="mr-2 text-lg" />
                  )}
                  {exibirInfoNutricional ? "Ocultar" : "Mostrar"} informações
                  nutricionais{" "}
                  {!exibirInfoNutricional && "(calorias, proteínas, etc.)"}
                </button>

                {!exibirInfoNutricional && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Clique no botão acima para adicionar informações
                    nutricionais detalhadas do seu prato
                  </p>
                )}

                {exibirInfoNutricional && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="calorias"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Calorias (kcal)
                        </label>
                        <input
                          type="number"
                          id="calorias"
                          min="0"
                          {...register("calorias")}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                            errors.calorias
                              ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-800"
                              : "border-gray-300 focus:border-green-400 focus:ring-green-200 dark:border-gray-600 dark:focus:ring-green-700 dark:bg-gray-700 dark:text-white"
                          }`}
                        />
                        {errors.calorias && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                            {errors.calorias.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="porcao"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Porção (ex: "100g", "1 unidade")
                        </label>
                        <input
                          type="text"
                          id="porcao"
                          {...register("porcao")}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                            errors.porcao
                              ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-800"
                              : "border-gray-300 focus:border-green-400 focus:ring-green-200 dark:border-gray-600 dark:focus:ring-green-700 dark:bg-gray-700 dark:text-white"
                          }`}
                          placeholder="Ex: 300g"
                        />
                        {errors.porcao && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                            {errors.porcao.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="proteinas"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Proteínas (g)
                        </label>
                        <input
                          type="number"
                          id="proteinas"
                          min="0"
                          step="0.1"
                          {...register("proteinas")}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                            errors.proteinas
                              ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-800"
                              : "border-gray-300 focus:border-green-400 focus:ring-green-200 dark:border-gray-600 dark:focus:ring-green-700 dark:bg-gray-700 dark:text-white"
                          }`}
                        />
                        {errors.proteinas && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                            {errors.proteinas.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="carboidratos"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Carboidratos (g)
                        </label>
                        <input
                          type="number"
                          id="carboidratos"
                          min="0"
                          step="0.1"
                          {...register("carboidratos")}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                            errors.carboidratos
                              ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-800"
                              : "border-gray-300 focus:border-green-400 focus:ring-green-200 dark:border-gray-600 dark:focus:ring-green-700 dark:bg-gray-700 dark:text-white"
                          }`}
                        />
                        {errors.carboidratos && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                            {errors.carboidratos.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="gorduras"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Gorduras (g)
                        </label>
                        <input
                          type="number"
                          id="gorduras"
                          min="0"
                          step="0.1"
                          {...register("gorduras")}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                            errors.gorduras
                              ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-800"
                              : "border-gray-300 focus:border-green-400 focus:ring-green-200 dark:border-gray-600 dark:focus:ring-green-700 dark:bg-gray-700 dark:text-white"
                          }`}
                        />
                        {errors.gorduras && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                            {errors.gorduras.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="fibras"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Fibras (g)
                        </label>
                        <input
                          type="number"
                          id="fibras"
                          min="0"
                          step="0.1"
                          {...register("fibras")}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                            errors.fibras
                              ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-800"
                              : "border-gray-300 focus:border-green-400 focus:ring-green-200 dark:border-gray-600 dark:focus:ring-green-700 dark:bg-gray-700 dark:text-white"
                          }`}
                        />
                        {errors.fibras && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                            {errors.fibras.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
                      <FaInfoCircle className="inline-block mr-1" />
                      Fornecer informações nutricionais é opcional, mas
                      altamente recomendado para pratos fitness.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/fornecedor")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading
                    ? editando
                      ? "Atualizando..."
                      : "Criando..."
                    : editando
                    ? "Atualizar Prato"
                    : "Criar Prato"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FormularioPrato;
