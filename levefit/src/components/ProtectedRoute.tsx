import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

type UserType = "cliente" | "fornecedor";

interface ProtectedRouteProps {
  children: React.ReactNode;
  userTypes: UserType[];
  requiresActiveSubscription?: boolean;
}

const ProtectedRoute = ({
  children,
  userTypes,
  requiresActiveSubscription = false,
}: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] =
    useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType") as UserType | null;
      const userData = localStorage.getItem("userData");

      console.log("ProtectedRoute - Checking auth:", {
        userType,
        requiresActiveSubscription,
        path: location.pathname,
      });

      if (!token || !userType || !userTypes.includes(userType)) {
        console.log("ProtectedRoute - Not authenticated");
        setIsAuthenticated(false);
        return;
      }

      // Verificar assinatura ativa se for fornecedor e a rota exigir
      if (requiresActiveSubscription && userType === "fornecedor" && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          console.log("ProtectedRoute - User data:", parsedUserData);

          // Verificar explicitamente se assinaturaAtiva é false
          if (parsedUserData.assinaturaAtiva === false) {
            console.log(
              "ProtectedRoute - No active subscription, redirecting..."
            );
            setHasActiveSubscription(false);
          } else {
            console.log("ProtectedRoute - Has active subscription");
            setHasActiveSubscription(true);
          }
        } catch (error) {
          console.error("ProtectedRoute - Error parsing user data:", error);
        }
      }

      setIsAuthenticated(true);
    };

    checkAuth();
  }, [userTypes, requiresActiveSubscription, location.pathname]);

  // Enquanto verifica a autenticação, retorna null (não renderiza nada)
  if (isAuthenticated === null) {
    return null;
  }

  // Se não estiver autenticado, redireciona para a página inicial
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se precisa de assinatura ativa mas não tem, redireciona para a página de assinatura
  if (requiresActiveSubscription && !hasActiveSubscription) {
    console.log("ProtectedRoute - Redirecting to subscription page");
    return <Navigate to="/dashboard/fornecedor/assinatura" replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
