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
} from "react-icons/fa";
import { SiPix, SiVisa, SiMastercard } from "react-icons/si";
import { HiExternalLink } from "react-icons/hi";

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
    <footer className="bg-white dark:bg-gray-800 mt-16 transition-colors duration-300">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800">
        <div className="container mx-auto px-4 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Receba dicas e novidades
              </h3>
              <p className="text-green-100 md:pr-12">
                Inscreva-se para receber receitas saudáveis, dicas nutricionais
                e ofertas exclusivas diretamente no seu email.
              </p>
            </div>
            <div className="md:w-1/2">
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-grow relative">
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {subscribed && (
                    <div className="absolute -top-10 left-0 right-0 bg-green-800 text-white text-sm py-2 px-3 rounded flex items-center">
                      <FaCheckCircle className="mr-2" /> Inscrição realizada com
                      sucesso!
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center whitespace-nowrap"
                >
                  <FaPaperPlane className="mr-2" /> Inscrever-se
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        {/* Top section with logo and social links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-10 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="bg-green-500 p-2 rounded-lg mr-3">
              <FaLeaf className="text-white text-2xl" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                LeveFit
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Comida saudável, vida leve
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-3 mb-4">
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
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FaGlobe className="mr-2" />
              <span>Português (Brasil)</span>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-bold mb-5 text-gray-800 dark:text-white">
              Sobre o LeveFit
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Conectamos amantes de comida saudável a fornecedores locais
              especializados em refeições nutritivas e deliciosas.
            </p>
            <div className="flex items-start mt-5">
              <FaMapMarkerAlt className="text-green-600 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">
                Av. Principal, 1000
                <br />
                Bairro Centro, Cidade - Estado
                <br />
                CEP: 00000-000
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-5 text-gray-800 dark:text-white">
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

          <div>
            <h3 className="text-lg font-bold mb-5 text-gray-800 dark:text-white">
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

          <div>
            <h3 className="text-lg font-bold mb-5 text-gray-800 dark:text-white">
              Atendimento
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaEnvelope className="text-green-600 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  contato@levefit.com.br
                </span>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-green-600 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  (99) 99999-9999
                </span>
              </div>
              <div className="flex items-start">
                <FaRegClock className="text-green-600 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  Segunda a Sexta: 8h às 18h
                  <br />
                  Sábados: 9h às 13h
                </span>
              </div>
              <div className="pt-3">
                <Link
                  to="/contato"
                  className="inline-flex items-center bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                >
                  Fale Conosco
                  <HiExternalLink className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods and security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-md font-bold mb-4 text-gray-700 dark:text-gray-300">
              Formas de Pagamento
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                <SiVisa className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                <SiMastercard className="text-red-600 dark:text-red-400 text-2xl" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                <FaCreditCard className="text-gray-600 dark:text-gray-400 text-2xl" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                <SiPix className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-bold mb-4 text-gray-700 dark:text-gray-300">
              Segurança e Privacidade
            </h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <FaLock className="text-green-600 dark:text-green-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Criptografia SSL
                </span>
              </div>
              <div className="flex items-center">
                <FaUserShield className="text-green-600 dark:text-green-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Proteção de dados
                </span>
              </div>
              <div className="flex space-x-3 mt-1">
                <Link
                  to="/privacidade"
                  className="text-gray-600 dark:text-gray-300 text-sm hover:text-green-600 dark:hover:text-green-400"
                >
                  Política de Privacidade
                </Link>
                <Link
                  to="/termos"
                  className="text-gray-600 dark:text-gray-300 text-sm hover:text-green-600 dark:hover:text-green-400"
                >
                  Termos de Uso
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {currentYear} LeveFit. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 flex items-center justify-center">
            Feito com{" "}
            <FaHeart className="text-red-500 mx-1 inline-block animate-pulse" />{" "}
            luizsimi
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
      className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 flex items-center"
    >
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></span>
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
    className="bg-gray-100 dark:bg-gray-700 hover:bg-green-500 dark:hover:bg-green-600 text-gray-600 dark:text-gray-300 hover:text-white dark:hover:text-white p-2.5 rounded-full transition-colors duration-300"
    aria-label={label}
  >
    {icon}
  </a>
);

export default Footer;
