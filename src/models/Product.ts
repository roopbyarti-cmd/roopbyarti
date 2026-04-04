import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    category: String,
    images: [String],
   description: {
  type: String,
  default: "",
},
    isFeatured: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);

