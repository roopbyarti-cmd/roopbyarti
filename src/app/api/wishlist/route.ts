import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { phone, product } = await req.json();

    if (!phone || !product) {
      return Response.json({ error: "Missing data" }, { status: 400 });
    }

    const normalizedPhone = String(phone); // ✅ FIX

    let wishlist = await Wishlist.findOne({ phone: normalizedPhone });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        phone: normalizedPhone,
        products: [product],
      });
    } else {
      const exists = wishlist.products.find(
        (p: any) => String(p._id) === String(product._id) // ✅ FIX
      );

      if (exists) {
        wishlist.products = wishlist.products.filter(
          (p: any) => String(p._id) !== String(product._id) // ✅ FIX
        );
      } else {
        wishlist.products.push(product);
      }

      await wishlist.save();
    }

    return Response.json(wishlist.products);
  } catch (err) {
    console.error("WISHLIST ERROR:", err); // 🔥 IMPORTANT
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ GET
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) return Response.json([]);

    const wishlist = await Wishlist.findOne({
      phone: String(phone), // ✅ FIX
    });

    return Response.json(wishlist?.products || []);
  } catch (err) {
    console.error("GET WISHLIST ERROR:", err);
    return Response.json([]);
  }
}