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
} from "react-icons/fa";
import { GiChickenOven, GiCupcake } from "react-icons/gi";

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
    },
    Saladas: {
      icon: <FaLeaf className="text-3xl" />,
      cor: "bg-green-100 text-green-600",
    },
    Vegano: {
      icon: <FaCarrot className="text-3xl" />,
      cor: "bg-teal-100 text-teal-600",
    },
    Peixes: {
      icon: <FaFish className="text-3xl" />,
      cor: "bg-blue-100 text-blue-600",
    },
    Carnes: {
      icon: <FaDrumstickBite className="text-3xl" />,
      cor: "bg-yellow-100 text-yellow-600",
    },
    Aves: {
      icon: <GiChickenOven className="text-3xl" />,
      cor: "bg-orange-100 text-orange-600",
    },
    "Fit Doces": {
      icon: <GiCupcake className="text-3xl" />,
      cor: "bg-pink-100 text-pink-600",
    },
    "Pães e Massas": {
      icon: <FaBreadSlice className="text-3xl" />,
      cor: "bg-amber-100 text-amber-600",
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
              i < Math.round(avaliacao) ? "text-yellow-400" : "text-gray-300"
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Carregando categorias...
          </h1>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Categorias</h1>
          <Link
            to="/"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Voltar para página principal
          </Link>
        </div>

        <p className="text-gray-600 mb-8">
          Navegue por nossas diversas categorias de pratos saudáveis, preparados
          com ingredientes frescos e nutritivos para atender a todos os gostos e
          necessidades.
        </p>

        {!categoriaAtiva ? (
          // Exibir todas as categorias
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categorias.map((categoria, index) => {
              const iconeInfo = categoriasIcones[categoria] || {
                icon: <FaUtensils className="text-3xl" />,
                cor: "bg-gray-100 text-gray-600",
              };

              const pratosNaCategoria = pratos.filter(
                (prato) => prato.categoria === categoria
              ).length;

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCategoriaClick(categoria)}
                >
                  <div
                    className={`p-6 flex flex-col items-center ${iconeInfo.cor}`}
                  >
                    {iconeInfo.icon}
                    <h3 className="text-xl font-semibold mt-4">{categoria}</h3>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-gray-600 text-sm text-center">
                      {pratosNaCategoria}{" "}
                      {pratosNaCategoria === 1
                        ? "prato disponível"
                        : "pratos disponíveis"}
                    </p>
                    <button className="w-full mt-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                      Ver Pratos
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Exibir pratos da categoria selecionada
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {categoriaAtiva}
              </h2>
              <button
                onClick={() => setCategoriaAtiva(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Voltar para categorias
              </button>
            </div>

            {pratosFiltrados.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">
                  Não há pratos disponíveis nesta categoria no momento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pratosFiltrados.map((prato) => (
                  <div
                    key={prato.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      {prato.imagem ? (
                        <img
                          src={prato.imagem}
                          alt={prato.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-4xl">🍲</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">
                            R$ {formatarPreco(prato.preco)}
                          </span>
                          <div className="flex items-center space-x-1">
                            {renderEstrelas(prato.mediaAvaliacao)}
                            <span className="text-xs ml-1">
                              ({prato.totalAvaliacoes})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {prato.nome}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {prato.descricao}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <img
                          src={
                            prato.fornecedor.logo ||
                            "https://via.placeholder.com/30"
                          }
                          alt={prato.fornecedor.nome}
                          className="w-6 h-6 rounded-full mr-2 object-cover"
                        />
                        <span>{prato.fornecedor.nome}</span>
                      </div>

                      <Link
                        to={`/pratos/${prato.id}`}
                        className="block w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
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
    </div>
  );
};

export default Categorias;
