import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';



/**
 * Calcule les métriques globales (KPIs) de la plateforme
 */
export const getAnalyticsData = async () => {
  // 1. Comptage global des utilisateurs et produits
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  // 2. Pipeline d'agrégation sur la collection Order
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // Regroupe l'ensemble des documents sans distinction
        totalSales: { $sum: 1 }, // Compte le nombre total de commandes
        totalRevenue: { $sum: '$totalAmount' }, // Additionne les montants totaux
      },
    },
  ]);

  // Extraction des résultats ou valeurs par défaut si aucune commande n'existe
  const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};


export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        // Filtre les commandes créées dans la plage des 7 derniers jours
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        // Regroupe par date au format AAAA-MM-JJ
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        // Trie par date croissante
        $sort: { _id: 1 },
      },
    ]);

    // Exemple de structure retournée par le pipeline :
    // [
    //   { _id: "2026-09-04", sales: 2, revenue: 121.50 },
    //   { _id: "2026-09-05", sales: 1, revenue: 45.00 }
    // ]

    // 2. Génération de toutes les dates continues de la plage (ex: 7 jours)
    const dateArray = getDatesInRange(startDate, endDate);
    console.log(dateArray);

    // 3. Fusion des données MongoDB avec le tableau complet des dates
    return dateArray.map((date) => {
      // Recherche si des données existent pour cette date précise
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    console.error("Error in getDailySalesData :", error.message);
    throw error;
  }

  
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Formatage au format ISO (YYYY-MM-DD)
    dates.push(currentDate.toISOString().split('T')[0]);
    // Passage au jour suivant
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}