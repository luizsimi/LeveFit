import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Fornecedor {
  id: number;
  nome: string;
  descricao?: string;
  logo?: string;
}

const FornecedorCarousel = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Número de fornecedores a serem exibidos por vez (responsivo)
  const getItemsPerSlide = () => {
    if (window.innerWidth < 640) return 1; // Mobile
    if (window.innerWidth < 1024) return 2; // Tablet
    return 3; // Desktop
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  // Atualizar itemsPerSlide quando a janela for redimensionada
  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Buscar fornecedores da API
  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3333/fornecedores/ativos"
        );
        setFornecedores(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
        setError("Erro ao carregar os fornecedores parceiros.");
        setLoading(false);
      }
    };

    fetchFornecedores();
  }, []);

  // Navegar para o próximo slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerSlide >= fornecedores.length
        ? 0
        : prevIndex + itemsPerSlide
    );
  };

  // Navegar para o slide anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerSlide < 0
        ? Math.max(0, fornecedores.length - itemsPerSlide)
        : prevIndex - itemsPerSlide
    );
  };

  // Renderizar placeholders durante o carregamento
  if (loading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Fornecedores Parceiros
        </h2>
        <div className="flex space-x-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-lg p-6 w-full h-48 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Renderizar mensagem de erro
  if (error) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Fornecedores Parceiros
        </h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Não renderizar nada se não houver fornecedores
  if (fornecedores.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Fornecedores Parceiros
      </h2>

      <div className="relative">
        {/* Botão Anterior */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          aria-label="Anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Carrossel */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${
                (currentIndex / fornecedores.length) * 100
              }%)`,
              width: `${(fornecedores.length / itemsPerSlide) * 100}%`,
            }}
          >
            {fornecedores.map((fornecedor) => (
              <div
                key={fornecedor.id}
                className="px-2"
                style={{ width: `${100 / fornecedores.length}%` }}
              >
                <Link
                  to={`/fornecedores/${fornecedor.id}`}
                  className="block bg-white rounded-lg shadow-md p-6 h-full hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col items-center text-center h-full">
                    {fornecedor.logo ? (
                      <img
                        src={fornecedor.logo}
                        alt={fornecedor.nome}
                        className="w-20 h-20 rounded-full mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          {fornecedor.nome.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {fornecedor.nome}
                    </h3>
                    {fornecedor.descricao && (
                      <p className="text-sm text-gray-600">
                        {fornecedor.descricao.length > 100
                          ? `${fornecedor.descricao.substring(0, 100)}...`
                          : fornecedor.descricao}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Próximo */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          aria-label="Próximo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Indicadores de slide */}
      <div className="flex justify-center mt-4">
        {Array.from({
          length: Math.ceil(fornecedores.length / itemsPerSlide),
        }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${
              index === Math.floor(currentIndex / itemsPerSlide)
                ? "bg-green-600"
                : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index * itemsPerSlide)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FornecedorCarousel;
