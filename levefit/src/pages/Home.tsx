import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FornecedorCarousel from "../components/FornecedorCarousel";
import CategoriaFilter from "../components/CategoriaFilter";
import PratoCard from "../components/PratoCard";
import PromocoesModal from "../components/PromocoesModal";
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
  FaBookMedical,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal: number;
  imagem?: string;
  categoria: string;
  mediaAvaliacao: number;
  totalAvaliacoes: number;
  emPromocao: boolean;
  dataFimPromocao?: string;
  fornecedor: {
    id: number;
    nome: string;
    whatsapp: string;
    logo?: string;
  };
}

const Home = () => {
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [pratosPromocao, setPratosPromocao] = useState<Prato[]>([]);
  const [categoriaFiltrada, setCategoriaFiltrada] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadingPromocoes, setLoadingPromocoes] = useState(true);
  const [error, setError] = useState("");
  const [errorPromocoes, setErrorPromocoes] = useState("");
  const [isPromocoesModalOpen, setIsPromocoesModalOpen] = useState(false);
  const [currentPromoPage, setCurrentPromoPage] = useState(0);
  const promocoesPerPage = 3; // Número de promoções visíveis por página
  const promocoesContainerRef = useRef<HTMLDivElement>(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const autoPlayInterval = useRef<number | null>(null);

  // Refs e estado para efeito de parallax
  const heroImageRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Gerenciar posição do mouse para efeito de parallax
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (heroImageRef.current) {
        const { clientX, clientY } = event;
        const { left, top, width, height } =
          heroImageRef.current.getBoundingClientRect();

        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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

  // Buscar pratos em promoção
  useEffect(() => {
    const fetchPratosPromocao = async () => {
      try {
        setLoadingPromocoes(true);
        const response = await axios.get(
          "http://localhost:3333/pratos/promocoes"
        );
        setPratosPromocao(response.data);
        setLoadingPromocoes(false);
      } catch (error) {
        console.error("Erro ao buscar promoções:", error);
        setErrorPromocoes("Erro ao carregar promoções.");
        setLoadingPromocoes(false);
      }
    };

    fetchPratosPromocao();
  }, []);

  // Gerenciar carrossel automático
  useEffect(() => {
    if (pratosPromocao.length <= promocoesPerPage) return;

    const startAutoPlay = () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);

      autoPlayInterval.current = window.setInterval(() => {
        if (autoPlayEnabled) {
          setCurrentPromoPage(
            (prev) =>
              (prev + 1) % Math.ceil(pratosPromocao.length / promocoesPerPage)
          );
        }
      }, 5000); // Mudar slide a cada 5 segundos
    };

    if (autoPlayEnabled) {
      startAutoPlay();
    }

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
        autoPlayInterval.current = null;
      }
    };
  }, [pratosPromocao, promocoesPerPage, autoPlayEnabled, currentPromoPage]);

  // Reseta o temporizador quando o usuário muda manualmente o slide
  const resetAutoPlayTimer = () => {
    if (autoPlayInterval.current) {
      clearInterval(autoPlayInterval.current);
      autoPlayInterval.current = null;
    }
    // Desativamos temporariamente o autoplay
    setAutoPlayEnabled(false);
    // Reativamos após 10 segundos para permitir que o usuário veja o slide atual
    setTimeout(() => setAutoPlayEnabled(true), 10000);
  };

  const handleCategoriaChange = (categoria: string | null) => {
    setCategoriaFiltrada(categoria);
  };

  // Funções para o carrossel de promoções
  const nextPromoPage = () => {
    if (pratosPromocao.length <= promocoesPerPage) return;

    // Pausar autoplay temporariamente quando usuário interage
    resetAutoPlayTimer();

    setCurrentPromoPage(
      (prev) => (prev + 1) % Math.ceil(pratosPromocao.length / promocoesPerPage)
    );
  };

  const prevPromoPage = () => {
    if (pratosPromocao.length <= promocoesPerPage) return;

    // Pausar autoplay temporariamente quando usuário interage
    resetAutoPlayTimer();

    setCurrentPromoPage((prev) =>
      prev === 0
        ? Math.ceil(pratosPromocao.length / promocoesPerPage) - 1
        : prev - 1
    );
  };

  const goToPromoPage = (pageIndex: number) => {
    // Pausar autoplay temporariamente quando usuário interage
    resetAutoPlayTimer();

    setCurrentPromoPage(pageIndex);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Banner Hero - Versão Simplificada com Imagem */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white rounded-xl shadow-lg overflow-hidden mb-12 animate-fadeIn">
          <div className="md:flex">
            {/* Conteúdo textual */}
            <div
              className="p-8 md:w-1/2 flex flex-col justify-center animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
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
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 shadow-md flex items-center justify-center"
                >
                  Como Funciona
                </a>
              </div>
            </div>

            {/* Imagem */}
            <div
              ref={heroImageRef}
              className="md:w-1/2 h-64 md:h-auto relative overflow-hidden animate-fadeIn"
              style={{ animationDelay: "0.4s" }}
            >
              {/* Container para sombra pulsante */}
              <div className="absolute inset-0 animate-shadow-pulse rounded-xl"></div>

              <img
                src="https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3"
                alt="Refeição saudável com proteínas, legumes e vegetais"
                className="w-full h-full object-cover animate-zoom-inout"
                style={{
                  transform: `scale(1.05) translate(${
                    mousePosition.x * 10
                  }px, ${mousePosition.y * 10}px)`,
                }}
              />

              {/* Elementos decorativos animados */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-700/50 to-transparent"></div>

              {/* Efeito de brilho que se move pela imagem */}
              <div className="absolute inset-0 animate-shine"></div>

              {/* Elementos decorativos flutuantes */}
              <div
                className="absolute top-[10%] left-[15%] w-12 h-12 rounded-full bg-yellow-400/30 backdrop-blur-sm animate-float"
                style={{
                  animationDelay: "0s",
                  transform: `translate(${mousePosition.x * -20}px, ${
                    mousePosition.y * -20
                  }px)`,
                }}
              ></div>
              <div
                className="absolute top-[40%] right-[20%] w-10 h-10 rounded-full bg-green-500/30 backdrop-blur-sm animate-float"
                style={{
                  animationDelay: "2s",
                  transform: `translate(${mousePosition.x * 25}px, ${
                    mousePosition.y * 25
                  }px)`,
                }}
              ></div>
              <div
                className="absolute bottom-[15%] left-[30%] w-8 h-8 rounded-full bg-red-400/30 backdrop-blur-sm animate-float"
                style={{
                  animationDelay: "1s",
                  transform: `translate(${mousePosition.x * -15}px, ${
                    mousePosition.y * 15
                  }px)`,
                }}
              ></div>

              {/* Ícones decorativos */}
              <div
                className="absolute top-[25%] right-[15%] text-white/70 animate-float"
                style={{
                  animationDelay: "1.5s",
                  transform: `translate(${mousePosition.x * 15}px, ${
                    mousePosition.y * -20
                  }px)`,
                }}
              >
                <FaLeaf className="text-3xl text-green-400/80" />
              </div>
              <div
                className="absolute bottom-[25%] right-[25%] text-white/70 animate-float"
                style={{
                  animationDelay: "0.5s",
                  transform: `translate(${mousePosition.x * 20}px, ${
                    mousePosition.y * 15
                  }px)`,
                }}
              >
                <FaSeedling className="text-3xl text-green-300/80" />
              </div>

              {/* Elemento decorativo circular rotativo */}
              <div className="absolute -right-16 -bottom-16 w-32 h-32 border-4 border-dashed border-green-300/30 rounded-full animate-rotate"></div>
              <div
                className="absolute -left-10 -top-10 w-20 h-20 border-2 border-dashed border-yellow-200/30 rounded-full animate-rotate"
                style={{ animationDirection: "reverse" }}
              ></div>

              {/* Partículas aparecendo e desaparecendo */}
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="absolute w-2 h-2 rounded-full bg-white/70 animate-particle"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 3}s`,
                  }}
                ></div>
              ))}
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

        {/* Banner de Promoções */}
        {pratosPromocao.length > 0 && (
          <section className="my-10 relative">
            {/* Decorações de fundo (reduzidas) */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-red-500/20 dark:bg-red-500/10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-orange-500/20 dark:bg-orange-500/10 rounded-full animate-pulse"></div>

            {/* Banner principal */}
            <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 dark:from-red-700 dark:via-red-600 dark:to-orange-600 rounded-xl overflow-hidden shadow-lg border border-red-400/20 dark:border-red-700/20">
              {/* Elementos decorativos (reduzidos) */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_50%,rgba(255,255,255,0.1),transparent_30%)]"></div>
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-yellow-500/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-red-600/20 rounded-full blur-xl"></div>

              {/* Header com título e badge de desconto (mais compacto) */}
              <div className="relative p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3 shadow-md">
                      <FaUtensils className="text-red-500 text-lg" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
                        OFERTAS ESPECIAIS
                        <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                          NOVO
                        </span>
                      </h2>
                      <p className="text-white/90 text-sm">
                        Economize até{" "}
                        <span className="font-bold text-yellow-300">
                          50% OFF
                        </span>{" "}
                        em pratos selecionados!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPromocoesModalOpen(true)}
                    className="bg-white hover:bg-yellow-50 text-red-600 px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg hidden md:flex items-center text-sm group"
                  >
                    Ver Todas{" "}
                    <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Separador animado */}
              <div className="h-1.5 bg-gradient-to-r from-yellow-500 via-white to-yellow-500 animate-gradient-x"></div>

              {/* Conteúdo do banner */}
              <div className="bg-gradient-to-b from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/5 p-5 relative">
                {loadingPromocoes ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-white/60 dark:bg-gray-700/40 rounded-xl h-64 animate-pulse shadow-md"
                      ></div>
                    ))}
                  </div>
                ) : errorPromocoes ? (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg shadow-sm">
                    {errorPromocoes}
                  </div>
                ) : (
                  <div className="relative">
                    {/* Conteúdo principal do carrossel */}
                    <div className="overflow-hidden">
                      <div
                        ref={promocoesContainerRef}
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(-${currentPromoPage * 100}%)`,
                        }}
                      >
                        {/* Dividir pratos em "páginas" para o carrossel */}
                        {[
                          ...Array(
                            Math.ceil(pratosPromocao.length / promocoesPerPage)
                          ),
                        ].map((_, pageIndex) => (
                          <div
                            key={pageIndex}
                            className="min-w-full flex gap-4 justify-center"
                          >
                            {pratosPromocao
                              .slice(
                                pageIndex * promocoesPerPage,
                                pageIndex * promocoesPerPage + promocoesPerPage
                              )
                              .map((prato) => (
                                <div
                                  key={prato.id}
                                  className="min-w-[300px] max-w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-red-200 dark:border-red-900/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative group"
                                >
                                  {/* Tag de desconto em formato de balão (maior) */}
                                  <div className="absolute -top-1 -right-1 z-20">
                                    <div className="relative">
                                      <div className="bg-red-600 text-white font-bold text-sm w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-gray-800">
                                        <div className="flex flex-col items-center leading-none text-center">
                                          <span className="text-[10px]">
                                            ATÉ
                                          </span>
                                          <span>
                                            {prato.precoOriginal
                                              ? Math.round(
                                                  ((prato.precoOriginal -
                                                    prato.preco) /
                                                    prato.precoOriginal) *
                                                    100
                                                )
                                              : 10}
                                            %
                                          </span>
                                          <span className="text-[10px]">
                                            OFF
                                          </span>
                                        </div>
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-800 rounded-full"></div>
                                    </div>
                                  </div>

                                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-yellow-100 to-red-100 dark:from-yellow-900/20 dark:to-red-900/20">
                                    {prato.imagem ? (
                                      <img
                                        src={prato.imagem}
                                        alt={prato.nome}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <FaUtensils className="text-2xl text-red-300 dark:text-red-700" />
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                  </div>

                                  <div className="p-4">
                                    <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white line-clamp-1">
                                      {prato.nome}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                      {prato.descricao}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between">
                                      <div>
                                        <div className="flex items-center">
                                          <span className="text-gray-400 dark:text-gray-500 line-through text-xs">
                                            R${" "}
                                            {prato.precoOriginal
                                              ? prato.precoOriginal.toFixed(2)
                                              : prato.preco.toFixed(2)}
                                          </span>
                                          <span className="ml-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            OFERTA
                                          </span>
                                        </div>
                                        <div className="text-red-600 dark:text-red-400 font-bold text-lg">
                                          R$ {prato.preco.toFixed(2)}
                                        </div>
                                      </div>

                                      <div className="text-right text-[10px] bg-green-500 text-white px-2 py-1 rounded-full font-medium">
                                        {prato.categoria}
                                      </div>
                                    </div>

                                    <Link
                                      to={`/prato/${prato.id}`}
                                      className="mt-3 w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center group-hover:shadow-md"
                                    >
                                      Ver detalhes
                                    </Link>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Controles de navegação (botões menores) */}
                    {pratosPromocao.length > promocoesPerPage && (
                      <>
                        {/* Botões de navegação */}
                        <button
                          onClick={prevPromoPage}
                          className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-red-600 hover:text-red-700 p-1.5 rounded-full shadow-md z-10 transition-all transform hover:scale-105"
                          aria-label="Promoção anterior"
                        >
                          <FaChevronLeft className="text-sm" />
                        </button>

                        <button
                          onClick={nextPromoPage}
                          className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-red-600 hover:text-red-700 p-1.5 rounded-full shadow-md z-10 transition-all transform hover:scale-105"
                          aria-label="Próxima promoção"
                        >
                          <FaChevronRight className="text-sm" />
                        </button>

                        {/* Botão para pausar/retomar autoplay */}
                        <button
                          onClick={() => setAutoPlayEnabled(!autoPlayEnabled)}
                          className="absolute right-1 bottom-1 bg-white/80 hover:bg-white text-red-600 hover:text-red-700 p-1.5 rounded-full shadow-md z-10 transition-all transform hover:scale-105"
                          aria-label={
                            autoPlayEnabled
                              ? "Pausar carrossel"
                              : "Retomar carrossel"
                          }
                        >
                          {autoPlayEnabled ? (
                            <FaPause className="text-xs" />
                          ) : (
                            <FaPlay className="text-xs" />
                          )}
                        </button>
                      </>
                    )}

                    {/* Indicadores de página e progresso */}
                    {pratosPromocao.length > promocoesPerPage && (
                      <div className="flex flex-col items-center mt-3 gap-1">
                        {/* Barra de progresso */}
                        {autoPlayEnabled && (
                          <div className="w-24 h-1 bg-red-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-600 animate-progress-bar"
                              style={{
                                animationDuration: "5s",
                                animationIterationCount: "infinite",
                                animationPlayState: autoPlayEnabled
                                  ? "running"
                                  : "paused",
                              }}
                            ></div>
                          </div>
                        )}

                        {/* Indicadores de página */}
                        <div className="flex justify-center gap-1.5">
                          {[
                            ...Array(
                              Math.ceil(
                                pratosPromocao.length / promocoesPerPage
                              )
                            ),
                          ].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => goToPromoPage(i)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                currentPromoPage === i
                                  ? "bg-red-600 w-4"
                                  : "bg-red-300 hover:bg-red-400"
                              }`}
                              aria-label={`Ir para página ${i + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Botão mobile e tempo limitado (versão mais compacta) */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2">
                  <div className="flex items-center bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-full px-3 py-1.5">
                    <div className="animate-pulse mr-1.5 text-orange-500">
                      <FaClock className="text-sm" />
                    </div>
                    <p className="text-orange-800 dark:text-orange-300 text-xs font-medium">
                      Ofertas por tempo limitado! Aproveite.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsPromocoesModalOpen(true)}
                    className="md:hidden bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm flex items-center"
                  >
                    Ver todas <FaArrowRight className="ml-1.5 text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Modal de Promoções */}
        <PromocoesModal
          isOpen={isPromocoesModalOpen}
          onClose={() => setIsPromocoesModalOpen(false)}
        />

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

          <div className="relative">
            {/* Linha de conexão */}
            <div className="hidden md:block absolute left-1/2 top-24 bottom-24 w-0.5 bg-gradient-to-b from-green-400 to-green-600 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
              {/* Passo 1 */}
              <div className="group">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full relative overflow-hidden">
                  {/* Círculo decorativo */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-400/10 rounded-full transition-transform duration-300 group-hover:scale-150"></div>

                  <div className="flex flex-col items-center text-center relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-md transform rotate-45 mb-5 group-hover:rotate-0 transition-transform duration-300">
                      <div className="w-full h-full flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">
                        <FaUtensils className="text-white text-xl" />
                      </div>
                    </div>

                    <div className="absolute -top-2 -left-2 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      1
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                      Escolha seu prato
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 relative">
                      Navegue pelo nosso cardápio premium e selecione os pratos
                      que deseja experimentar. Você pode filtrar por categorias
                      para encontrar exatamente o que procura.
                    </p>
                  </div>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="group md:mt-12">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full relative overflow-hidden">
                  {/* Círculo decorativo */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-400/10 rounded-full transition-transform duration-300 group-hover:scale-150"></div>

                  <div className="flex flex-col items-center text-center relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-md transform rotate-45 mb-5 group-hover:rotate-0 transition-transform duration-300">
                      <div className="w-full h-full flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">
                        <FaWhatsapp className="text-white text-xl" />
                      </div>
                    </div>

                    <div className="absolute -top-2 -left-2 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      2
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                      Peça pelo WhatsApp
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 relative">
                      Com apenas um clique no botão "Fazer Pedido", você será
                      direcionado para o WhatsApp do fornecedor com uma mensagem
                      personalizada já pronta para envio.
                    </p>
                  </div>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="group">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full relative overflow-hidden">
                  {/* Círculo decorativo */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-400/10 rounded-full transition-transform duration-300 group-hover:scale-150"></div>

                  <div className="flex flex-col items-center text-center relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-md transform rotate-45 mb-5 group-hover:rotate-0 transition-transform duration-300">
                      <div className="w-full h-full flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">
                        <FaMapMarkedAlt className="text-white text-xl" />
                      </div>
                    </div>

                    <div className="absolute -top-2 -left-2 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      3
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                      Receba sem sair de casa
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 relative">
                      Finalize seu pedido com o fornecedor via WhatsApp,
                      combinando a forma de pagamento e entrega. Logo sua
                      refeição chegará fresquinha e pronta para ser saboreada!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg px-6 py-4 max-w-2xl border border-green-100 dark:border-green-900/30 shadow-sm">
                <div className="flex items-start">
                  <div className="mr-4 bg-green-500 text-white p-2 rounded-lg">
                    <FaCheck className="text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-bold">Importante:</span> Todos os
                      fornecedores são verificados e seus alimentos seguem os
                      mais altos padrões de qualidade. Bom apetite!
                    </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pratos.map((prato) => (
                <PratoCard key={prato.id} {...prato} />
              ))}
            </div>
          )}
        </section>

        {/* Seção de Blog */}
        <div className="my-24 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-10 flex flex-col justify-center">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mr-4">
                  <FaBookMedical className="text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Blog LeveFit
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-base leading-relaxed">
                Conteúdo exclusivo sobre nutrição, receitas saudáveis e dicas
                para manter uma alimentação equilibrada. Nossos especialistas
                compartilham conhecimento para te ajudar a alcançar seus
                objetivos fitness.
              </p>
              <div>
                <Link
                  to="/blog"
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 font-medium text-base"
                >
                  Explorar Artigos
                  <HiArrowRight className="ml-3" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 h-72 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1080&auto=format"
                alt="Alimentação saudável - Blog LeveFit"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
