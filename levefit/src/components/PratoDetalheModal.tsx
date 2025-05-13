import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUtensils,
  FaStar,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaWhatsapp,
  FaRegClock,
  FaLeaf,
} from "react-icons/fa";

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
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
  avaliacoes?: {
    id: number;
    nota: number;
    comentario: string;
    cliente?: {
      id: number;
      nome: string;
    };
  }[];
}

interface PratoDetalheModalProps {
  isOpen: boolean;
  onClose: () => void;
  pratoId: number | null;
}

const PratoDetalheModal = ({
  isOpen,
  onClose,
  pratoId,
}: PratoDetalheModalProps) => {
  const [prato, setPrato] = useState<Prato | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrato = async () => {
      if (!isOpen || !pratoId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3333/pratos/${pratoId}`
        );
        setPrato(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar detalhes do prato:", error);
        setError("Não foi possível carregar os detalhes deste prato.");
        setLoading(false);
      }
    };

    fetchPrato();
  }, [isOpen, pratoId]);

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

  const formatarDataValidade = (data?: string) => {
    if (!data) return null;

    const dt = new Date(data);
    return dt.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const abrirWhatsapp = () => {
    if (!prato) return;

    // Formatar mensagem para o WhatsApp
    const mensagem = `Olá, gostaria de pedir o prato "${prato.nome}" que vi no LeveFit!`;
    const whatsappUrl = `https://wa.me/${prato.fornecedor.whatsapp.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(mensagem)}`;

    // Abrir em nova aba
    window.open(whatsappUrl, "_blank");
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
            className="relative bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] overflow-auto rounded-xl shadow-2xl m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow"
              aria-label="Fechar"
            >
              <FaTimes size={18} className="text-gray-700 dark:text-gray-300" />
            </button>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">
                  Carregando detalhes...
                </p>
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg shadow-sm flex items-start">
                  <FaExclamationCircle className="mr-3 mt-1 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              </div>
            ) : prato ? (
              <>
                {/* Imagem de capa */}
                <div className="relative w-full h-48 bg-green-100 dark:bg-green-900/20">
                  {prato.imagem ? (
                    <img
                      src={prato.imagem}
                      alt={prato.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 dark:from-green-600 dark:to-green-800">
                      <FaUtensils className="text-5xl text-white/80" />
                    </div>
                  )}

                  {/* Overlay com gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  {/* Categoria e badge de promoção */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md flex items-center">
                      <FaLeaf className="mr-1 text-xs" />
                      {prato.categoria}
                    </div>

                    {prato.emPromocao && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md animate-pulse">
                        Promoção
                      </div>
                    )}
                  </div>

                  {/* Logo do fornecedor */}
                  <div className="absolute right-4 bottom-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                    {prato.fornecedor.logo ? (
                      <img
                        src={prato.fornecedor.logo}
                        alt={prato.fornecedor.nome}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">
                          {prato.fornecedor.nome.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {prato.nome}
                  </h2>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded text-sm">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">
                        {prato.mediaAvaliacao.toFixed(1)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                        ({prato.totalAvaliacoes} avaliações)
                      </span>
                    </div>

                    <span className="mx-2 text-gray-300 dark:text-gray-700">
                      •
                    </span>

                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      por{" "}
                      <span className="font-medium">
                        {prato.fornecedor.nome}
                      </span>
                    </span>
                  </div>

                  <div className="mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descrição
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {prato.descricao}
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg mb-5 border border-green-100 dark:border-green-800/20">
                    <div className="flex items-center mb-2">
                      <FaMoneyBillWave className="text-green-600 dark:text-green-400 mr-2" />
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        Preço
                      </h3>
                    </div>

                    {prato.emPromocao ? (
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="text-gray-400 dark:text-gray-500 line-through text-sm mr-2">
                            R$ {prato.precoOriginal?.toFixed(2)}
                          </span>
                          <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded">
                            {Math.round(
                              ((prato.precoOriginal! - prato.preco) /
                                prato.precoOriginal!) *
                                100
                            )}
                            % OFF
                          </span>
                        </div>
                        <div className="text-red-600 dark:text-red-400 text-2xl font-bold mt-1">
                          R$ {prato.preco.toFixed(2)}
                        </div>
                        {prato.dataFimPromocao && (
                          <div className="text-xs flex items-center mt-1 text-gray-500 dark:text-gray-400">
                            <FaRegClock className="mr-1" />
                            Promoção válida até{" "}
                            {formatarDataValidade(prato.dataFimPromocao)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-green-700 dark:text-green-400 text-2xl font-bold">
                        R$ {prato.preco.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={abrirWhatsapp}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center"
                    >
                      <FaWhatsapp className="mr-2 text-lg" />
                      Pedir agora
                    </button>

                    <button
                      onClick={onClose}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Nenhum detalhe disponível para este prato.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PratoDetalheModal;
