import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, HandHeart, ShoppingBag } from "lucide-react";
import Confetti from "react-confetti";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart } = useCartStore();

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        // Envoi du session_id au backend pour valider définitivement la commande
        await axios.post("/payments/checkout-success", { sessionId });
        
        // Purge du panier local et distant
        clearCart();
      } catch (err) {
        console.error("Erreur lors de la validation du paiement :", err);
        setError("We are unable to process your order. Please contact support.");
      } finally {
        setIsProcessing(false);
      }
    };

    // Extraction du paramètre session_id de la Query String
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsProcessing(false);
      setError("No session ID was found in the URL.");
    }
  }, [clearCart,]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg font-semibold animate-pulse">Processing your order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 text-center border border-red-500/50">
          <h2 className="text-2xl font-bold text-red-500 mb-2">An error has occurred</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <Link to="/" className="inline-block bg-emerald-600 px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">
            Retourner à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
      {/* Animation Confetti grand écran */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        numberOfPieces={700}
        recycle={false}
        style={{ zIndex: 99 }}
      />

      <div className="max-w-md w-full bg-gray-800 overflow-hidden rounded-lg shadow-xl p-6 sm:p-8 border border-gray-700 relative z-10">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-emerald-500 w-16 h-16" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
          Purchase Successfull !
        </h1>

        <p className="text-gray-300 text-center mb-2">
          Thank you for your order. {"We're"} processing it now.
        </p>

        <p className="text-emerald-300 text-center text-sm mb-6">
          Check your email for order details and updates.
        </p>

        <div className='bg-gray-700 rounded-lg p-4 mb-6'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-gray-400'>Order number</span>
            <span className='text-sm font-semibold text-emerald-400'>#12345</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-400'>Estimated delivery</span>
            <span className='text-sm font-semibold text-emerald-400'>3-5 business days</span>
          </div>
        </div>

        <div className='space-y-4'>
          <button className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'>
            <HandHeart className='mr-2' size={18} />
            Thanks for trusting us!
          </button>
            <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          Continue shopping
          <ArrowRight className="w-5 h-5" />
        </Link> */}
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;