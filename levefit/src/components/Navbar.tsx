import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAuth } from "../contexts/AuthContext";
import {
  FaSignOutAlt,
  FaClipboardList,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaLeaf,
  FaHome,
  FaStore,
  FaListAlt,
  FaPhoneAlt,
  FaBookMedical,
} from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import UserProfileModal from "./UserProfileModal";

// Componente de link para navegação no desktop
const NavLink = ({
  to,
  children,
  isActive,
}: {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 ${
      isActive
        ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
        : "text-gray-700 dark:text-gray-300"
    }`}
  >
    {children}
  </Link>
);

// Componente de link para navegação mobile
const MobileNavLink = ({
  to,
  children,
  isActive,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center w-full py-3 px-3 rounded-lg ${
      isActive
        ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 font-medium"
        : "text-gray-600 dark:text-gray-300"
    }`}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, userType, userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Verificar se o modo escuro está ativado com base na preferência do sistema ou localStorage
  useEffect(() => {
    const isDarkMode =
      localStorage.getItem("darkMode") === "true" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Verificar se um link está ativo
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Fechar o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        event.target !== document.getElementById("mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold flex items-center text-green-600 dark:text-green-400 transition-colors duration-300"
          >
            <FaLeaf className="mr-2 text-3xl" />
            <span className="hidden sm:inline">LeveFit</span>
          </Link>

          {/* Links de navegação para desktop */}
          <div className="hidden md:flex space-x-1">
            <NavLink to="/" isActive={isActive("/")}>
              <FaHome className="mr-1.5" /> Home
            </NavLink>
            <NavLink to="/categorias" isActive={isActive("/categorias")}>
              <FaListAlt className="mr-1.5" /> Categorias
            </NavLink>
            <NavLink to="/fornecedores" isActive={isActive("/fornecedores")}>
              <FaStore className="mr-1.5" /> Fornecedores
            </NavLink>
            <NavLink to="/blog" isActive={isActive("/blog")}>
              <FaBookMedical className="mr-1.5" /> Blog
            </NavLink>
            <NavLink to="/contato" isActive={isActive("/contato")}>
              <FaPhoneAlt className="mr-1.5" /> Contato
            </NavLink>
          </div>

          {/* Área de autenticação e botões */}
          <div className="flex items-center space-x-2">
            {/* Área de autenticação */}
            {isAuthenticated && userData ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg pl-2 pr-3 py-1.5 transition-colors duration-300"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-500 dark:border-green-400 flex items-center justify-center bg-green-100 dark:bg-green-900/50">
                    {userData.imagem ? (
                      <img
                        src={userData.imagem}
                        alt={userData.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {userData.nome.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{userData.nome}</span>
                  <HiChevronDown
                    className={`transform transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />

                  {userType === "fornecedor" &&
                    userData.assinaturaAtiva !== undefined && (
                      <div className="absolute -top-1 -right-1">
                        {userData.assinaturaAtiva ? (
                          <FaCheckCircle
                            className="text-green-500 dark:text-green-400 bg-white dark:bg-gray-800 rounded-full"
                            size={16}
                            title="Assinatura ativa"
                          />
                        ) : (
                          <FaTimesCircle
                            className="text-red-500 dark:text-red-400 bg-white dark:bg-gray-800 rounded-full"
                            size={16}
                            title="Assinatura inativa"
                          />
                        )}
                      </div>
                    )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-20 border border-gray-200 dark:border-gray-700 animate-scaleIn">
                    <div className="py-1 divide-y divide-gray-200 dark:divide-gray-700">
                      <div className="px-4 py-3 text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {userData.nome}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 truncate">
                          {userData.email}
                        </p>
                        {userType === "fornecedor" && (
                          <div className="mt-2 flex items-center">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                userData.assinaturaAtiva
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                              }`}
                            >
                              {userData.assinaturaAtiva
                                ? "Assinatura ativa"
                                : "Assinatura inativa"}
                            </span>
                          </div>
                        )}
                      </div>

                      {userType === "cliente" ? (
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setShowProfileModal(true);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
                        >
                          <FaUser className="mr-2 text-green-600 dark:text-green-400" />{" "}
                          Editar Perfil
                        </button>
                      ) : (
                        <Link
                          to="/dashboard/fornecedor"
                          className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaClipboardList className="mr-2 text-green-600 dark:text-green-400" />{" "}
                          Dashboard
                        </Link>
                      )}

                      <div>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
                        >
                          <FaSignOutAlt className="mr-2" /> Sair
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex space-x-2 items-center">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg shadow-sm transition-colors duration-300"
                >
                  Cadastro
                </button>
              </div>
            )}

            {/* Botão de menu mobile */}
            <button
              id="mobile-menu-button"
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu principal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className={`fixed inset-y-0 right-0 z-30 w-64 sm:w-80 bg-white dark:bg-gray-800 shadow-xl transform ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out`}
          >
            <div className="px-4 pb-6 pt-2 space-y-1">
              <MobileNavLink
                to="/"
                isActive={isActive("/")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaHome className="mr-3" />
                Home
              </MobileNavLink>
              <MobileNavLink
                to="/categorias"
                isActive={isActive("/categorias")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaListAlt className="mr-3" />
                Categorias
              </MobileNavLink>
              <MobileNavLink
                to="/fornecedores"
                isActive={isActive("/fornecedores")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaStore className="mr-3" />
                Fornecedores
              </MobileNavLink>
              <MobileNavLink
                to="/blog"
                isActive={isActive("/blog")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaBookMedical className="mr-3" />
                Blog
              </MobileNavLink>
              <MobileNavLink
                to="/contato"
                isActive={isActive("/contato")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaPhoneAlt className="mr-3" />
                Contato
              </MobileNavLink>
            </div>

            {!isAuthenticated && (
              <div className="mt-4 px-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded-lg font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowRegisterModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-300"
                >
                  Cadastro
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </nav>
  );
};

export default Navbar;
