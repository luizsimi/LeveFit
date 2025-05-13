import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

type UserType = "cliente" | "fornecedor" | null;

interface UserData {
  id: number;
  nome: string;
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  userData: UserData | null;
  login: (token: string, type: UserType, data: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Verificar se há token no localStorage ao inicializar
    const token = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType") as UserType;
    const storedUserData = localStorage.getItem("userData");

    if (token && storedUserType && storedUserData) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
      setUserData(JSON.parse(storedUserData));

      // Configurar o axios para enviar o token em todas as requisições
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const login = (token: string, type: UserType, data: UserData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userType", type as string);
    localStorage.setItem("userData", JSON.stringify(data));

    // Configurar o axios para enviar o token em todas as requisições
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setIsAuthenticated(true);
    setUserType(type);
    setUserData(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");

    // Remover o token das requisições axios
    delete axios.defaults.headers.common["Authorization"];

    setIsAuthenticated(false);
    setUserType(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, userData, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export default AuthContext;
