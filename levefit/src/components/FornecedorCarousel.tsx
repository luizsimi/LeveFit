import { useState, useEffect } from "react";
import axios from "axios";
import FornecedorModal from "./FornecedorModal";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Usando a mesma interface de Fornecedor que está no FornecedorModal
interface Fornecedor {
  id: number;
  nome: string;
  descricao?: string;
  logo?: string;
  whatsapp?: string;
  telefone?: string;
  contato?: string;
  celular?: string;
  tel?: string;
  [key: string]: unknown; // Permite propriedades adicionais
}

const FornecedorCarousel = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFornecedor, setSelectedFornecedor] =
    useState<Fornecedor | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  // Função de tratamento de erros para imagens
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("Erro ao carregar imagem, usando fallback");
    e.currentTarget.onerror = null; // Evita loop infinito
    // Gerar avatar usando API ui-avatars com as iniciais do fornecedor
    if (e.currentTarget.alt) {
      const nome = e.currentTarget.alt;
      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        nome
      )}&background=2F855A&color=fff&size=200`;
    } else {
      e.currentTarget.src =
        "https://ui-avatars.com/api/?name=F&background=2F855A&color=fff&size=200";
    }
  };

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

  // Função para abrir o modal com o fornecedor selecionado
  const handleOpenModal = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setShowModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFornecedor(null);
  };

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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Fornecedores Parceiros
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 h-48 animate-pulse"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Renderizar mensagem de erro
  if (error) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Fornecedores Parceiros
        </h2>
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg shadow-sm">
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
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Fornecedores Parceiros
      </h2>

      <div className="relative">
        {/* Botão Anterior */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-700 p-3 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
          aria-label="Anterior"
        >
          <FaChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Carrossel */}
        <div className="overflow-hidden mx-12">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${
                (currentIndex * 100) / itemsPerSlide
              }%)`,
            }}
          >
            {fornecedores.map((fornecedor) => (
              <div
                key={fornecedor.id}
                className="px-3 flex-shrink-0"
                style={{ width: `${100 / itemsPerSlide}%` }}
              >
                <div
                  className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-lg dark:shadow-gray-900/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                  onClick={() => handleOpenModal(fornecedor)}
                >
                  <div className="flex flex-col items-center text-center h-full p-4">
                    {fornecedor.logo ? (
                      <img
                        src={fornecedor.logo}
                        alt={fornecedor.nome}
                        className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-white dark:border-gray-700 shadow-sm transition-transform duration-300 group-hover:scale-105"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3 border-2 border-white dark:border-gray-700 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          {fornecedor.nome.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1 tracking-tight">
                      {fornecedor.nome}
                    </h3>
                    {fornecedor.descricao && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                        {fornecedor.descricao.length > 80
                          ? `${fornecedor.descricao.substring(0, 80)}...`
                          : fornecedor.descricao}
                      </p>
                    )}
                    <div className="mt-auto w-full pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-green-600 dark:text-green-400 font-medium text-xs inline-flex items-center group-hover:underline">
                        Ver detalhes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Próximo */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-700 p-3 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
          aria-label="Próximo"
        >
          <FaChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Indicadores de slide */}
      <div className="flex justify-center mt-6">
        {Array.from({
          length: Math.ceil(fornecedores.length / itemsPerSlide),
        }).map((_, index) => (
          <button
            key={index}
            className={`h-2.5 w-2.5 rounded-full mx-1.5 transition-all duration-300 ${
              index === Math.floor(currentIndex / itemsPerSlide)
                ? "bg-green-600 dark:bg-green-500 w-6"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
            onClick={() => setCurrentIndex(index * itemsPerSlide)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Modal de detalhes do fornecedor */}
      {showModal && (
        <FornecedorModal
          fornecedor={selectedFornecedor}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FornecedorCarousel;
