import express from 'express';
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct } from '../controllers/product.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route d'obtention de tous les produits (réservée à l'administrateur)
router.get('/', protectRoute, adminRoute, getAllProducts);

// Route publique pour récupérer les produits mis en avant
router.get('/featured', getFeaturedProducts);

router.get('/category/:category', getProductsByCategory);

// Route publique de recommandation de produits
router.get('/recommendations', getRecommendedProducts);

// Route d'ajout de produit (Admin uniquement)
router.post('/', protectRoute, adminRoute, createProduct);

// Route de suppression de produit par ID (Admin uniquement)
router.delete('/:id', protectRoute, adminRoute, deleteProduct);


// Basculer le statut 'featured' d'un produit (Admin uniquement)
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct);

export default router;