import express from 'express';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData, getDailySalesData } from '../controllers/analytics.controller.js';


const router = express.Router();


router.get('/', protectRoute, adminRoute, async(req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    
    // 2. Calcul des bornes de la période des 7 derniers jours
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 jours en millisecondes

    // 3. Récupération des données séquentielles pour le graphique
    const dailySalesData = await getDailySalesData(startDate, endDate);

    // 4. Envoi de la réponse JSON au client
    res.status(200).json({
      analyticsData,
      dailySalesData,
    });

  } catch (error) {
    console.error('Error retrieving analytics data :', error);
    res.status(500).json({ message: 'Server error while retrieving analytics data' });
  }
});

export default router;