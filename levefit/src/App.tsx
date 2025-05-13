import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetalhePrato from "./pages/DetalhePrato";
import FornecedorDashboard from "./pages/FornecedorDashboard";
import FormularioPrato from "./pages/FormularioPrato";
import AssinaturaFornecedor from "./pages/AssinaturaFornecedor";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import UserProfilePage from "./components/UserProfilePage";
import Categorias from "./pages/Categorias";
import Fornecedores from "./pages/Fornecedores";
import Contato from "./pages/Contato";
import DetalheFornecedor from "./pages/DetalheFornecedor";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pratos/:id" element={<DetalhePrato />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/fornecedores/:id" element={<DetalheFornecedor />} />
          <Route path="/contato" element={<Contato />} />

          {/* Rotas para o Blog */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Rota para o perfil do usuário */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute userTypes={["cliente", "fornecedor"]}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

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
