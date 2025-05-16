import { Link } from "react-router-dom";
import { FaCalendarAlt, FaEye, FaArrowRight } from "react-icons/fa";

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
      className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col ${
        destaque
          ? "bg-gradient-to-br from-green-50 to-white dark:from-green-900/30 dark:to-gray-800 border-2 border-green-200 dark:border-green-800/40"
          : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
      } group`}
    >
      <div className="relative h-52 overflow-hidden">
        {imagem ? (
          <img
            src={imagem}
            alt={titulo}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
          />
        ) : (
          <img
            src={getDefaultImage()}
            alt={titulo}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div
          className={`absolute top-3 left-3 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-md ${
            destaque
              ? "bg-green-500 text-white"
              : "bg-white/90 dark:bg-gray-800/90 text-green-600 dark:text-green-400"
          }`}
        >
          {categoria}
        </div>

        {destaque && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-md">
            Destaque
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 leading-tight">
          {titulo}
        </h3>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-4">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1.5 text-gray-400 dark:text-gray-500" />
            <span>{dataFormatada}</span>
          </div>
          <div className="flex items-center">
            <FaEye className="mr-1.5 text-gray-400 dark:text-gray-500" />
            <span>{visualizacoes}</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-5 flex-1">
          {conteudoResumido}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2">
              <span className="text-green-600 dark:text-green-400 font-bold">
                {autor.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {autor}
            </span>
          </div>

          <Link
            to={`/blog/${slug}`}
            className="text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors flex items-center group"
          >
            Ler mais
            <FaArrowRight className="ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
