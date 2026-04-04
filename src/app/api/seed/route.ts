import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import products from "@/data/products.json";

export async function GET() {
  try {
    await connectDB();

    const count = await Product.countDocuments();

    if (count > 0) {
      return Response.json({ message: "Already seeded ✅" });
    }

    await Product.insertMany(products);

    return Response.json({ message: "Seed success ✅" });

  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}