import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";



const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      // L'option id évite la superposition des notifications lors de clics répétés
      toast.error("Please login to add Products to cart.", {
        id: "login-required",
      });
      return;
    }

    // Appel de la méthode du store Zustand pour ajouter le produit
    addToCart(product);
    toast.success("Product added to cart !", product._id);
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
      {/* Conteneur de l'image */}
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full h-full"
          src={product.image}
          alt={product.name}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Informations du produit */}
      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">{product.name}</h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">
              {product.price.toFixed(2)} €
            </span>
          </p>
        </div>

        {/* Bouton d'action */}
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        >
          <ShoppingCart size={22} className="mr-2 h-5 w-5" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;