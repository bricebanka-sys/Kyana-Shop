import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  // Action pour créer un produit
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("Product successfully created!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating the product.");
      set({ loading: false });
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      // Extraction de l'objet products retourné par le backend
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch products.");
    }
  },

  // Supprimer un produit
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      // Filtrage du produit supprimé hors du tableau local
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
        loading: false,
      }));
      toast.success("Product successfully deleted.");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Deletion failed.");
    }
  },

  // Basculer l'état "Mis en avant" (Featured)
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      // Mise à jour locale de la propriété isFeatured
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
        ),
        loading: false,
      }));
      toast.success("Product status updated!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Update error.");
    }
  },

  // Récupération des produits mis en avant (Featured)
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Erreur lors de la récupération des produits phares :", error);
      toast.error(error.response?.data?.error || "Unable to load featured products.");
    }
  },


  // Récupérer tous les produits
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      // On extrait la liste depuis response.data.products selon la structure envoyée par le backend
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch Products");
    }
  },
}));