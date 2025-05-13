import { Link } from "react-router-dom";
import { FaStar, FaRegStar, FaWhatsapp, FaArrowRight } from "react-icons/fa";

interface PratoProps {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string;
  categoria: string;
  mediaAvaliacao: number;
  totalAvaliacoes: number;
  fornecedor: {
    id: number;
    nome: string;
    whatsapp: string;
    logo?: string;
  };
}

// Array de URLs de imagens padrão para diferentes categorias de pratos
const defaultImages = {
  Saladas:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format",
  Vegano:
    "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=500&auto=format",
  Vegetariano:
    "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=500&auto=format",
  Proteico:
    "https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=500&auto=format",
  "Low Carb":
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=500&auto=format",
  Fit: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=500&auto=format",
  Bowls:
    "https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=500&auto=format",
  Sopas:
    "https://images.unsplash.com/photo-1605891094836-99210404c080?q=80&w=500&auto=format",
  "Café da Manhã":
    "https://images.unsplash.com/photo-1533089860892-a7c6f10a081a?q=80&w=500&auto=format",
  default:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format",
};

// Função para obter uma imagem padrão com base na categoria
const getDefaultImage = (categoria: string) => {
  return (
    defaultImages[categoria as keyof typeof defaultImages] ||
    defaultImages.default
  );
};

const PratoCard = ({
  id,
  nome,
  descricao,
  preco,
  imagem,
  categoria,
  mediaAvaliacao,
  totalAvaliacoes,
  fornecedor,
}: PratoProps) => {
  // Limitar a descrição a um número máximo de caracteres
  const descricaoResumida =
    descricao.length > 100 ? `${descricao.substring(0, 100)}...` : descricao;

  // Criar link do WhatsApp
  const criarLinkWhatsApp = () => {
    const numero = fornecedor.whatsapp.replace(/\D/g, "");
    const mensagem = encodeURIComponent(
      `Olá, gostaria de encomendar o prato "${nome}"`
    );
    return `https://wa.me/${numero}?text=${mensagem}`;
  };

  // Função para lidar com erro ao carregar imagem
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("Erro ao carregar imagem do prato, usando fallback");
    e.currentTarget.onerror = null; // Evita loop infinito
    e.currentTarget.src = getDefaultImage(categoria); // Usa uma imagem padrão da categoria
  };

  // Função para lidar com erro ao carregar imagem do fornecedor
  const handleFornecedorImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("Erro ao carregar imagem do fornecedor, usando fallback");
    e.currentTarget.onerror = null; // Evita loop infinito
    e.currentTarget.src =
      "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(fornecedor.nome) +
      "&background=2F855A&color=fff"; // Avatar gerado
  };

  // Renderizar as estrelas de avaliação
  const renderEstrelas = () => {
    const estrelas = [];
    const notaArredondada = Math.round(mediaAvaliacao);

    for (let i = 1; i <= 5; i++) {
      if (i <= notaArredondada) {
        estrelas.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        estrelas.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{estrelas}</div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({totalAvaliacoes}{" "}
          {totalAvaliacoes === 1 ? "avaliação" : "avaliações"})
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 dark:shadow-gray-900/30">
      <div className="relative h-52 bg-gray-200 dark:bg-gray-700 overflow-hidden group">
        {imagem ? (
          <img
            src={imagem}
            alt={nome}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <img
            src={getDefaultImage(categoria)}
            alt={nome}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = defaultImages.default;
            }}
          />
        )}
        <div className="absolute top-3 right-3 bg-green-500 dark:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm">
          {categoria}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight leading-tight">
            {nome}
          </h3>
          <span className="font-bold text-green-600 dark:text-green-400 text-lg">
            R$ {preco.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <div className="mb-3">{renderEstrelas()}</div>

        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed mb-4">
          {descricaoResumida}
        </p>

        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center text-sm text-gray-700 dark:text-gray-300 mb-4">
          <div className="flex items-center">
            {fornecedor.logo ? (
              <img
                src={fornecedor.logo}
                alt={fornecedor.nome}
                className="w-7 h-7 rounded-full mr-2 border-2 border-white dark:border-gray-700 shadow-sm"
                onError={handleFornecedorImageError}
              />
            ) : (
              <img
                src={
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(fornecedor.nome.charAt(0)) +
                  "&background=2F855A&color=fff"
                }
                alt={fornecedor.nome}
                className="w-7 h-7 rounded-full mr-2 border-2 border-white dark:border-gray-700 shadow-sm"
              />
            )}
            <span className="font-medium">{fornecedor.nome}</span>
          </div>
        </div>

        <div className="flex justify-between items-center space-x-3">
          <Link
            to={`/pratos/${id}`}
            className="text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors flex items-center group"
          >
            Ver detalhes
            <FaArrowRight className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
          </Link>

          <a
            href={criarLinkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:brightness-110"
          >
            <FaWhatsapp className="mr-2 text-lg animate-pulse" />
            <span>Fazer Pedido</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PratoCard;
