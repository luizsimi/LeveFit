import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaUtensils,
  FaCarrot,
  FaLeaf,
  FaFish,
  FaDrumstickBite,
  FaBreadSlice,
  FaStar,
  FaArrowLeft,
  FaHeart,
} from "react-icons/fa";
import { GiChickenOven, GiCupcake } from "react-icons/gi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string;
  categoria: string;
  disponivel: boolean;
  fornecedor: {
    id: number;
    nome: string;
    whatsapp: string;
    logo?: string;
  };
  mediaAvaliacao: number;
  totalAvaliacoes: number;
}

interface CategoriaIcone {
  icon: React.ReactNode;
  cor: string;
  bgDark: string;
  textDark: string;
}

const Categorias = () => {
  const [categorias, setCategorias] = useState<string[]>([]);
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ícones para categorias
  const categoriasIcones: { [key: string]: CategoriaIcone } = {
    "Refeições Completas": {
      icon: <FaUtensils className="text-3xl" />,
      cor: "bg-red-100 text-red-600",
      bgDark: "dark:bg-red-900/20",
      textDark: "dark:text-red-400",
    },
    Saladas: {
      icon: <FaLeaf className="text-3xl" />,
      cor: "bg-green-100 text-green-600",
      bgDark: "dark:bg-green-900/20",
      textDark: "dark:text-green-400",
    },
    Vegano: {
      icon: <FaCarrot className="text-3xl" />,
      cor: "bg-teal-100 text-teal-600",
      bgDark: "dark:bg-teal-900/20",
      textDark: "dark:text-teal-400",
    },
    Peixes: {
      icon: <FaFish className="text-3xl" />,
      cor: "bg-blue-100 text-blue-600",
      bgDark: "dark:bg-blue-900/20",
      textDark: "dark:text-blue-400",
    },
    Carnes: {
      icon: <FaDrumstickBite className="text-3xl" />,
      cor: "bg-yellow-100 text-yellow-600",
      bgDark: "dark:bg-yellow-900/20",
      textDark: "dark:text-yellow-400",
    },
    Aves: {
      icon: <GiChickenOven className="text-3xl" />,
      cor: "bg-orange-100 text-orange-600",
      bgDark: "dark:bg-orange-900/20",
      textDark: "dark:text-orange-400",
    },
    "Fit Doces": {
      icon: <GiCupcake className="text-3xl" />,
      cor: "bg-pink-100 text-pink-600",
      bgDark: "dark:bg-pink-900/20",
      textDark: "dark:text-pink-400",
    },
    "Pães e Massas": {
      icon: <FaBreadSlice className="text-3xl" />,
      cor: "bg-amber-100 text-amber-600",
      bgDark: "dark:bg-amber-900/20",
      textDark: "dark:text-amber-400",
    },
  };

  // Buscar categorias e pratos
  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar categorias disponíveis
        const categoriasResponse = await axios.get(
          "http://localhost:3333/pratos/categorias"
        );
        setCategorias(categoriasResponse.data);

        // Buscar todos os pratos
        const pratosResponse = await axios.get("http://localhost:3333/pratos");
        setPratos(pratosResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(
          "Ocorreu um erro ao carregar as categorias. Tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    buscarCategorias();
  }, []);

  // Filtrar pratos pela categoria selecionada
  const pratosFiltrados = categoriaAtiva
    ? pratos.filter((prato) => prato.categoria === categoriaAtiva)
    : [];

  // Renderizar estrelas de avaliação
  const renderEstrelas = (avaliacao: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={
              i < Math.round(avaliacao)
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }
            size={14}
          />
        ))}
      </div>
    );
  };

  // Formatar preço
  const formatarPreco = (preco: number) => {
    return preco.toFixed(2).replace(".", ",");
  };

  const handleCategoriaClick = (categoria: string) => {
    setCategoriaAtiva(categoria);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
            Carregando categorias...
          </h1>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"
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
              Nossas Categorias
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
              Descubra nossa variedade de categorias de pratos saudáveis,
              preparados com ingredientes frescos e nutritivos para todos os
              gostos e necessidades.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5 self-start md:self-auto"
          >
            <FaArrowLeft className="mr-2" /> Voltar para início
          </Link>
        </div>

        {!categoriaAtiva ? (
          // Exibir todas as categorias
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categorias.map((categoria, index) => {
              const iconeInfo = categoriasIcones[categoria] || {
                icon: <FaUtensils className="text-3xl" />,
                cor: "bg-gray-100 text-gray-600",
                bgDark: "dark:bg-gray-800",
                textDark: "dark:text-gray-400",
              };

              const pratosNaCategoria = pratos.filter(
                (prato) => prato.categoria === categoria
              ).length;

              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg dark:shadow-gray-900/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleCategoriaClick(categoria)}
                >
                  <div
                    className={`p-8 flex flex-col items-center ${iconeInfo.cor} ${iconeInfo.bgDark} ${iconeInfo.textDark}`}
                  >
                    {iconeInfo.icon}
                    <h3 className="text-xl font-bold mt-4">{categoria}</h3>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800">
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      {pratosNaCategoria}{" "}
                      {pratosNaCategoria === 1
                        ? "prato disponível"
                        : "pratos disponíveis"}
                    </p>
                    <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                      Explorar Pratos
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Exibir pratos da categoria selecionada
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  <span>{categoriaAtiva}</span>
                  <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-medium rounded-full">
                    {pratosFiltrados.length}{" "}
                    {pratosFiltrados.length === 1 ? "prato" : "pratos"}
                  </span>
                </h2>
              </div>
              <button
                onClick={() => setCategoriaAtiva(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Voltar para categorias
              </button>
            </div>

            {pratosFiltrados.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <FaUtensils className="text-5xl mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Nenhum prato encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Não encontramos pratos disponíveis nesta categoria no momento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pratosFiltrados.map((prato, index) => (
                  <div
                    key={prato.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg dark:shadow-gray-900/30 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {prato.imagem ? (
                        <img
                          src={prato.imagem}
                          alt={prato.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700">
                          <FaUtensils className="text-gray-400 dark:text-gray-500 text-4xl" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        {prato.categoria}
                      </div>
                      <button
                        className="absolute top-3 left-3 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-red-500 hover:bg-white hover:text-red-600 transition-colors"
                        title="Adicionar aos favoritos"
                      >
                        <FaHeart />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          {prato.nome}
                        </h3>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          R$ {formatarPreco(prato.preco)}
                        </span>
                      </div>

                      <div className="mb-2 flex items-center">
                        {renderEstrelas(prato.mediaAvaliacao)}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({prato.totalAvaliacoes})
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                        {prato.descricao}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
                        {prato.fornecedor.logo ? (
                          <img
                            src={prato.fornecedor.logo}
                            alt={prato.fornecedor.nome}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                        ) : null}
                        <span>{prato.fornecedor.nome}</span>
                      </div>

                      <Link
                        to={`/pratos/${prato.id}`}
                        className="w-full block text-center py-2 font-medium bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Categorias;
