import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTags,
  FaFilter,
  FaLeaf,
  FaUtensils,
  FaCarrot,
  FaSeedling,
  FaAppleAlt,
  FaWeightHanging,
  FaDrumstickBite,
  FaList,
} from "react-icons/fa";
import React from "react";

interface CategoriaFilterProps {
  onSelectCategoria: (categoria: string | null) => void;
  categoriaAtual: string | null;
}

interface CategoriaContagem {
  nome: string;
  contagem: number;
}

// Mapeamento de categorias para seus respectivos ícones
const categoriaIcons: Record<string, React.ReactElement> = {
  "Todas as opções": <FaList className="mr-2" />,
  Saladas: <FaLeaf className="mr-2" />,
  Bowls: <FaUtensils className="mr-2" />,
  Vegano: <FaCarrot className="mr-2" />,
  Orgânico: <FaSeedling className="mr-2" />,
  Vegetariano: <FaAppleAlt className="mr-2" />,
  "Low Carb": <FaWeightHanging className="mr-2" />,
  Proteico: <FaDrumstickBite className="mr-2" />,
};

// Função para obter o ícone certo para cada categoria
const getIconForCategoria = (categoria: string | null): React.ReactElement => {
  if (!categoria) return categoriaIcons["Todas as opções"];
  return categoriaIcons[categoria] || <FaTags className="mr-2" />;
};

const CategoriaFilter = ({
  onSelectCategoria,
  categoriaAtual,
}: CategoriaFilterProps) => {
  const [categorias, setCategorias] = useState<CategoriaContagem[]>([]);
  const [totalPratos, setTotalPratos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        // Obter categorias com contagem
        const response = await axios.get(
          "http://localhost:3333/pratos/categorias?contagem=true"
        );

        // Se a API não estiver preparada para retornar contagem, vamos fazer manualmente
        if (
          Array.isArray(response.data) &&
          typeof response.data[0] === "string"
        ) {
          // API retornou apenas nomes de categorias
          const categoriasSimples = response.data as string[];

          // Buscar todos os pratos para contar manualmente
          const pratosResponse = await axios.get(
            "http://localhost:3333/pratos"
          );
          const pratos = pratosResponse.data;

          // Calcular contagem por categoria
          const contagemCategorias: Record<string, number> = {};
          const total = pratos.length;

          interface PratoBase {
            id: number;
            categoria: string;
          }

          pratos.forEach((prato: PratoBase) => {
            const categoria = prato.categoria;
            contagemCategorias[categoria] =
              (contagemCategorias[categoria] || 0) + 1;
          });

          // Formatar para o novo formato
          const categoriasComContagem = categoriasSimples.map((nome) => ({
            nome,
            contagem: contagemCategorias[nome] || 0,
          }));

          setCategorias(categoriasComContagem);
          setTotalPratos(total);
        } else {
          // API já retornou no formato esperado com contagem
          setCategorias(response.data);
          setTotalPratos(
            response.data.reduce(
              (acc: number, cat: CategoriaContagem) => acc + cat.contagem,
              0
            )
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setError("Erro ao carregar as categorias.");
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  if (loading) {
    return (
      <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
          <FaTags className="mr-2 text-green-500 dark:text-green-400" />
          Filtrar por categoria
        </h3>
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
          <FaTags className="mr-2 text-green-500 dark:text-green-400" />
          Filtrar por categoria
        </h3>
        <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  if (categorias.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
        <FaFilter className="mr-2 text-green-500 dark:text-green-400" />
        Filtrar por categoria
      </h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelectCategoria(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center hover:scale-105 active:scale-95 ${
            categoriaAtual === null
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
          aria-label="Ver todos os pratos"
        >
          {getIconForCategoria(null)}
          <span>Todas as opções</span>
          <span className="ml-2 bg-white/20 dark:bg-black/20 text-xs px-1.5 py-0.5 rounded-full">
            {totalPratos}
          </span>
        </button>

        {categorias.map(({ nome, contagem }) => (
          <button
            key={nome}
            onClick={() => onSelectCategoria(nome)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center hover:scale-105 active:scale-95 ${
              categoriaAtual === nome
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            aria-label={`Filtrar por ${nome}`}
          >
            {getIconForCategoria(nome)}
            <span>{nome}</span>
            <span className="ml-2 bg-white/20 dark:bg-black/20 text-xs px-1.5 py-0.5 rounded-full">
              {contagem}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriaFilter;
