import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    console.log("Fetching products...");

    const products = await Product.find();

    console.log("Products:", products);

    return Response.json(products, {
      headers: {
        "Cache-Control": "no-store", // 🔥 IMPORTANT
      },
    });

  } catch (error) {
    console.log("API ERROR ❌", error);
    return Response.json({ error: "Something went wrong" });
  }
}