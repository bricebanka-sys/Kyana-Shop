import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {

  // Simulation temporaire des états d'authentification (bientôt gérés via Zustand)
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          
          {/* Logo Principal / Lien vers l'Accueil */}
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-400 flex items-center space-x-2 flex"
          >
            Kyana'Shop
          </Link>

          {/* Navigation Droite */}
          <nav className="flex flex-wrap items-center gap-4">
            
            {/* Lien Accueil */}
            <Link
              to="/"
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>

            {/* Section réservée à l'Utilisateur Connecté */}
            {user && (
              <Link
                to={"/cart"}
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center"
              >
                <ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={20} />
                <span className="hidden sm:inline">Cart</span>
                
                {/* Badge de notification du nombre d'articles */}
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {/* Bouton Tableau de Bord (Réservé aux Rôles ADMIN) */}
            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {/* Alternance Connexion / Déconnexion selon l'état `user` */}
            {user ? (
              <button
                onClick={logout}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;