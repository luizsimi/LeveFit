import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { FaArrowLeft } from "react-icons/fa";

interface PratoFormData {
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string;
  categoria: string;
  disponivel: boolean;
}

interface ErrorResponse {
  error: string;
}

// Usando typecasting aqui por causa da limitação com campos condicionais no yup
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResolverType = any;

const pratoSchema = yup
  .object({
    nome: yup.string().required("Nome do prato é obrigatório"),
    descricao: yup.string().required("Descrição é obrigatória"),
    preco: yup
      .number()
      .typeError("Preço deve ser um número")
      .positive("Preço deve ser positivo")
      .required("Preço é obrigatório"),
    imagem: yup.string().optional(),
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
  const editando = !!id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PratoFormData>({
    resolver: yupResolver(pratoSchema) as ResolverType,
    defaultValues: {
      disponivel: true,
    },
  });

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
          imagem: response.data.imagem || "",
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

  const onSubmit = async (data: PratoFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      // Formatar o preço corretamente
      const dadosFormatados = {
        ...data,
        preco: Number(data.preco),
      };

      if (editando) {
        // Atualizar prato existente
        await axios.put(`http://localhost:3333/pratos/${id}`, dadosFormatados, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess("Prato atualizado com sucesso!");
      } else {
        // Criar novo prato
        await axios.post("http://localhost:3333/pratos", dadosFormatados, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess("Prato criado com sucesso!");
      }

      // Redirecionar após alguns segundos
      setTimeout(() => {
        navigate("/dashboard/fornecedor");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar prato:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
          setError(axiosError.response.data.error || "Erro ao salvar prato");

          // Se o erro for relacionado à assinatura não ativa
          if (
            axiosError.response.status === 403 &&
            axiosError.response.data.error?.includes("assinatura")
          ) {
            setTimeout(() => {
              navigate("/dashboard/fornecedor");
            }, 3000);
          }
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
                  Imagem (URL)
                </label>
                <input
                  type="text"
                  {...register("imagem")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://sua-imagem.com/foto.jpg"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Insira a URL de uma imagem online. Recomendado: 600x400px
                </p>
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
