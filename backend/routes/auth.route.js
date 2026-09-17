import express from 'express';
import { signup, login, logout, refreshToken, getProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Route pour générer un nouvel Access Token à partir du Refresh Token
router.post("/refresh-token", refreshToken);

// Route d'obtention du profil (future route protégée)
router.get("/profile", protectRoute, getProfile);

export default router;