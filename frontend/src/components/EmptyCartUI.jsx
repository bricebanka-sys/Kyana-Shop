import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EmptyCartUI = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-4 py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ShoppingCart className="h-24 w-24 text-gray-300" />
      <h3 className="text-2xl font-semibold text-gray-100">Your cart is empty</h3>
      <p className="text-gray-400">Looks like you {"haven't"} added anything to your cart yet.</p>
      <Link
        to="/"
        className="mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white hover:bg-emerald-600 transition-colors"
      >
        Start Shopping
      </Link>
    </motion.div>
  );
};

export default EmptyCartUI;