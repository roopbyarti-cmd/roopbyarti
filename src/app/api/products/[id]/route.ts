import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params; // 🔥 FIX HERE

    const product = await Product.findById(id);

    return Response.json(product);
  } catch (error) {
    return Response.json({ error: "Product not found" });
  }
}