

// Username:  nfonzongmesmin_db_user

//YPhJWmiXxlm4NpUj

// mongodb+srv://nfonzongmesmin_db_user:YPhJWmiXxlm4NpUj@cluster0.pgwech4.mongodb.net/ecommerce_db?appName=Cluster0

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import cors from 'cors';

// Chargement des variables d'environnement (.env)
dotenv.config();

const app = express();

// <--- Activez CORS pour autoriser votre frontend Vite (port 5173)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const PORT = process.env.PORT || 5000;
console.log(process.env.PORT);

// Reconstitution de __dirname pour ES Modules
const __dirname = path.resolve();

// Augmentation de la limite du corps de la requête pour supporter le Base64 de Cloudinary v2
app.use(express.json({ limit: "10mb" })); // Middleware pour parser le corps des requêtes en JSON

// Intégration du middleware pour accéder à req.cookies
app.use(cookieParser());

// Déclaration de la route de base d'authentification
app.use('/api/auth', authRoutes);

// Routage des requêtes liées aux produits
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Configuration spécifique pour le mode PRODUCTION
if (process.env.NODE_ENV === "production") {
  // Définir le dossier static vers le Build du Frontend (dossier dist généré par Vite)
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // Toutes les requêtes HTTP GET non-API sont redirigées vers le index.html du React App
  app.get("/*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`The server is running on : http://localhost:${PORT}`);

  // Connexion à la base de données MongoDB
  connectDB();
});