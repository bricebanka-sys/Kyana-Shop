import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";



export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  loading: false,
  isCouponApplied:false,


  // 1. Récupération du coupon disponible pour l'utilisateur
  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },

  // 2. Validation et application d'un code promo
  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully !");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired voucher code.");
    }
  },

  // 3. Retrait du coupon appliqué
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed.");
  },

  // 1. Récupérer les articles du panier depuis le backend (Redis / MongoDB)
  getCartItems: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data, loading: false });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [], loading: false });
      toast.error(error.response?.data?.message || "Unable to retrieve the cart.");
    }
  },

  // Méthode de réinitialisation complète du panier
  clearCart: async () => {
    try {
      // Suppression du panier côté serveur/Redis
      await axios.delete("/cart");
      
      // Réinitialisation de l'état local Zustand
      set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du panier :", error);
    }
  },

  // 2. Ajouter un produit au panier avec gestion optimiste de l'UI
  addToCart: async (product) => {
    try {
      // Appel API : transmission de l'ID du produit au backend
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart!");

      // Mise à jour locale de l'état (UI)
      set((prevState) => {
        const existingItem = prevState.cart.find((item) => item._id === product._id);
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];

        return { cart: newCart };
      });

      // Recalcul immédiat des montants
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding to cart.");
    }
  },

  // 3. Suppression complète d'un produit du panier
  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
      toast.success("Item removed from the shopping cart.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error whilst removing.");
    }
  },

  // 4. Mise à jour des quantités (Incrémentation / Décrémentation)
  updateQuantity: async (productId, quantity) => {
    // Si la quantité descend à 0, nous supprimons le produit
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    try {
      await axios.put(`/cart/${productId}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  },

  // 3. Calcul de l'accumulateur (Sous-total, Remises et Total)
  calculateTotals: () => {
    const { cart, coupon, isCouponApplied } = get();

    // Utilisation d'un accumulateur dans reduce() pour le sous-total
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let total = subtotal;

    if (coupon && isCouponApplied) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));