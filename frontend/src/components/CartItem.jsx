import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <div className="group rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm transition-colors hover:border-gray-600 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">

        {/* Image du produit */}
        <div className="shrink-0 md:order-1">
          <img
            className="h-20 w-20 rounded-md border border-gray-700 object-cover"
            src={item.image}
            alt={item.name}
          />
        </div>

        {/* Nom du produit & Bouton de suppression */}
        <div className="min-w-0 flex-1 md:order-2">
          <p className="truncate text-base font-medium text-white transition-colors hover:text-emerald-400">
            {item.name}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-gray-400">{item.description}</p>

          <button
            type="button"
            onClick={() => removeFromCart(item._id)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-red-400 transition-colors hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>

        {/* Quantité, Contrôles & Prix */}
        <div className="flex items-center justify-between gap-4 border-t border-gray-700 pt-4 md:order-3 md:w-auto md:border-t-0 md:pt-0">

          {/* Contrôles de quantité */}
          <div className="flex items-center gap-3 rounded-md border border-gray-600 bg-gray-700/50 p-1">
            <button
              type="button"
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <p className="w-4 text-center text-sm font-medium text-white">{item.quantity}</p>

            <button
              type="button"
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Prix Total pour la ligne */}
          <p className="w-24 shrink-0 text-right text-base font-bold text-emerald-400 md:w-28">
            {(item.price * item.quantity).toFixed(2)} €
          </p>
        </div>

      </div>
    </div>
  );
};

export default CartItem;