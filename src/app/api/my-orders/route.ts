import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return Response.json({ error: "Phone required" });
    }

    const orders = await Order.find({ phone }).sort({ createdAt: -1 });

    return Response.json(orders);
  } catch (error) {
    return Response.json({ error: "Something went wrong" });
  }
}