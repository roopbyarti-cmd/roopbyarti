import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  await connectDB();

  const { id, status } = await req.json();

  await Order.findByIdAndUpdate(id, { status });

  return Response.json({ success: true });
}