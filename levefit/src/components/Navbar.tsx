import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAuth } from "../contexts/AuthContext";
import { FaSignOutAlt, FaClipboardList } from "react-icons/fa";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { isAuthenticated, userType, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
            <>
              <div className="flex items-center">
                <span className="text-sm mr-2">Olá, {userData.nome}</span>
              </div>

              {userType === "fornecedor" && (
                <button
                  onClick={() => navigate("/dashboard/fornecedor")}
                  className="bg-white text-green-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-100 flex items-center"
                >
                  <FaClipboardList className="mr-1" />
                  Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-800 flex items-center"
              >
                <FaSignOutAlt className="mr-1" />
                Sair
              </button>
            </>
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
    </nav>
  );
};

export default Navbar;
