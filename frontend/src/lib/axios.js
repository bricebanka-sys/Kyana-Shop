import axios from "axios";
import { useUserStore } from "../stores/useUserStore";


// Création de l'instance centralisée Axios
const axiosInstance = axios.create({
  // Utilisation dynamique de l'URL selon l'environnement Vite (Développement vs Production)
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  
  // OBLIGATOIRE : Permet d'envoyer et recevoir automatiquement les cookies (Access Token / Refresh Token)
  withCredentials: true,
});

// Variable globale permettant d'éviter les appels concurrents multiples de rafraîchissement
let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si la requête retourne 401 Unauthorized et n'a pas déjà été réessayée
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Si un rafraîchissement est déjà en cours, attendez qu'il se termine
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        // Lancement d'un nouveau processus de rafraîchissement
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        // Rejeu de la requête initiale avec le nouveau jeton rafraîchi
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        // Si le rafraîchissement échoue, forcer la déconnexion
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;