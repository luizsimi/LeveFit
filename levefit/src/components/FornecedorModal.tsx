import { FaTimes, FaWhatsapp, FaInfoCircle } from "react-icons/fa";

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
  [key: string]: unknown; // Melhor usar unknown do que any
}

interface FornecedorModalProps {
  fornecedor: Fornecedor | null;
  onClose: () => void;
}

const FornecedorModal = ({ fornecedor, onClose }: FornecedorModalProps) => {
  if (!fornecedor) return null;

  // Função de tratamento de erros para imagens
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("Erro ao carregar imagem, usando fallback");
    e.currentTarget.onerror = null; // Evita loop infinito
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fornecedor.nome
    )}&background=2F855A&color=fff&size=200`;
  };

  // Criar link do WhatsApp com número fixo
  const criarLinkWhatsApp = () => {
    let numero = "";

    // Se o fornecedor tem WhatsApp, use-o
    if (
      fornecedor.whatsapp &&
      typeof fornecedor.whatsapp === "string" &&
      fornecedor.whatsapp.trim() !== ""
    ) {
      numero = fornecedor.whatsapp.replace(/\D/g, "");
      console.log("Usando WhatsApp do fornecedor:", numero);
    } else {
      // Fallback para um número central (substitua por um número real)
      numero = "5511999999999";
      console.log("Usando número de fallback");
    }

    const mensagem = encodeURIComponent(
      `Olá! Estou interessado nos produtos de ${fornecedor.nome}. Gostaria de mais informações.`
    );
    return `https://wa.me/${numero}?text=${mensagem}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // Impede que o clique seja propagado para o fundo
      >
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Detalhes do Fornecedor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            {fornecedor.logo ? (
              <img
                src={fornecedor.logo}
                alt={fornecedor.nome}
                className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-white dark:border-gray-700 shadow-md transition-transform hover:scale-105 duration-300"
                onError={handleImageError}
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4 border-4 border-white dark:border-gray-700 shadow-md">
                <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {fornecedor.nome.charAt(0)}
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
              {fornecedor.nome}
            </h3>
          </div>

          {fornecedor.descricao ? (
            <div className="mb-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-inner">
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                <FaInfoCircle className="mr-2 text-green-600 dark:text-green-400" />{" "}
                Sobre nós
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {fornecedor.descricao}
              </p>
            </div>
          ) : (
            <div className="mb-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-inner">
              <p className="text-gray-500 dark:text-gray-400 italic text-center">
                Este fornecedor ainda não adicionou uma descrição.
              </p>
            </div>
          )}

          <div className="mt-6">
            <a
              href={criarLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg w-full justify-center transition-colors duration-300 shadow-sm font-medium"
            >
              <FaWhatsapp className="mr-2 text-lg" /> Contatar via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FornecedorModal;
