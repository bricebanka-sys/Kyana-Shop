
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { Toaster } from "react-hot-toast";
import { useUserStore } from './stores/useUserStore';
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import Footer from "./components/Footer";

function App() {

 
  const { user, checkAuth, checkingAuth} = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 2. Récupération du panier si l'utilisateur est connecté
  useEffect(() => {
    if (!user) return;
    getCartItems();
    
  }, [user, getCartItems]);

  // Affichage du spinner pendant la vérification du cookie de session JWT
  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Fond dégradé vert radial subtil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      {/* Contenu principal de l'application */}
      <div className="relative z-50 pt-20">
        <Navbar />
        <main className="flex-1">
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          {/* Route Administrateur Protégée */}
          <Route
            path="/secret-dashboard"
            element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/" />}
          />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/category/:category" element={<CategoryPage />} />

            {/* Route protégée : accessible uniquement aux utilisateurs connectés */}
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
          />
          <Route path="/purchase-cancel"
            element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
          />
        </Routes>
        </main>
      </div>

      {/* Pied de page : visible sur toutes les pages, toujours en bas */}
      <div className="relative z-50">
        <Footer />
      </div>
      <Toaster />
    </div>
  )
}

export default App
