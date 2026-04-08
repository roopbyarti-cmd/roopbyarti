import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";

// 🔥 ADD / REMOVE (TOGGLE)
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // ✅ SAFE DATA
    const phone = String(body.phone);

    const product = {
      _id: String(body.product?._id || Date.now()), // 🔥 FORCE ID
      name: body.product?.name || "",
      price: body.product?.price || 0,
      image: body.product?.image || "",
      images: body.product?.images || [],
    };

    console.log("PHONE:", phone);
    console.log("PRODUCT:", product);

    let wishlist = await Wishlist.findOne({ phone });

    // ✅ CREATE NEW
    if (!wishlist) {
      wishlist = await Wishlist.create({
        phone,
        products: [product],
      });

      console.log("NEW WISHLIST CREATED");
    } else {
      // ✅ CHECK EXIST
      const exists = wishlist.products.find(
        (p: any) => String(p._id) === String(product._id)
      );

      if (exists) {
        // ❌ REMOVE
        wishlist.products = wishlist.products.filter(
          (p: any) => String(p._id) !== String(product._id)
        );
        console.log("REMOVED FROM WISHLIST");
      } else {
        // ➕ ADD
        wishlist.products.push(product);
        console.log("ADDED TO WISHLIST");
      }

      await wishlist.save();
    }

    return Response.json(wishlist.products);
  } catch (err) {
    console.error("WISHLIST ERROR:", err);
    return Response.json([], { status: 500 });
  }
}

// 🔥 GET WISHLIST
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const phone = String(searchParams.get("phone"));

    const wishlist = await Wishlist.findOne({ phone });

    console.log("FETCHED:", wishlist);

    return Response.json(wishlist?.products || []);
  } catch (err) {
    console.error("GET ERROR:", err);
    return Response.json([]);
  }
}