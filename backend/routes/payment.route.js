import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createCheckoutSession, checkoutSuccess } from '../controllers/payment.controller.js';

const router = express.Router();


// Seuls les utilisateurs authentifiés peuvent démarrer une session de paiement
router.post('/create-checkout-session', protectRoute, createCheckoutSession);

// Route 2 : Confirmation du paiement et création du document Order
router.post('/checkout-success', protectRoute, checkoutSuccess);

export default router;