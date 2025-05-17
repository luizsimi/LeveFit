import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
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
  updateUserData: (data: Partial<UserData>) => void;
  refreshUserData: () => Promise<void>;
  isRefreshing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const refreshingRef = useRef<boolean>(false);

  useEffect(() => {
    // Verificar se há token no localStorage ao inicializar
    const token = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType") as UserType;
    const storedUserData = localStorage.getItem("userData");

    console.log(
      "DEBUG - AuthContext - Inicializando, verificando localStorage:",
      {
        token: token ? "Existe" : "Não existe",
        storedUserType,
        storedUserData: storedUserData ? "Existe" : "Não existe",
      }
    );

    if (token && storedUserType && storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        console.log("DEBUG - AuthContext - Dados do usuário recuperados:", {
          userType: storedUserType,
          id: parsedUserData.id,
          nome: parsedUserData.nome,
        });

        setIsAuthenticated(true);
        setUserType(storedUserType);
        setUserData(parsedUserData);

        // Configurar o axios para enviar o token em todas as requisições
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("DEBUG - AuthContext - Token configurado no axios");
      } catch (error) {
        console.error(
          "DEBUG - AuthContext - Erro ao parsear dados do usuário:",
          error
        );
        console.log(
          "DEBUG - AuthContext - Conteúdo bruto de userData:",
          storedUserData
        );
      }
    } else {
      console.log("DEBUG - AuthContext - Usuário não está autenticado");
    }
  }, []);

  const login = (token: string, type: UserType, data: UserData) => {
    console.log("DEBUG - AuthContext - Realizando login:", {
      tokenExiste: !!token,
      type,
      userData: data ? { id: data.id, nome: data.nome } : null,
    });

    localStorage.setItem("token", token);
    localStorage.setItem("userType", type as string);
    localStorage.setItem("userData", JSON.stringify(data));

    // Configurar o axios para enviar o token em todas as requisições
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setIsAuthenticated(true);
    setUserType(type);
    setUserData(data);

    console.log("DEBUG - AuthContext - Login concluído com sucesso");
  };

  const logout = () => {
    console.log("DEBUG - AuthContext - Realizando logout");

    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");

    // Remover o token das requisições axios
    delete axios.defaults.headers.common["Authorization"];

    setIsAuthenticated(false);
    setUserType(null);
    setUserData(null);

    console.log("DEBUG - AuthContext - Logout concluído");
  };

  // Atualizar parcialmente os dados do usuário
  const updateUserData = (data: Partial<UserData>) => {
    if (!userData) return;

    console.log("DEBUG - AuthContext - Atualizando dados do usuário:", data);

    const updatedUserData = { ...userData, ...data };
    localStorage.setItem("userData", JSON.stringify(updatedUserData));
    setUserData(updatedUserData);

    console.log("DEBUG - AuthContext - Dados atualizados com sucesso");
  };

  // Buscar dados atualizados do perfil a partir da API
  const refreshUserData = async () => {
    if (!isAuthenticated || !userType || refreshingRef.current) return;

    try {
      // Prevenir chamadas múltiplas simultâneas
      refreshingRef.current = true;
      setIsRefreshing(true);

      console.log("DEBUG - AuthContext - Atualizando dados do usuário da API");
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("DEBUG - AuthContext - Token não encontrado");
        return;
      }

      const endpoint =
        userType === "fornecedor"
          ? "http://localhost:3333/fornecedores/perfil"
          : "http://localhost:3333/clientes/perfil";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUserData = response.data;
      console.log(
        "DEBUG - AuthContext - Dados atualizados recebidos:",
        updatedUserData ? "dados válidos" : "dados inválidos"
      );

      if (updatedUserData) {
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        return updatedUserData;
      }
    } catch (error) {
      console.error("DEBUG - AuthContext - Erro ao atualizar dados:", error);
      // Se houver erro de autenticação, realizar logout para evitar loops infinitos
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log(
          "DEBUG - AuthContext - Erro de autenticação, realizando logout"
        );
        logout();
      }
    } finally {
      setIsRefreshing(false);
      // Adicionar um delay mais longo antes de permitir nova atualização
      setTimeout(() => {
        refreshingRef.current = false;
      }, 5000); // 5 segundos para evitar requisições frequentes
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userType,
        userData,
        login,
        logout,
        updateUserData,
        refreshUserData,
        isRefreshing,
      }}
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
