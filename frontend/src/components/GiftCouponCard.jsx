import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";



const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, getMyCoupon, isCouponApplied, applyCoupon, removeCoupon } = useCartStore();

  // Chargement initial du coupon au montage du composant
  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  // Pré-remplissage du champ texte dès qu'un coupon est disponible dans l'état
  // Calculé pendant le rendu (et non dans un effet) : pattern recommandé par React
  // pour ajuster un state dérivé d'un autre state, sans rendu en cascade.
  const [prevCoupon, setPrevCoupon] = useState(coupon);
  if (coupon !== prevCoupon) {
    setPrevCoupon(coupon);
    setUserInputCode(coupon ? coupon.code : "");
  }

  const handleApplyCoupon = () => {
    if (!userInputCode.trim()) return;
    applyCoupon(userInputCode);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setUserInputCode("");
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-300">
            Do you have a voucher or a gift card?
          </label>
          <input
            type="text"
            id="voucher"
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Enter code here"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleApplyCoupon}
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        >
          Apply the code
        </button>
      </div>

      {/* Affichage si un coupon est appliqué */}
      {coupon && isCouponApplied && (
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium text-gray-300">Applied Coupon</h3>
          <p className="text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
          <motion.button
            type='button'
            className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}

      {/* Affichage d'un coupon disponible en compte */}
      {coupon && !isCouponApplied && (
        <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900/50 p-3">
          <h4 className="text-sm font-medium text-emerald-400">Your Available Coupon :</h4>
          <p className="text-xs text-gray-300 mt-1">
            Use the code <span className="font-bold text-white">{coupon.code}</span> when paying to get a {coupon.discountPercentage}% discount.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;