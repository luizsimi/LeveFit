import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import FornecedorCarousel from "../components/FornecedorCarousel";
import CategoriaFilter from "../components/CategoriaFilter";
import PratoCard from "../components/PratoCard";

interface Prato {
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

const Home = () => {
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [categoriaFiltrada, setCategoriaFiltrada] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPratos = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:3333/pratos";

        if (categoriaFiltrada) {
          url += `?categoria=${categoriaFiltrada}`;
        }

        const response = await axios.get(url);
        setPratos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar pratos:", error);
        setError("Erro ao carregar os pratos.");
        setLoading(false);
      }
    };

    fetchPratos();
  }, [categoriaFiltrada]);

  const handleCategoriaChange = (categoria: string | null) => {
    setCategoriaFiltrada(categoria);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Banner Hero */}
        <div className="bg-green-600 text-white rounded-lg p-8 mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">
              LeveFit - Comida Saudável
            </h1>
            <p className="text-xl mb-6 max-w-2xl">
              Conectamos você a fornecedores de pratos saudáveis e deliciosos.
              Peça pelo WhatsApp e receba em casa!
            </p>
            <button className="bg-white text-green-600 px-6 py-3 rounded-md font-semibold hover:bg-green-50 transition-colors">
              Explorar Cardápios
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20">
            <span className="text-9xl">🥗</span>
          </div>
        </div>

        {/* Carrossel de Fornecedores */}
        <FornecedorCarousel />

        {/* Seção de Pratos */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Pratos Disponíveis
            </h2>
          </div>

          {/* Filtro por Categoria */}
          <CategoriaFilter
            onSelectCategoria={handleCategoriaChange}
            categoriaAtual={categoriaFiltrada}
          />

          {/* Lista de Pratos */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-lg h-80 animate-pulse"
                ></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : pratos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {categoriaFiltrada
                  ? `Não encontramos pratos na categoria "${categoriaFiltrada}".`
                  : "Não há pratos disponíveis no momento."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pratos.map((prato) => (
                <PratoCard key={prato.id} {...prato} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Sobre o LeveFit</h3>
              <p className="text-gray-300">
                Conectamos amantes de comida saudável a fornecedores locais
                especializados.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-300 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/categorias"
                    className="text-gray-300 hover:text-white"
                  >
                    Categorias
                  </a>
                </li>
                <li>
                  <a
                    href="/fornecedores"
                    className="text-gray-300 hover:text-white"
                  >
                    Fornecedores
                  </a>
                </li>
                <li>
                  <a href="/contato" className="text-gray-300 hover:text-white">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contato</h3>
              <p className="text-gray-300">
                contato@levefit.com.br
                <br />
                (99) 99999-9999
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>
              &copy; {new Date().getFullYear()} LeveFit. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
