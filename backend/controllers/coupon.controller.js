import Coupon from '../models/coupon.model.js';



// -----------------------------------------------------------------------------
// 1. OBTENIR LE COUPON DE L'UTILISATEUR CONNECTÉ
// -----------------------------------------------------------------------------
export const getCoupon = async (req, res) => {
  try {
    // Recherche d'un coupon actif lié à l'ID de l'utilisateur connecté
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });

    // Renvoie le coupon trouvé ou 'null' explicitement s'il n'en existe aucun
    res.json(coupon || null);

  } catch (error) {
    console.log("Error in getCoupon Controller:", error.message);
    res.status(500).json({ message: "Error server internal", error: error.message });
  }
};


// -----------------------------------------------------------------------------
// 2. VALIDER UN CODE COUPON SAISI
// -----------------------------------------------------------------------------
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    // Recherche d'un coupon correspondant au code, à l'utilisateur et actif
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });

    // Si aucun coupon correspondant n'est trouvé
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or invalid" });
    }

    // Vérification de la date d'expiration
    if (coupon.expirationDate < new Date()) {
      // Désactivation automatique du coupon expiré en base de données
      coupon.isActive = false;
      await coupon.save();

      return res.status(400).json({ message: "Coupon has expired" });
    }

    // Le coupon est valide
    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });

  } catch (error) {
    console.log("Error in validateCoupon Controller:", error.message);
    res.status(500).json({ message: "Error server internal", error: error.message });
  }
};