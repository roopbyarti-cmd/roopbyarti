import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create(body);

    return Response.json(product);
  } catch (error) {
    return Response.json({ error: "Failed" });
  }
}