
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "The coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true, // Convertit automatiquement le code en majuscules
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: [0, "The minimum discount is 0%"],
      max: [100, "The maximum discount is 100%"],
      default: 10,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Un utilisateur possède un unique coupon actif assigné
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;