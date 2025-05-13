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
          <img src={imagem} alt={nome} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-100">
            <span className="text-4xl">🍲</span>
          </div>
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
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-green-800">
                  {fornecedor.nome.charAt(0)}
                </span>
              </div>
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
