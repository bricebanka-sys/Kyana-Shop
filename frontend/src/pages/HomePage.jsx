import CategoryItem from "../components/CategoryItem";
import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";


// Tableau statique des catégories disponibles
const categories = [
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
  { href: "/footballs", name: "footballs", imageUrl: "/Nike-Football-3.png" },
  { href: "/kitbacks", name: "yonex-kitbacks", imageUrl: "/yonex-kitback-1.png" },
  { href: "/rackets", name: "rackets", imageUrl: "/yonex-racket-2.png" },
  { href: "/babolats", name: "babolat", imageUrl: "/babolat-kitback-1.png" },


];

const HomePage = () => {
  const { fetchFeaturedProducts, products, loading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Titre principal */}
        <h1 className="text-center text-4xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>

        {/* Grille Responsive des Catégories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {/* Affichage conditionnel des produits mis en avant */}
        {!loading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}

      </div>
    </div>
  );
};

export default HomePage;
