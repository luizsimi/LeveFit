import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaHeart,
  FaLeaf,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaPaperPlane,
  FaCreditCard,
  FaLock,
  FaMapMarkerAlt,
  FaUserShield,
  FaRegClock,
  FaGlobe,
  FaCheckCircle,
  FaArrowRight,
  FaUtensils,
} from "react-icons/fa";
import { SiPix, SiVisa, SiMastercard } from "react-icons/si";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Aqui entraria a lógica para enviar o email para o backend
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300 shadow-inner border-t border-gray-200 dark:border-gray-700 relative z-10">
      {/* Shape Divider */}
      <div className="w-full overflow-hidden relative h-16">
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 [clip-path:polygon(0_75%,100%_0,100%_100%,0_100%)]"></div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800">
        <div className="container mx-auto px-6 py-14">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Receba dicas e novidades
            </h3>
            <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto">
              Inscreva-se para receber receitas saudáveis, dicas nutricionais e
              ofertas exclusivas diretamente no seu email.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row max-w-xl mx-auto gap-3"
            >
              <div className="flex-grow relative">
                <input
                  type="email"
                  placeholder="Seu melhor email"
                  className="w-full px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base shadow-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {subscribed && (
                  <div className="absolute -top-14 left-0 right-0 bg-green-800 text-white py-3 px-4 rounded-lg flex items-center shadow-lg transform animate-fade-in">
                    <FaCheckCircle className="mr-2 text-xl" /> Inscrição
                    realizada com sucesso!
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-medium px-6 py-4 rounded-lg transition-colors duration-300 flex items-center justify-center whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaPaperPlane className="mr-2" /> Inscrever-se
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 pt-16 pb-8">
        {/* Top section with logo and social links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-14 pb-10 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-8 md:mb-0">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg mr-4 shadow-md">
              <FaLeaf className="text-white text-2xl" />
            </div>
            <div>
              <span className="text-3xl font-bold text-gray-800 dark:text-white">
                LeveFit
              </span>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Comida saudável, vida leve
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-5">
              <SocialLink
                href="https://instagram.com"
                icon={<FaInstagram />}
                label="Instagram"
              />
              <SocialLink
                href="https://facebook.com"
                icon={<FaFacebook />}
                label="Facebook"
              />
              <SocialLink
                href="https://twitter.com"
                icon={<FaTwitter />}
                label="Twitter"
              />
              <SocialLink
                href="https://wa.me/5599999999999"
                icon={<FaWhatsapp />}
                label="WhatsApp"
              />
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-full">
              <FaGlobe className="mr-2" />
              <span>Português (Brasil)</span>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-bold mb-5 text-gray-800 dark:text-white flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md mr-3">
                <FaLeaf className="text-green-600 dark:text-green-400" />
              </div>
              Sobre o LeveFit
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Conectamos amantes de comida saudável a fornecedores locais
              especializados em refeições nutritivas e deliciosas.
            </p>
            <div className="flex items-start mt-5 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <FaMapMarkerAlt className="text-green-600 dark:text-green-400 mt-1 mr-3 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">
                Jardim Jose Ometto II
                <br />
                Araras - São Paulo
                <br />
                CEP: 13606-360
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-bold mb-5 text-gray-800 dark:text-white flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md mr-3">
                <FaGlobe className="text-green-600 dark:text-green-400" />
              </div>
              Informações
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/sobre">Quem Somos</FooterLink>
              <FooterLink to="/como-funciona">Como Funciona</FooterLink>
              <FooterLink to="/perguntas-frequentes">
                Perguntas Frequentes
              </FooterLink>
              <FooterLink to="/blog">Blog de Nutrição</FooterLink>
              <FooterLink to="/imprensa">Imprensa</FooterLink>
              <FooterLink to="/trabalhe-conosco">Trabalhe Conosco</FooterLink>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-bold mb-5 text-gray-800 dark:text-white flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md mr-3">
                <FaUtensils className="text-green-600 dark:text-green-400" />
              </div>
              Categorias
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <FooterLink to="/categorias/vegano">Vegano</FooterLink>
              <FooterLink to="/categorias/vegetariano">Vegetariano</FooterLink>
              <FooterLink to="/categorias/low-carb">Low Carb</FooterLink>
              <FooterLink to="/categorias/proteico">Proteico</FooterLink>
              <FooterLink to="/categorias/fit">Fit</FooterLink>
              <FooterLink to="/categorias/keto">Keto</FooterLink>
              <FooterLink to="/categorias/sem-gluten">Sem Glúten</FooterLink>
              <FooterLink to="/categorias/sem-lactose">Sem Lactose</FooterLink>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-bold mb-5 text-gray-800 dark:text-white flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md mr-3">
                <FaPhone className="text-green-600 dark:text-green-400" />
              </div>
              Atendimento
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaEnvelope className="text-green-600 dark:text-green-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  contato@levefit.com.br
                </span>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-green-600 dark:text-green-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  (19) 3456-7890
                </span>
              </div>
              <div className="flex items-start">
                <FaRegClock className="text-green-600 dark:text-green-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  Segunda a Sexta: 8h às 18h
                  <br />
                  Sábados: 9h às 13h
                </span>
              </div>
              <div className="pt-3">
                <Link
                  to="/contato"
                  className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow"
                >
                  Fale Conosco
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods and security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-t border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-md font-bold mb-5 text-gray-700 dark:text-gray-300 flex items-center">
              <FaCreditCard className="mr-2 text-green-600 dark:text-green-400" />
              Formas de Pagamento
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm border border-gray-100 dark:border-gray-600 transition-transform hover:scale-105">
                <SiVisa className="text-blue-600 dark:text-blue-400 text-3xl" />
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm border border-gray-100 dark:border-gray-600 transition-transform hover:scale-105">
                <SiMastercard className="text-red-600 dark:text-red-400 text-3xl" />
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm border border-gray-100 dark:border-gray-600 transition-transform hover:scale-105">
                <FaCreditCard className="text-gray-600 dark:text-gray-400 text-3xl" />
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm border border-gray-100 dark:border-gray-600 transition-transform hover:scale-105">
                <SiPix className="text-green-600 dark:text-green-400 text-3xl" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-bold mb-5 text-gray-700 dark:text-gray-300 flex items-center">
              <FaLock className="mr-2 text-green-600 dark:text-green-400" />
              Segurança e Privacidade
            </h3>
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md mr-3">
                  <FaLock className="text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  Criptografia SSL
                </span>
              </div>
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md mr-3">
                  <FaUserShield className="text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  Proteção de dados
                </span>
              </div>
              <div className="flex space-x-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <Link
                  to="/privacidade"
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center"
                >
                  Política de Privacidade
                  <FaArrowRight className="ml-1 text-sm" />
                </Link>
                <Link
                  to="/termos"
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center"
                >
                  Termos de Uso
                  <FaArrowRight className="ml-1 text-sm" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            &copy; {currentYear} LeveFit. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-3 flex items-center justify-center">
            Feito com{" "}
            <FaHeart className="text-red-500 mx-1 inline-block animate-pulse" />{" "}
            por <span className="font-medium ml-1">luizsimi</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Component for footer links
const FooterLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <li className="list-none">
    <Link
      to={to}
      className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 flex items-center group"
    >
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
      {children}
    </Link>
  </li>
);

// Component for social media links
const SocialLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white dark:bg-gray-700 hover:bg-green-500 dark:hover:bg-green-600 text-gray-600 dark:text-gray-300 hover:text-white dark:hover:text-white p-3 rounded-full transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-1"
    aria-label={label}
  >
    {icon}
  </a>
);

export default Footer;
