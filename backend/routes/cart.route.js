import express from 'express';
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity
} from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

// Applique l'authentification obligatoire sur toutes les routes du panier
router.get('/', protectRoute, getCartProducts);
router.post('/', protectRoute, addToCart);
router.delete('/', protectRoute, removeAllFromCart);
router.put('/:id', protectRoute, updateQuantity);


export default router;