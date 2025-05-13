import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetalhePrato from "./pages/DetalhePrato";
import FornecedorDashboard from "./pages/FornecedorDashboard";
import FormularioPrato from "./pages/FormularioPrato";
import AssinaturaFornecedor from "./pages/AssinaturaFornecedor";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pratos/:id" element={<DetalhePrato />} />
          <Route
            path="/dashboard/fornecedor"
            element={
              <ProtectedRoute
                userTypes={["fornecedor"]}
                requiresActiveSubscription={true}
              >
                <FornecedorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/fornecedor/novo-prato"
            element={
              <ProtectedRoute
                userTypes={["fornecedor"]}
                requiresActiveSubscription={true}
              >
                <FormularioPrato />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/fornecedor/editar-prato/:id"
            element={
              <ProtectedRoute
                userTypes={["fornecedor"]}
                requiresActiveSubscription={true}
              >
                <FormularioPrato />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/fornecedor/assinatura"
            element={
              <ProtectedRoute userTypes={["fornecedor"]}>
                <AssinaturaFornecedor />
              </ProtectedRoute>
            }
          />
          {/* Outras rotas serão adicionadas posteriormente */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
