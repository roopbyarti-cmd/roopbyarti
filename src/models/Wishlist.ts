import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  phone: String,
  products: [
    {
      _id: String,
      name: String,
      price: Number,
      image: String,
    },
  ],
});

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);