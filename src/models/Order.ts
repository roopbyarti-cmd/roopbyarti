import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: String,
  name: String,
  email: String,
  address: String,
  phone: String,
  items: Array,
  total: Number,
  utr:String,
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