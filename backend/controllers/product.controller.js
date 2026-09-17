import Product from '../models/product.model.js';
import {redis} from '../lib/redis.js'; // Instance ioredis v6
import cloudinary from '../lib/cloudinary.js';

// Récupérer la totalité des produits de la base de données (Accès Admin)
export const getAllProducts = async (req, res) => {
  try {
    // Passer un objet vide {} à .find() permet d'extraire tous les documents de la collection
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const getFeaturedProducts = async (req, res) => {
  try {
    // 1. Recherche des données dans le cache Redis
    let featuredProducts = await redis.get("featured_products");

    if (featuredProducts) {
      // Données trouvées dans Redis : renvoi immédiat après parsing
      return res.json(JSON.parse(featuredProducts));
    }

    // 2. Si absent du cache (Cache Miss), requête dans MongoDB
    // .lean() renvoie des objets JS bruts au lieu de documents Mongoose lourds
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // 3. Stockage des données fraîches dans Redis pour les futures requêtes
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    // 4. Renvoi de la réponse au client
    res.json(featuredProducts);

  } catch (error) {
    console.log("Error in getFeaturedProducts controller:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    // Si une chaîne d'image (ex: base64) est transmise, on la téléverse sur Cloudinary
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products", // Les images seront organisées dans le dossier 'products' sur Cloudinary
      });
    }

    // Création du produit dans MongoDB avec Mongoose 9
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
      category,
    });

    res.status(201).json(product);

  } catch (error) {
    console.log("Error in createProduct controller:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Extraction du public_id de Cloudinary si une image existe
    if (product.image) {
      // Format d'URL : https://res.cloudinary.com/.../products/image_id.png
      const publicId = product.image.split("/").pop().split(".")[0];
      
      try {
        // Suppression du fichier sur Cloudinary (dans le dossier 'products')
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image supprimée de Cloudinary");
      } catch (cloudinaryError) {
        console.log("Error when deleting image from Cloudinary:", cloudinaryError.message);
      }
    }

    // Suppression du document dans MongoDB
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.log("Error in deleteProduct controller:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 } // Sélectionne aléatoirement 3 documents
      },
      {
        $project: { // Projection des champs utiles pour alléger la réponse
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1
        }
      }
    ]);

    res.json(products);

  } catch (error) {
    console.log("Error in getRecommendedProducts controller:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Product.find({ category });
    res.json({ products });

  } catch (error) {
    console.log("Error in getProductsByCategory controller:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Inversion du statut boléen
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    // Invalidation et mise à jour immédiate du cache Redis
    await updateFeaturedProductsCache();

    res.json(updatedProduct);

  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Fonction interne d'actualisation du cache Redis
async function updateFeaturedProductsCache() {
  try {
    // .lean() permet de récupérer de simples objets JS pour une sérialisation ultra-rapide
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    
    // Mise à jour de la clé 'featured_products' dans ioredis v6
    await redis.set("featured_products", JSON.stringify(featuredProducts));

  } catch (error) {
    console.log("Error updating featured products cache:", error.message);
  }
}