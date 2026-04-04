import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    await Product.findByIdAndDelete(id);

    return Response.json({ message: "Deleted ✅" });
  } catch (error) {
    return Response.json({ error: "Delete failed ❌" });
  }
}