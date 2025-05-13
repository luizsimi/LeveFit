import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { FaArrowLeft, FaImage, FaUpload } from "react-icons/fa";

// Definir interface com tipagem correta para imagem opcional
interface PratoFormData {
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string | null;
  categoria: string;
  disponivel: boolean;
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
  const editando = !!id;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PratoFormData>({
    resolver: yupResolver(pratoSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      preco: 0,
      categoria: "",
      imagem: null,
      disponivel: true,
    },
  });

  const imagemValue = watch("imagem");

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
        });

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

  // Lidar com upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
            <h1 className="text-2xl font-bold">
              {editando ? "Editar Prato" : "Novo Prato"}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {buscandoPrato ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nome do Prato*
                </label>
                <input
                  type="text"
                  {...register("nome")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Salada Caesar"
                />
                {errors.nome && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Descrição*
                </label>
                <textarea
                  {...register("descricao")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Descreva os ingredientes e como o prato é preparado"
                ></textarea>
                {errors.descricao && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.descricao.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Preço (R$)*
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("preco")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0,00"
                  />
                  {errors.preco && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.preco.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Categoria*
                  </label>
                  <select
                    {...register("categoria")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categoriasDisponiveis.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.categoria && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.categoria.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Imagem do Prato (opcional)
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {/* Preview da imagem */}
                  {(imagePreview || imagemValue) && (
                    <div className="mb-4">
                      <img
                        src={imagePreview || imagemValue}
                        alt="Preview"
                        className="w-full max-h-48 object-contain rounded-md"
                      />
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    {/* Upload de arquivo */}
                    <div className="flex-1">
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <FaUpload className="mr-2" />
                        Selecionar arquivo
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF ou WEBP (máx. 5MB)
                      </p>
                    </div>

                    {/* OU */}
                    <div className="text-center md:text-left text-gray-500">
                      OU
                    </div>

                    {/* URL da imagem */}
                    <div className="flex-1">
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <FaImage />
                        </span>
                        <input
                          type="text"
                          {...register("imagem")}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                          placeholder="https://sua-imagem.com/foto.jpg"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Ou insira a URL de uma imagem já hospedada
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="disponivel"
                  {...register("disponivel")}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="disponivel"
                  className="ml-2 block text-gray-700"
                >
                  Disponível para pedidos
                </label>
              </div>

              <div className="flex justify-end space-x-4">
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
      </main>
    </div>
  );
};

export default FormularioPrato;
