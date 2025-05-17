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
  FaWhatsapp,
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
    const notaArredondada = Math.round(avaliacao);
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={
              i < notaArredondada
                ? "text-yellow-400 text-xs"
                : "text-gray-300 dark:text-gray-600 text-xs"
            }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleCategoriaClick(categoria)}
                >
                  <div
                    className={`p-6 flex flex-col items-center justify-center h-44 relative overflow-hidden ${iconeInfo.cor} ${iconeInfo.bgDark} ${iconeInfo.textDark}`}
                  >
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 opacity-50"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/5 opacity-50"></div>

                    <div className="relative z-10 transform transition-transform duration-300 group-hover:scale-110">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 shadow-md mb-3">
                        {iconeInfo.icon}
                      </div>
                      <h3 className="text-xl font-bold mt-1 text-center">
                        {categoria}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-gray-600 dark:text-gray-400 font-medium flex items-center text-xs">
                        <FaUtensils className="mr-1 text-green-500 dark:text-green-400 text-xs" />
                        <span>
                          {pratosNaCategoria}{" "}
                          {pratosNaCategoria === 1
                            ? "prato disponível"
                            : "pratos disponíveis"}
                        </span>
                      </p>
                    </div>

                    <button className="w-full py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform font-medium flex items-center justify-center text-xs">
                      Explorar Pratos
                      <FaArrowLeft className="ml-1 transform rotate-180 text-xs" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pratosFiltrados.map((prato, index) => (
                  <div
                    key={prato.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative h-44 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {prato.imagem ? (
                        <img
                          src={prato.imagem}
                          alt={prato.nome}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 transition-transform duration-700 group-hover:scale-110">
                          <FaUtensils className="text-gray-400 dark:text-gray-500 text-3xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 right-2 bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold tracking-wide shadow-md">
                        {prato.categoria}
                      </div>
                      <button
                        className="absolute top-2 left-2 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-red-500 hover:bg-white hover:text-red-600 transition-colors shadow-md text-xs"
                        title="Adicionar aos favoritos"
                      >
                        <FaHeart />
                      </button>
                      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="font-bold text-white text-lg shadow-sm">
                          R$ {formatarPreco(prato.preco)}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight leading-tight">
                          {prato.nome}
                        </h3>
                        <span className="font-bold text-green-600 dark:text-green-400 text-base">
                          R$ {formatarPreco(prato.preco)}
                        </span>
                      </div>

                      <div className="mb-2 flex items-center">
                        {renderEstrelas(prato.mediaAvaliacao)}
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1">
                          ({prato.totalAvaliacoes})
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs">
                        {prato.descricao.length > 80
                          ? `${prato.descricao.substring(0, 80)}...`
                          : prato.descricao}
                      </p>

                      <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden mr-2 flex-shrink-0">
                            {prato.fornecedor.logo ? (
                              <img
                                src={prato.fornecedor.logo}
                                alt={prato.fornecedor.nome}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-green-600 text-white font-bold text-xs">
                                {prato.fornecedor.nome.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {prato.fornecedor.nome}
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            to={`/pratos/${prato.id}`}
                            className="flex-1 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 border border-green-500 dark:border-green-500 font-medium text-xs py-2 rounded-lg text-center hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300 flex items-center justify-center"
                          >
                            Detalhes{" "}
                            <FaArrowLeft className="ml-1 text-xs transform rotate-180" />
                          </Link>
                          <a
                            href={`https://wa.me/${prato.fornecedor.whatsapp.replace(
                              /\D/g,
                              ""
                            )}?text=${encodeURIComponent(
                              `Olá, gostaria de encomendar o prato "${prato.nome}"`
                            )}`}
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
