import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


// 1. Middleware d'Authentification (Vérifie si l'utilisateur est connecté)
export const protectRoute = async (req, res, next) => {
  try {
    // Extraction du jeton d'accès depuis les cookies
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized : No access token provided" });
    }

    try {
      // Décodage et vérification du jeton JWT
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      
      // Récupération de l'utilisateur sans le champ mot de passe
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Injection des données utilisateur dans la requête pour les middlewares/contrôleurs suivants
      req.user = user;
      
      // Passage au middleware ou contrôleur suivant
      next();

    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired" });
      }
      throw error; // Renvoie l'erreur vers le catch global
    }

  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized : Invalid access token" });
  }
};


// 2. Middleware de Contrôle du Rôle Administrateur
export const adminRoute = (req, res, next) => {
  // Le middleware protectRoute s'étant exécuté avant, req.user est disponible
  if (req.user && req.user.role === "admin") {
    next(); // L'utilisateur est admin, on poursuit l'exécution
  } else {
    return res.status(403).json({ message: "Access denied : Admin rights required" });
  }
};