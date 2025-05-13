import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUtensils,
  FaStar,
  FaExclamationCircle,
} from "react-icons/fa";

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal: number;
  imagem?: string;
  categoria: string;
  mediaAvaliacao: number;
  totalAvaliacoes: number;
  emPromocao: boolean;
  dataFimPromocao?: string;
  fornecedor: {
    id: number;
    nome: string;
    whatsapp: string;
    logo?: string;
  };
}

interface PromocoesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PromocoesModal = ({ isOpen, onClose }: PromocoesModalProps) => {
  const [pratosPromocao, setPratosPromocao] = useState<Prato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromos = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3333/pratos/promocoes"
        );
        setPratosPromocao(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar promoções:", error);
        setError(
          "Não foi possível carregar as promoções. Tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    fetchPromos();
  }, [isOpen]);

  // Impedir scroll do body quando o modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const formatarDataValidade = (data: string) => {
    if (!data) return null;

    const dt = new Date(data);
    return dt.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="relative bg-white dark:bg-gray-800 w-full max-w-5xl max-h-[90vh] overflow-auto rounded-xl shadow-2xl m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do modal */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 p-5 shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="bg-white p-2 rounded-full mr-3 shadow-md">
                    <FaUtensils className="text-red-500" />
                  </span>
                  Ofertas Especiais
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Fechar"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <p className="text-white/90 ml-12 text-sm">
                Aproveite os melhores preços em pratos saudáveis
              </p>
              <div className="h-1.5 bg-white/20 mt-4"></div>
            </div>

            {/* Conteúdo do modal */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Carregando promoções...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg shadow-sm flex items-start">
                  <FaExclamationCircle className="mr-3 mt-1 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              ) : pratosPromocao.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                    Não há promoções disponíveis no momento.
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Visite-nos mais tarde para novas ofertas especiais.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      Encontramos{" "}
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {pratosPromocao.length}
                      </span>{" "}
                      pratos em promoção para você
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pratosPromocao.map((prato) => (
                      <div
                        key={prato.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 relative"
                      >
                        {/* Tag de desconto em formato de fita */}
                        <div className="absolute top-4 -right-8 bg-red-500 text-white py-1 px-10 font-bold text-sm transform rotate-45 z-10">
                          {Math.round(
                            ((prato.precoOriginal - prato.preco) /
                              prato.precoOriginal) *
                              100
                          )}
                          % OFF
                        </div>

                        <Link to={`/prato/${prato.id}`} onClick={onClose}>
                          <div className="relative h-44 overflow-hidden bg-green-100 dark:bg-green-900/20">
                            {prato.imagem ? (
                              <img
                                src={prato.imagem}
                                alt={prato.nome}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                <FaUtensils className="text-3xl text-gray-400 dark:text-gray-500" />
                              </div>
                            )}

                            {/* Badge do fornecedor */}
                            <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs flex items-center shadow-md">
                              {prato.fornecedor.logo ? (
                                <img
                                  src={prato.fornecedor.logo}
                                  alt={prato.fornecedor.nome}
                                  className="w-4 h-4 rounded-full mr-1"
                                />
                              ) : null}
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {prato.fornecedor.nome}
                              </span>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-800 dark:text-white mb-1 line-clamp-1">
                                {prato.nome}
                              </h3>
                              <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs text-green-600 dark:text-green-400">
                                {prato.categoria}
                              </div>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                              {prato.descricao}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                              <div>
                                <div className="flex items-center">
                                  <span className="text-gray-400 dark:text-gray-500 line-through text-sm">
                                    R$ {prato.precoOriginal.toFixed(2)}
                                  </span>
                                  <span className="ml-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-1.5 py-0.5 rounded">
                                    OFERTA
                                  </span>
                                </div>
                                <div className="text-red-600 dark:text-red-400 font-bold">
                                  R$ {prato.preco.toFixed(2)}
                                </div>
                                {prato.dataFimPromocao && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Válido até:{" "}
                                    {formatarDataValidade(
                                      prato.dataFimPromocao
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center">
                                <FaStar className="text-yellow-400 mr-1" />
                                <span className="text-sm font-medium">
                                  {prato.mediaAvaliacao.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                  ({prato.totalAvaliacoes})
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 text-center text-green-600 dark:text-green-400 font-medium text-sm">
                              Clique para ver detalhes
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer do modal */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center shadow-md">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dica: Clique em um prato para ver mais detalhes
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromocoesModal;
