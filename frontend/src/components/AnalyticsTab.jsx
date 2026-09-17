import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "../lib/axios";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [dailySalesData, setDailySalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données analytiques :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton des cartes statistiques (fond vert émeraude, comme les vraies cartes) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 p-6"
            >
              <div className="animate-pulse space-y-3">
                <div className="h-3 w-28 rounded bg-emerald-400/40" />
                <div className="h-8 w-14 rounded bg-emerald-300/50" />
              </div>
              {/* Icône fantôme en fond, comme dans le vrai design */}
              <div className="absolute -right-2 -bottom-2 h-16 w-16 rounded-full bg-emerald-500/30" />
            </div>
          ))}
        </div>

        {/* Skeleton de la carte graphique */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
          {/* Titre "Aperçu des Ventes (7 derniers jours)" */}
          <div className="mb-6 h-5 w-64 animate-pulse rounded bg-gray-700" />

          {/* Zone du graphique : axe Y à gauche + grille + courbe simulée */}
          <div className="flex gap-3">
            <div className="flex h-72 flex-col justify-between py-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-3 w-6 animate-pulse rounded bg-gray-700" />
              ))}
            </div>
            <div className="relative h-72 flex-1 animate-pulse rounded-md bg-gray-700/40">
              {/* Lignes de grille horizontales, comme le vrai graphique */}
              <div className="absolute inset-0 flex flex-col justify-between py-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="border-t border-dashed border-gray-600/50" />
                ))}
              </div>
            </div>
          </div>

          {/* Axe X : dates */}
          <div className="mt-2 flex justify-between pl-9">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-3 w-14 animate-pulse rounded bg-gray-700" />
            ))}
          </div>

          {/* Légende ("Revenus ($)" / "Ventes") */}
          <div className="mt-4 flex justify-center gap-6">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-700" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Grille des cartes d'analytiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          color="text-emerald-500"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="text-amber-500"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`${analyticsData.totalRevenue.toLocaleString()}€`}
          icon={DollarSign}
          color="text-purple-500"
        />
      </div>

      {/* Graphique des ventes des 7 derniers jours */}
      <motion.div
        className="bg-gray-800/60 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">Sales Overview (last 7 days)</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis yAxisId="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                  color: "#F3F4F6",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#10B981"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                name="Revenue (€)"
                stroke="#3B82F6"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;