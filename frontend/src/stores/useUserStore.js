import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";



export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  // Action d'inscription
  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    // Validation préalable du mot de passe
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Password do not Match.");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data, loading: false });
      toast.success("Account created successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  },

  // Action de connexion
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
      toast.success("Login successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Incorrect credentials.");
    }
  },


  // Action de déconnexion
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logout successfull!.");
    } catch (error) {
      toast.error(error.response?.data?.message || "An Error occured during logout.");
    }
  },

  // Vérification automatique de la session au rafraîchissement
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message)
      set({ checkingAuth: false, user: null });
    }
  },

  
  // Fonction pour renouveler le jeton d'accès via le Refresh Token
  refreshToken: async () => {
    // Empêche les tentatives multiples simultanées si une vérification est déjà en cours
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      // En cas d'échec du rafraîchissement (ex: Refresh Token expiré), déconnexion complète
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));