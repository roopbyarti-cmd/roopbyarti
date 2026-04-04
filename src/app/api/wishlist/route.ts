import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";

export async function POST(req: Request) {
  const { userId, productId } = await req.json();

  await connectDB();

  const exists = await Wishlist.findOne({ userId, productId });

  if (!exists) {
    await Wishlist.create({ userId, productId });
  }

  return Response.json({ message: "Added" });
}