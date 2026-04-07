import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request) {
  const token = req.headers.get("authorization");

  if (token !== "admin-secret-token") {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create(body);

    return Response.json(product);
  } catch (error) {
    return Response.json({ error: "Failed" });
  }
}