import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";

export async function POST(req: Request) {
  await connectDB();

  const { phone, product } = await req.json();

  let wishlist = await Wishlist.findOne({ phone });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      phone,
      products: [product],
    });
  } else {
    const exists = wishlist.products.find(
      (p: any) => p._id === product._id
    );

    if (exists) {
      // remove
      wishlist.products = wishlist.products.filter(
        (p: any) => p._id !== product._id
      );
    } else {
      // add
      wishlist.products.push(product);
    }

    await wishlist.save();
  }

  return Response.json(wishlist.products);
}

// 👉 GET
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  const wishlist = await Wishlist.findOne({ phone });

  return Response.json(wishlist?.products || []);
}