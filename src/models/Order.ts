import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  items: Array,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
  type: String,
  default: "Processing",
},
});

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);