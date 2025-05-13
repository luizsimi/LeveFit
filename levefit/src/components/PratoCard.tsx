import { Link } from "react-router-dom";
import { FaStar, FaRegStar, FaWhatsapp } from "react-icons/fa";

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
        <span className="text-sm text-gray-600">
          ({totalAvaliacoes}{" "}
          {totalAvaliacoes === 1 ? "avaliação" : "avaliações"})
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {imagem ? (
          <img
            src={imagem}
            alt={nome}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <img
            src={getDefaultImage(categoria)}
            alt={nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = defaultImages.default;
            }}
          />
        )}
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {categoria}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{nome}</h3>
          <span className="font-bold text-green-600">
            R$ {preco.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {renderEstrelas()}

        <p className="text-gray-600 mt-2 text-sm">{descricaoResumida}</p>

        <div className="mt-3 flex items-center text-sm text-gray-700">
          <div className="flex items-center">
            {fornecedor.logo ? (
              <img
                src={fornecedor.logo}
                alt={fornecedor.nome}
                className="w-6 h-6 rounded-full mr-2"
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
                className="w-6 h-6 rounded-full mr-2"
              />
            )}
            <span>{fornecedor.nome}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <Link
            to={`/pratos/${id}`}
            className="text-green-600 font-medium hover:text-green-700"
          >
            Ver detalhes
          </Link>

          <a
            href={criarLinkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
          >
            <FaWhatsapp className="mr-1" /> Pedir
          </a>
        </div>
      </div>
    </div>
  );
};

export default PratoCard;
