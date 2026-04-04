import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: String,
  productId: String,
});

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", WishlistSchema);