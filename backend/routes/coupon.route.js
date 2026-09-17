import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getCoupon, validateCoupon } from '../controllers/coupon.controller.js';


const router = express.Router();

// Route GET : Récupérer le coupon de l'utilisateur connecté
router.get('/', protectRoute, getCoupon);

// Route POST : Valider un code coupon saisi lors de la commande
router.post('/validate', protectRoute, validateCoupon);



export default router;