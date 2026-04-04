import { connectDB } from "@/lib/db";
import Order from "@/models/Order";



export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  const skip = (page - 1) * limit;

  // Total number of orders
  const total = await Order.countDocuments();

  // Paginated orders
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return Response.json({ orders, total });
}