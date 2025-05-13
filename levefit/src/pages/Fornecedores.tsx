import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaSearch, FaFilter, FaArrowLeft } from "react-icons/fa";

interface Fornecedor {
  id: number;
  nome: string;
  descricao?: string;
  logo?: string;
  pratos?: Array<Prato>;
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
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
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <FaStar
          key={i}
          className={`inline ${
            i <= avaliacao ? "text-yellow-400" : "text-gray-300"
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Carregando fornecedores...
          </h1>
          <div className="animate-pulse">
            <div className="mb-8">
              <div className="h-10 bg-gray-200 rounded-md w-full md:w-1/2 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 bg-gray-200 rounded-md w-24"
                  ></div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-64"></div>
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
          <h1 className="text-3xl font-bold text-gray-800">Fornecedores</h1>
          <Link
            to="/"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Voltar para página principal
          </Link>
        </div>

        <div className="mb-8">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Buscar fornecedores..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-md flex items-center ${
                !categoriaAtiva
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setCategoriaAtiva(null)}
            >
              <FaFilter className="mr-2" /> Todos
            </button>

            {categoriasFiltro.map((categoria, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md ${
                  categoriaAtiva === categoria
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setCategoriaAtiva(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {fornecedoresFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              Nenhum fornecedor encontrado para os filtros selecionados.
            </p>
            <button
              onClick={() => {
                setCategoriaAtiva(null);
                setBusca("");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fornecedoresFiltrados.map((fornecedor) => {
              // Encontrar principais categorias do fornecedor
              const categoriasPratos: { [key: string]: number } = {};
              fornecedor.pratos?.forEach((prato) => {
                if (categoriasPratos[prato.categoria]) {
                  categoriasPratos[prato.categoria]++;
                } else {
                  categoriasPratos[prato.categoria] = 1;
                }
              });

              // Ordenar por quantidade de pratos e pegar o primeiro
              const categoriaPrincipal =
                Object.keys(categoriasPratos).sort(
                  (a, b) => categoriasPratos[b] - categoriasPratos[a]
                )[0] || "";

              return (
                <div
                  key={fornecedor.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    {fornecedor.logo ? (
                      <img
                        src={fornecedor.logo}
                        alt={fornecedor.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-100">
                        <span className="text-4xl font-bold text-green-600">
                          {fornecedor.nome.charAt(0)}
                        </span>
                      </div>
                    )}
                    {categoriaPrincipal && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {categoriaPrincipal}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {fornecedor.nome}
                    </h3>

                    {fornecedor.avaliacaoMedia !== undefined && (
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {renderEstrelas(
                            Math.round(fornecedor.avaliacaoMedia)
                          )}
                        </div>
                        <span className="text-sm text-gray-600">
                          {fornecedor.avaliacaoMedia.toFixed(1)} (
                          {fornecedor.totalAvaliacoes})
                        </span>
                      </div>
                    )}

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {fornecedor.descricao ||
                        "Fornecedor de alimentos saudáveis."}
                    </p>

                    <div className="text-sm text-gray-500 mb-4">
                      <div>
                        {fornecedor.pratos?.length || 0} pratos disponíveis
                      </div>
                    </div>

                    <Link
                      to={`/fornecedor/${fornecedor.id}`}
                      className="block w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
                    >
                      Ver Pratos
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fornecedores;
