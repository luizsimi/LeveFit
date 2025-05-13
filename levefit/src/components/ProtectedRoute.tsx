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

      console.log("DEBUG - ProtectedRoute - Checking auth:", {
        token: token ? "Existe" : "Não existe",
        userType,
        userTypes,
        userData: userData ? "Existe" : "Não existe",
        requiresActiveSubscription,
        path: location.pathname,
      });

      if (!token || !userType || !userTypes.includes(userType)) {
        console.log("DEBUG - ProtectedRoute - Not authenticated, reasons:", {
          noToken: !token,
          noUserType: !userType,
          userTypeNotIncluded: userType ? !userTypes.includes(userType) : "N/A",
        });
        setIsAuthenticated(false);
        return;
      }

      // Verificar assinatura ativa se for fornecedor e a rota exigir
      if (requiresActiveSubscription && userType === "fornecedor" && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          console.log("DEBUG - ProtectedRoute - User data:", parsedUserData);

          // Verificar explicitamente se assinaturaAtiva é false
          if (parsedUserData.assinaturaAtiva === false) {
            console.log(
              "DEBUG - ProtectedRoute - No active subscription, redirecting..."
            );
            setHasActiveSubscription(false);
          } else {
            console.log(
              "DEBUG - ProtectedRoute - Has active subscription:",
              parsedUserData.assinaturaAtiva
            );
            setHasActiveSubscription(true);
          }
        } catch (error) {
          console.error(
            "DEBUG - ProtectedRoute - Error parsing user data:",
            error
          );
          console.log("Raw userData:", userData);
        }
      }

      console.log("DEBUG - ProtectedRoute - Authentication successful");
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [userTypes, requiresActiveSubscription, location.pathname]);

  // Enquanto verifica a autenticação, retorna null (não renderiza nada)
  if (isAuthenticated === null) {
    console.log("DEBUG - ProtectedRoute - Still checking authentication");
    return null;
  }

  // Se não estiver autenticado, redireciona para a página inicial
  if (!isAuthenticated) {
    console.log("DEBUG - ProtectedRoute - Not authenticated, redirecting to /");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se precisa de assinatura ativa mas não tem, redireciona para a página de assinatura
  if (requiresActiveSubscription && !hasActiveSubscription) {
    console.log("DEBUG - ProtectedRoute - Redirecting to subscription page");
    return <Navigate to="/dashboard/fornecedor/assinatura" replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo protegido
  console.log("DEBUG - ProtectedRoute - Rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
