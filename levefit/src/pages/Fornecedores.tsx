import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaStar,
  FaSearch,
  FaFilter,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaUtensils,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Fornecedor {
  id: number;
  nome: string;
  descricao?: string;
  logo?: string;
  pratos?: Array<Prato>;
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
  endereco?: string;
  whatsapp?: string;
}

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string;
  categoria: string;
  disponivel: boolean;
  avaliacoes: Array<Avaliacao>;
}

interface Avaliacao {
  id: number;
  nota: number;
  comentario: string;
  cliente: {
    id: number;
    nome: string;
  };
}

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar fornecedores ativos
        const fornecedoresResponse = await axios.get(
          "http://localhost:3333/fornecedores/ativos"
        );
        const fornecedoresData = fornecedoresResponse.data;

        // Buscar todos os pratos para associar aos fornecedores
        const pratosResponse = await axios.get("http://localhost:3333/pratos");
        const pratosData = pratosResponse.data;

        // Buscar categorias disponíveis
        const categoriasResponse = await axios.get(
          "http://localhost:3333/pratos/categorias"
        );
        setCategoriasFiltro(categoriasResponse.data);

        // Associar pratos aos fornecedores e calcular média de avaliações
        const fornecedoresComPratos = fornecedoresData.map(
          (fornecedor: Fornecedor) => {
            const pratosFornecedor = pratosData.filter(
              (prato: Prato & { fornecedor: { id: number } }) =>
                prato.fornecedor.id === fornecedor.id
            );

            // Calcular média de avaliações global do fornecedor
            let totalNotas = 0;
            let totalAvaliacoes = 0;

            pratosFornecedor.forEach((prato: Prato) => {
              if (prato.avaliacoes && prato.avaliacoes.length > 0) {
                totalNotas += prato.avaliacoes.reduce(
                  (acc: number, av: Avaliacao) => acc + av.nota,
                  0
                );
                totalAvaliacoes += prato.avaliacoes.length;
              }
            });

            const avaliacaoMedia =
              totalAvaliacoes > 0 ? totalNotas / totalAvaliacoes : 0;

            return {
              ...fornecedor,
              pratos: pratosFornecedor,
              avaliacaoMedia,
              totalAvaliacoes,
            };
          }
        );

        setFornecedores(fornecedoresComPratos);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(
          "Ocorreu um erro ao carregar os fornecedores. Tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    buscarDados();
  }, []);

  // Função para renderizar as estrelas de avaliação
  const renderEstrelas = (avaliacao: number) => {
    const estrelas = [];
    const notaArredondada = Math.round(avaliacao);

    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <FaStar
          key={i}
          className={`${
            i <= notaArredondada
              ? "text-yellow-400 text-xs"
              : "text-gray-300 dark:text-gray-600 text-xs"
          }`}
        />
      );
    }
    return estrelas;
  };

  // Filtrar fornecedores pela categoria e pela busca
  const fornecedoresFiltrados = fornecedores.filter((fornecedor) => {
    // Filtro por categoria
    if (categoriaAtiva) {
      const temPratoCategoria = fornecedor.pratos?.some(
        (prato) => prato.categoria === categoriaAtiva
      );
      if (!temPratoCategoria) return false;
    }

    // Filtro pela busca
    if (busca.trim() !== "") {
      const buscaLower = busca.toLowerCase();
      return (
        fornecedor.nome.toLowerCase().includes(buscaLower) ||
        (fornecedor.descricao &&
          fornecedor.descricao.toLowerCase().includes(buscaLower)) ||
        fornecedor.pratos?.some(
          (prato) =>
            prato.nome.toLowerCase().includes(buscaLower) ||
            prato.descricao.toLowerCase().includes(buscaLower)
        )
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
            Carregando fornecedores...
          </h1>
          <div className="animate-pulse">
            <div className="mb-8">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full md:w-1/2 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"
                  ></div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64"
                ></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            Tentar novamente
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Nossos Fornecedores
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
              Conheça os melhores fornecedores de comida saudável parceiros do
              LeveFit, todos comprometidos com qualidade e sabor em cada
              refeição.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5 self-start md:self-auto"
          >
            <FaArrowLeft className="mr-2" /> Voltar para início
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Busque por nome do fornecedor, prato ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              className={`px-4 py-2 rounded-lg flex items-center transition-colors duration-300 ${
                !categoriaAtiva
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
              onClick={() => setCategoriaAtiva(null)}
            >
              <FaFilter className="mr-2" /> Todos os fornecedores
            </button>

            {categoriasFiltro.map((categoria, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  categoriaAtiva === categoria
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
                onClick={() => setCategoriaAtiva(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            {fornecedoresFiltrados.length === 0
              ? "Nenhum fornecedor encontrado"
              : `Mostrando ${fornecedoresFiltrados.length} ${
                  fornecedoresFiltrados.length === 1
                    ? "fornecedor"
                    : "fornecedores"
                }`}
          </p>
        </div>

        {fornecedoresFiltrados.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-md text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <FaSearch className="mx-auto text-5xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Nenhum fornecedor encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {categoriaAtiva
                ? `Não encontramos fornecedores com pratos na categoria "${categoriaAtiva}".`
                : "Não encontramos fornecedores que correspondam à sua busca."}
            </p>
            <button
              onClick={() => {
                setBusca("");
                setCategoriaAtiva(null);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fornecedoresFiltrados.map((fornecedor, index) => (
              <div
                key={fornecedor.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col items-center text-center mb-4">
                  {fornecedor.logo ? (
                    <img
                      src={fornecedor.logo}
                      alt={fornecedor.nome}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg mb-4"
                      onError={(e) => {
                        // Fallback para avatar com inicial se a imagem falhar
                        e.currentTarget.onerror = null;
                        const nome = fornecedor.nome;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          nome
                        )}&background=2F855A&color=fff&size=200`;
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                      {fornecedor.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    {fornecedor.nome}
                  </h3>
                  {fornecedor.descricao && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-md mx-auto">
                      {fornecedor.descricao}
                    </p>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start space-x-1 text-gray-600 dark:text-gray-400 text-xs mb-2">
                    <FaMapMarkerAlt className="mt-0.5 flex-shrink-0 text-green-500 dark:text-green-400 text-xs" />
                    <span className="ml-1">
                      {fornecedor.endereco || "Várias localidades"}
                    </span>
                  </div>

                  <div className="mt-2 mb-3">
                    <div className="flex items-center">
                      <div className="flex mr-1">
                        {renderEstrelas(fornecedor.avaliacaoMedia || 0)}
                      </div>
                      <span className="text-[10px] text-gray-600 dark:text-gray-400">
                        ({fornecedor.totalAvaliacoes || 0}{" "}
                        {fornecedor.totalAvaliacoes === 1
                          ? "avaliação"
                          : "avaliações"}
                        )
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
                    {fornecedor.pratos && fornecedor.pratos.length > 0 && (
                      <div className="mb-3">
                        <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Especialidades:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {fornecedor.pratos.slice(0, 3).map((prato, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center text-[10px] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded"
                            >
                              <FaUtensils className="mr-1 text-[8px]" />
                              {prato.nome.length > 15
                                ? prato.nome.substring(0, 15) + "..."
                                : prato.nome}
                            </span>
                          ))}
                          {fornecedor.pratos.length > 3 && (
                            <span className="inline-flex text-[10px] text-gray-500 dark:text-gray-400">
                              +{fornecedor.pratos.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Link
                        to={`/fornecedores/${fornecedor.id}`}
                        className="flex-1 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 border border-green-500 dark:border-green-500 font-medium text-xs py-2 rounded-lg text-center hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300 flex items-center justify-center"
                      >
                        Ver produtos
                      </Link>
                      {fornecedor.whatsapp && (
                        <a
                          href={`https://wa.me/${fornecedor.whatsapp.replace(
                            /\D/g,
                            ""
                          )}?text=Olá, vim pelo LeveFit e gostaria de saber sobre seus produtos.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium text-xs py-2 rounded-lg text-center transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          <FaWhatsapp className="mr-1" />
                          Contato
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Fornecedores;
