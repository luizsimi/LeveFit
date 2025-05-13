import { FaTimes, FaWhatsapp } from "react-icons/fa";

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
    e.currentTarget.src = "/default-avatar.png"; // Usa uma imagem local de fallback
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Impede que o clique seja propagado para o fundo
      >
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">
            Detalhes do Fornecedor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            {fornecedor.logo ? (
              <img
                src={fornecedor.logo}
                alt={fornecedor.nome}
                className="w-24 h-24 rounded-full object-cover mb-4"
                onError={handleImageError}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {fornecedor.nome.charAt(0)}
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {fornecedor.nome}
            </h3>
          </div>

          {fornecedor.descricao ? (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Sobre nós
              </h4>
              <p className="text-gray-600">{fornecedor.descricao}</p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-gray-500 italic text-center">
                Este fornecedor ainda não adicionou uma descrição.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <a
              href={criarLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-full justify-center"
            >
              <FaWhatsapp className="mr-2" /> Contatar via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FornecedorModal;
