import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FornecedorCarousel from "../components/FornecedorCarousel";
import CategoriaFilter from "../components/CategoriaFilter";
import PratoCard from "../components/PratoCard";
import {
  FaUtensils,
  FaWhatsapp,
  FaCheck,
  FaMapMarkedAlt,
  FaArrowRight,
  FaSeedling,
  FaLeaf,
  FaHeartbeat,
  FaSmile,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Banner Hero - Versão Simplificada com Imagem */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="md:flex">
            {/* Conteúdo textual */}
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                  <FaSeedling className="text-green-600 text-lg" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">LeveFit</h1>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold mb-4">
                Comida Saudável para o seu dia a dia
              </h2>

              <p className="text-base md:text-lg mb-6 text-green-50">
                Conectamos você a fornecedores de pratos saudáveis e deliciosos.
                <span className="flex items-center mt-2">
                  <FaCheck className="mr-2" />
                  Peça pelo WhatsApp e receba em casa!
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  to="/categorias"
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  Explorar Cardápios
                  <FaArrowRight className="ml-2 text-sm" />
                </Link>

                <a
                  href="#como-funciona"
                  className="bg-blue-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center justify-center"
                >
                  Como Funciona
                </a>
              </div>
            </div>

            {/* Imagem */}
            <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3"
                alt="Refeição saudável com proteínas, legumes e vegetais"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-700/50 to-transparent"></div>
            </div>
          </div>

          {/* Banner promocional animado (substituindo as estatísticas) */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 border-t border-white/10 py-3 px-6 overflow-hidden relative">
            <div className="absolute -left-10 top-0 bottom-0 w-20 bg-white/10 transform -skew-x-12 animate-pulse"></div>
            <div className="absolute -right-10 top-0 bottom-0 w-20 bg-white/10 transform skew-x-12 animate-pulse"></div>

            <div className="whitespace-nowrap overflow-hidden">
              <div className="inline-flex items-center gap-4 md:gap-8 animate-marquee">
                <div className="flex items-center hover:bg-white/10 py-1 px-2 rounded-lg transition-colors duration-300 cursor-default">
                  <FaLeaf className="text-white/80 mr-2" />
                  <span className="text-white font-medium">
                    Comida Saudável
                  </span>
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center hover:bg-white/10 py-1 px-2 rounded-lg transition-colors duration-300 cursor-default">
                  <FaHeartbeat className="text-white/80 mr-2" />
                  <span className="text-white font-medium">Vida Leve</span>
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center hover:bg-white/10 py-1 px-2 rounded-lg transition-colors duration-300 cursor-default">
                  <FaSeedling className="text-white/80 mr-2" />
                  <span className="text-white font-medium">
                    Ingredientes Selecionados
                  </span>
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center hover:bg-white/10 py-1 px-2 rounded-lg transition-colors duration-300 cursor-default">
                  <FaSmile className="text-white/80 mr-2" />
                  <span className="text-white font-medium">
                    Bem-estar Garantido
                  </span>
                </div>
                {/* Duplicar para efeito contínuo */}
                <div className="flex items-center hover:bg-white/10 py-1 px-2 rounded-lg transition-colors duration-300 cursor-default">
                  <FaLeaf className="text-white/80 mr-2" />
                  <span className="text-white font-medium">
                    Comida Saudável
                  </span>
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center hover:bg-white/10 py-1 px-2 rounded-lg transition-colors duration-300 cursor-default">
                  <FaHeartbeat className="text-white/80 mr-2" />
                  <span className="text-white font-medium">Vida Leve</span>
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center hover:bg-white/10 py-1 px-2 rounded-lg transition-colors duration-300 cursor-default">
                  <FaSeedling className="text-white/80 mr-2" />
                  <span className="text-white font-medium">
                    Ingredientes Selecionados
                  </span>
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center hover:bg-white/10 py-1 px-2 rounded-lg transition-colors duration-300 cursor-default">
                  <FaSmile className="text-white/80 mr-2" />
                  <span className="text-white font-medium">
                    Bem-estar Garantido
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carrossel de Fornecedores */}
        <FornecedorCarousel />

        {/* Passo a Passo - Como Fazer Seu Pedido */}
        <section className="mt-16 mb-16" id="como-funciona">
          <div className="flex flex-col mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white inline-flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-300">
                Como Fazer Seu Pedido
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Siga estes passos simples para solicitar sua refeição saudável e
              deliciosa
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Passo 1 */}
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full opacity-70"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border-t-4 border-green-500">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full flex items-center justify-center mb-4 text-white">
                      <FaUtensils className="text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
                        1
                      </span>
                      Escolha seu prato
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Navegue pelo nosso cardápio premium e selecione os pratos
                      que deseja experimentar. Você pode filtrar por categorias
                      para encontrar exatamente o que procura.
                    </p>
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="relative mt-8 md:mt-4">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full opacity-70"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border-t-4 border-green-500">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full flex items-center justify-center mb-4 text-white">
                      <FaWhatsapp className="text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
                        2
                      </span>
                      Peça pelo WhatsApp
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Com apenas um clique no botão "Fazer Pedido", você será
                      direcionado para o WhatsApp do fornecedor com uma mensagem
                      personalizada já pronta para envio.
                    </p>
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="relative mt-8 md:mt-8">
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full opacity-70"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border-t-4 border-green-500">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full flex items-center justify-center mb-4 text-white">
                      <FaMapMarkedAlt className="text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
                        3
                      </span>
                      Receba sem sair de casa
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Finalize seu pedido com o fornecedor via WhatsApp,
                      combinando a forma de pagamento e entrega. Logo sua
                      refeição chegará fresquinha e pronta para ser saboreada!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-10 mb-2">
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 max-w-2xl border border-green-100 dark:border-green-900/20">
                  <div className="flex">
                    <div className="mr-4 text-green-500 dark:text-green-400">
                      <FaCheck className="text-xl" />
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        <span className="font-bold">Importante:</span> Todos os
                        fornecedores são verificados e seus alimentos seguem os
                        mais altos padrões de qualidade. Bom apetite!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Pratos */}
        <section className="mt-16">
          <div className="flex flex-col mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white inline-flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-300">
                Cardápio Premium
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Descubra uma seleção de pratos saudáveis preparados com
              ingredientes frescos e de qualidade.
            </p>
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
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl h-80 animate-pulse shadow-sm"
                ></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg shadow-sm">
              {error}
            </div>
          ) : pratos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {categoriaFiltrada
                  ? `Não encontramos pratos na categoria "${categoriaFiltrada}".`
                  : "Não há pratos disponíveis no momento."}
              </p>
              <button
                onClick={() => setCategoriaFiltrada(null)}
                className="mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
              >
                {categoriaFiltrada ? "Limpar filtro" : "Atualizar página"}
              </button>
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

      <Footer />
    </div>
  );
};

export default Home;
