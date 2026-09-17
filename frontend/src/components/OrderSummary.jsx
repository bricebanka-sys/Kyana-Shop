import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
// src/components/OrderSummary.jsx
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";


// Initialisation de Stripe côté Client avec la Clé Publique (Publishable Key)
const stripePromise = loadStripe("pk_test_51UE5pcLquAI7xB81yodVRUMIHmuBFJ1po0Pd1lMs3sA8qLX8M4eSA2k1Y8pvgwyFsiWt93JEb6SKJqaDcZo1NTXk00m0IxF7dm");
const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

  // Calcul des économies réalisées
  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    try {
      // Requête POST vers l'endpoint Express pour générer la session Checkout
      const res = await axios.post("/payments/create-checkout-session", {
        products: cart,
        couponCode: coupon ? coupon.code : null,
      });

      const session = res.data;

      // Redirection directe vers l'URL de la Checkout Session Stripe
      if (session.url) {
        window.location.href = session.url;
      } else {
        console.error("Error: The Stripe session URL is missing from the backend response.");
      }
    } catch (error) {
      console.error("Error whilst creating the payment session :", error);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          {/* Prix d'origine / Sous-total */}
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">Original price</dt>
            <dd className="text-base font-medium text-white">{formattedSubtotal} €</dd>
          </dl>

          {/* Affichage des économies si un coupon est valide */}
          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Discounts</dt>
              <dd className="text-base font-medium text-emerald-400">-{formattedSavings} €</dd>
            </dl>
          )}

          {/* Affichage du coupon appliqué */}
          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Coupon ({coupon.code})</dt>
              <dd className="text-base font-medium text-emerald-400">-{coupon.discountPercentage}%</dd>
            </dl>
          )}

          {/* Montant Total Final */}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-700 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">{formattedTotal} €</dd>
          </dl>
        </div>

        {/* Bouton de validation de commande */}
        <motion.button          
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:no-underline"
          >
            Continue shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;