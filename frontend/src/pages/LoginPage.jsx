import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
// import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Récupération des données et méthodes du store Zustand
  const { login, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password)
    login(email, password);
  };
  return (

    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          
          {/* En-tête animé (Apparition depuis le haut : y négatif) */}
          <motion.div
            className="sm:mx-auto sm:w-full sm:max-w-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
              Create your account
            </h2>
          </motion.div>
    
          {/* Conteneur du Formulaire animé (Apparition depuis le bas : y positif) */}
          <motion.div
            className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                
    
                {/* Champ : Adresse E-mail */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail( e.target.value )}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="mesmin@exemple.com"
                    />
                  </div>
                </div>
    
                {/* Champ : Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword( e.target.value )}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
    
                {/* Bouton de soumission avec état de chargement */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                      Login
                    </>
                  )}
                </button>
              </form>
    
              {/* Lien vers la page de connexion */}
              <div className="mt-6">
                <p className="text-center text-sm text-gray-400">
                  Not a member?{" "}
                  <Link to="/signup" className="font-medium text-emerald-400 hover:text-emerald-300 flex items-center justify-center inline-flex ml-1">
                    Sign up now <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </p>
              </div>
    
            </div>
          </motion.div>
        </div>
  );
};

export default LoginPage;