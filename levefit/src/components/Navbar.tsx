import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAuth } from "../contexts/AuthContext";
import {
  FaSignOutAlt,
  FaClipboardList,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import UserProfileModal from "./UserProfileModal";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, userType, userData, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="mr-2">🥗</span>
          LeveFit
        </Link>

        <div className="flex space-x-8">
          <Link to="/" className="hover:text-green-200">
            Home
          </Link>
          <Link to="/categorias" className="hover:text-green-200">
            Categorias
          </Link>
          <Link to="/fornecedores" className="hover:text-green-200">
            Fornecedores
          </Link>
          <Link to="/contato" className="hover:text-green-200">
            Contato
          </Link>
        </div>

        <div className="flex space-x-4 items-center">
          {isAuthenticated && userData ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-green-700 hover:bg-green-800 rounded-full pl-2 pr-3 py-1 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-green-500">
                  {userData.imagem ? (
                    <img
                      src={userData.imagem}
                      alt={userData.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {userData.nome.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium">{userData.nome}</span>
                <HiChevronDown
                  className={`transform transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />

                {userType === "fornecedor" &&
                  userData.assinaturaAtiva !== undefined && (
                    <div className="absolute -top-1 -right-1">
                      {userData.assinaturaAtiva ? (
                        <FaCheckCircle
                          className="text-white bg-green-500 rounded-full"
                          title="Assinatura ativa"
                        />
                      ) : (
                        <FaTimesCircle
                          className="text-white bg-red-500 rounded-full"
                          title="Assinatura inativa"
                        />
                      )}
                    </div>
                  )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium">{userData.nome}</p>
                      <p className="text-gray-500">{userData.email}</p>
                      {userType === "fornecedor" && (
                        <div className="mt-1 flex items-center">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              userData.assinaturaAtiva
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
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
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaUser className="mr-2" /> Editar Perfil
                      </button>
                    ) : (
                      <Link
                        to="/dashboard/fornecedor"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaClipboardList className="mr-2" /> Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-200">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" /> Sair
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-100"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-green-700 text-white px-4 py-2 rounded-md font-medium hover:bg-green-800"
              >
                Cadastro
              </button>
            </>
          )}
        </div>
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
