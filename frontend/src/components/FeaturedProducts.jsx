import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const { addToCart } = useCartStore();

  // Ajustement responsive dynamique du nombre d'éléments visibles
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 768) setItemsPerPage(2);
      else if (window.innerWidth < 1024) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-emerald-400 mb-8">
          Featured Products
        </h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {featuredProducts?.map((product) => (
                <div
                  key={product._id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-2"
                >
                  <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-700 h-full flex flex-col justify-between p-4 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                    <div className="overflow-hidden rounded-md mb-4 h-48">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                        <p className="text-emerald-400 font-bold text-md mb-4">
                          {product.price.toFixed(2)}€
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton Précédent */}
          <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            className={`absolute top-1/2 -left-4 -translate-y-1/2 p-2 rounded-full bg-gray-800 border border-gray-700 text-white transition-colors duration-200 ${
              isStartDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-emerald-600 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Bouton Suivant */}
          <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            className={`absolute top-1/2 -right-4 -translate-y-1/2 p-2 rounded-full bg-gray-800 border border-gray-700 text-white transition-colors duration-200 ${
              isEndDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-emerald-600 cursor-pointer"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;