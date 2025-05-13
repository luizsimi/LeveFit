import { useState, useEffect } from "react";
import axios from "axios";
import { FaTags, FaFilter } from "react-icons/fa";

interface CategoriaFilterProps {
  onSelectCategoria: (categoria: string | null) => void;
  categoriaAtual: string | null;
}

const CategoriaFilter = ({
  onSelectCategoria,
  categoriaAtual,
}: CategoriaFilterProps) => {
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3333/pratos/categorias"
        );
        setCategorias(response.data);
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
        >
          Todas as opções
        </button>

        {categorias.map((categoria) => (
          <button
            key={categoria}
            onClick={() => onSelectCategoria(categoria)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
              categoriaAtual === categoria
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {categoria}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriaFilter;
