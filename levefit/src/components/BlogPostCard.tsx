import { Link } from "react-router-dom";
import { FaCalendarAlt, FaEye, FaArrowRight, FaTags } from "react-icons/fa";

interface BlogPostCardProps {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string;
  categoria: string;
  slug: string;
  autor: string;
  visualizacoes: number;
  createdAt: string;
  destaque?: boolean;
}

const BlogPostCard = ({
  titulo,
  conteudo,
  imagem,
  categoria,
  slug,
  autor,
  visualizacoes,
  createdAt,
  destaque = false,
}: BlogPostCardProps) => {
  // Limitar o conteúdo a um número máximo de caracteres
  const conteudoResumido =
    conteudo.length > 120 ? `${conteudo.substring(0, 120)}...` : conteudo;

  // Formatar a data
  const dataFormatada = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Lidar com erro ao carregar imagem
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.onerror = null; // Evita loop infinito
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80"; // Imagem padrão
  };

  // Imagens padrão para categorias específicas
  const getDefaultImage = () => {
    const images: Record<string, string> = {
      Nutrição:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80",
      Receitas:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&q=80",
      Treinos:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80",
      "Bem-estar":
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&q=80",
      default:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    };

    return images[categoria] || images.default;
  };

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col ${
        destaque
          ? "bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 border border-green-100 dark:border-green-800/30"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        {imagem ? (
          <img
            src={imagem}
            alt={titulo}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <img
            src={getDefaultImage()}
            alt={titulo}
            className="w-full h-full object-cover"
          />
        )}

        <div
          className={`absolute top-3 left-3 rounded-lg px-3 py-1 text-xs font-medium ${
            destaque
              ? "bg-green-500 text-white"
              : "bg-white/90 dark:bg-gray-800/90 text-green-600 dark:text-green-400"
          }`}
        >
          {categoria}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {titulo}
        </h3>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1.5 text-gray-400 dark:text-gray-500" />
            <span>{dataFormatada}</span>
          </div>
          <div className="flex items-center">
            <FaEye className="mr-1.5 text-gray-400 dark:text-gray-500" />
            <span>{visualizacoes}</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">
          {conteudoResumido}
        </p>

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Por: {autor}
          </span>

          <Link
            to={`/blog/${slug}`}
            className="text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors flex items-center group"
          >
            Ler mais
            <FaArrowRight className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
