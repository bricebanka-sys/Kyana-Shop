import { Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

const PurchaseCancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 border border-gray-700 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500 w-16 h-16" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-red-500 mb-2">
          Purchase Cancelled
        </h1>

        <p className="text-gray-300 mb-6">
          Your order has been cancelled. No payment has been taken from your account. Your items are still in your cart.
        </p>

        <div className='bg-gray-700 rounded-lg p-4 mb-6'>
          <p className='text-sm text-gray-400 text-center'>
            If you encountered any issues during the checkout process, please don&apos;t hesitate to contact our support team.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to={"/"}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCancelPage;