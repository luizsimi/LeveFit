import { Link } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaWhatsapp,
  FaArrowRight,
  FaFire,
} from "react-icons/fa";
import { BiDumbbell } from "react-icons/bi";
import { IoNutrition } from "react-icons/io5";
import { GiSlicedBread } from "react-icons/gi";

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
  calorias?: number;
  proteinas?: number;
  carboidratos?: number;
  gorduras?: number;
  fibras?: number;
  porcao?: string;
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
  calorias,
  proteinas,
  carboidratos,
  gorduras,
  porcao,
}: PratoProps) => {
  // Limitar a descrição a um número máximo de caracteres
  const descricaoResumida =
    descricao.length > 80 ? `${descricao.substring(0, 80)}...` : descricao;

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
        estrelas.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else {
        estrelas.push(
          <FaRegStar key={i} className="text-yellow-400 text-xs" />
        );
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{estrelas}</div>
        <span className="text-[10px] text-gray-600 dark:text-gray-400">
          ({totalAvaliacoes}{" "}
          {totalAvaliacoes === 1 ? "avaliação" : "avaliações"})
        </span>
      </div>
    );
  };

  // Renderizar informações nutricionais se disponíveis
  const renderInformacoesNutricionais = () => {
    // Se não houver nenhuma informação nutricional, não renderizar a seção
    if (!calorias && !proteinas && !carboidratos && !gorduras) {
      return null;
    }

    return (
      <div className="mt-2 mb-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
            Informações Nutricionais {porcao && `(${porcao})`}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {calorias && (
            <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded p-0.5">
              <div className="flex items-center">
                <FaFire className="text-orange-500 mr-0.5 text-[8px]" />
                <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-300">
                  {calorias}
                </span>
              </div>
              <span className="text-[8px] text-gray-500 dark:text-gray-400">
                kcal
              </span>
            </div>
          )}

          {proteinas && (
            <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded p-0.5">
              <div className="flex items-center">
                <BiDumbbell className="text-blue-500 mr-0.5 text-[8px]" />
                <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-300">
                  {proteinas}g
                </span>
              </div>
              <span className="text-[8px] text-gray-500 dark:text-gray-400">
                prot
              </span>
            </div>
          )}

          {carboidratos && (
            <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded p-0.5">
              <div className="flex items-center">
                <GiSlicedBread className="text-yellow-500 mr-0.5 text-[8px]" />
                <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-300">
                  {carboidratos}g
                </span>
              </div>
              <span className="text-[8px] text-gray-500 dark:text-gray-400">
                carbs
              </span>
            </div>
          )}

          {gorduras && (
            <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded p-0.5">
              <div className="flex items-center">
                <IoNutrition className="text-purple-500 mr-0.5 text-[8px]" />
                <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-300">
                  {gorduras}g
                </span>
              </div>
              <span className="text-[8px] text-gray-500 dark:text-gray-400">
                gord
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 group">
      <div className="relative h-44 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {imagem ? (
          <img
            src={imagem}
            alt={nome}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
          />
        ) : (
          <img
            src={getDefaultImage(categoria)}
            alt={nome}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = defaultImages.default;
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold tracking-wide shadow-md">
          {categoria}
        </div>
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="font-bold text-white text-lg shadow-sm">
            R$ {preco.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight leading-tight">
            {nome}
          </h3>
          <span className="font-bold text-green-600 dark:text-green-400 text-base">
            R$ {preco.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <div className="mb-2">{renderEstrelas()}</div>

        <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs">
          {descricaoResumida}
        </p>

        {renderInformacoesNutricionais()}

        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden mr-2 flex-shrink-0">
              {fornecedor.logo ? (
                <img
                  src={fornecedor.logo}
                  alt={fornecedor.nome}
                  className="w-full h-full object-cover"
                  onError={handleFornecedorImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-600 text-white font-bold text-xs">
                  {fornecedor.nome.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {fornecedor.nome}
            </span>
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/pratos/${id}`}
              className="flex-1 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 border border-green-500 dark:border-green-500 font-medium text-xs py-2 rounded-lg text-center hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300 flex items-center justify-center"
            >
              Detalhes <FaArrowRight className="ml-1 text-xs" />
            </Link>
            <a
              href={criarLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium text-xs py-2 rounded-lg text-center transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              Pedir <FaWhatsapp className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PratoCard;
