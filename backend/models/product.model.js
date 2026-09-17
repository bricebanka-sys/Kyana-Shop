import mongoose from 'mongoose';


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "The product description is required"],
    },
    price: {
      type: Number,
      required: [true, "The product price is required"],
      min: [0, "The product price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "The product image is required"],
    },
    category: {
      type: String,
      required: [true, "The product category is required"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Génère automatiquement createdAt et updatedAt
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;