import { useState, useEffect } from "react";
import axios from "axios";

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
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Categorias</h3>
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-8 w-24 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Categorias</h3>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (categorias.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Categorias</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategoria(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            categoriaAtual === null
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todas
        </button>

        {categorias.map((categoria) => (
          <button
            key={categoria}
            onClick={() => onSelectCategoria(categoria)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              categoriaAtual === categoria
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
