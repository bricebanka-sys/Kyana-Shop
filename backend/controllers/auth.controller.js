
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { redis } from '../lib/redis.js';



// Génère l'Access Token et le Refresh Token en incluant l'ID utilisateur dans le payload
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m", // Expiration en 15 minutes
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // Expiration en 7 jours
  });

  return { accessToken, refreshToken };
};

// Stocke le Refresh Token dans Redis avec l'ID utilisateur comme clé
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 // Expiration en secondes (7 jours)
  );
};

// Configure et attache les cookies d'authentification à la réponse Express
const setCookies = (res, accessToken, refreshToken) => {
  // Cookie pour l'Access Token (15 minutes)
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Empêche l'accès via JavaScript (Protection XSS)
    secure: process.env.NODE_ENV === "production", // Transmis uniquement en HTTPS en production
    sameSite: "strict", // Protection contre les attaques CSRF
    maxAge: 15 * 60 * 1000, // Expiration en millisecondes (15 minutes)
  });

  // Cookie pour le Refresh Token (7 jours)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Protection XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Protection CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // Expiration en millisecondes (7 jours)
  });
};

export const signup = async (req, res) => {
  const {email, password, name} = req.body;

  try {
    // 1. Vérification de l'existence de l'utilisateur
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Création de l'utilisateur (le hook pre-save hachera automatiquement le mot de passe)
    const user = await User.create({ name, email, password });

    const {accessToken, refreshToken} = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    // 3. Réponse en cas de succès (code HTTP 201: Créé)
    res.status(201).json({user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }, message: "User created successfully",
    });

  } catch (error) {
    console.log("Erreur dans le contrôleur signup :", error.message);
    res.status(500).json({ message: error.message });
  }

};



export const login = async (req, res) => {
  
  try {
    const { email, password } = req.body;

    // 1. Recherche de l'utilisateur dans la base de données
    const user = await User.findOne({ email });

    // 2. Vérification de l'utilisateur et validation du mot de passe
    if (user && (await user.comparePassword(password))) {
      // 3. Génération des jetons JWT
      const { accessToken, refreshToken } = generateTokens(user._id);

      // 4. Stockage du Refresh Token dans Redis
      await storeRefreshToken(user._id, refreshToken);

      // 5. Attachement des cookies HTTP-Only
      setCookies(res, accessToken, refreshToken);

      // 6. Réponse client avec les informations essentielles de l'utilisateur
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      // Retourne un statut 401 (Non autorisé) en cas d'identifiants invalides
      res.status(401).json({ message: "Email or password is incorrect" });
    }
  } catch (error) {
    console.log("Error in login controller :", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  
  try {
    // Extraction du Refresh Token depuis les cookies de la requête
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Décodage du jeton pour récupérer l'ID utilisateur
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      // Suppression du Refresh Token stocké dans Upstash Redis
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    // Effacement des cookies d'authentification sur le client
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.log("Erreur dans le contrôleur logout :", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // 1. Extrait le Refresh Token des cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No Refresh Token provided" });
    }

    // 2. Vérifie et décode le Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 3. Récupère le token correspondant stocké dans Upstash Redis
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    // 4. Invalidation si le token présenté ne correspond pas à celui enregistré dans Redis
    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Refresh Token invalid or expired" });
    }

    // 5. Génère un nouvel Access Token (durée de vie : 15 minutes)
    const accessToken = jwt.sign(
      { userId: decoded.userId }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: "15m" }
    );

    // 6. Injection du nouvel Access Token dans le cookie sécurisé
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes en millisecondes
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller :", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    // L'utilisateur sera injecté par le middleware de protection (req.user)
    res.json(req.user);
  } catch (error) {
    console.log("Error in getProfile controller :", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};