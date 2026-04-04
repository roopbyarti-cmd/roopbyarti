// import { connectDB } from "@/lib/db";
// import Product from "@/models/Product";

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const updated = await Product.findByIdAndUpdate(
//       body.id,
//       {
//         name: body.name,
//         price: body.price,
//         images: body.images,
//         category: body.category,
//         stock: body.stock,
//         description: body.description,
//       },
//       { new: true }
//     );

//     return Response.json(updated);
//   } catch (error) {
//     return Response.json({ error: "Update failed" });
//   }
// }
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // 🔥 DEBUG (optional but useful)
    console.log("UPDATE BODY:", body);

    const product = await Product.findById(body.id);

    if (!product) {
      return Response.json({ error: "Product not found" });
    }

    // 🔥 MANUAL UPDATE (no bug)
    product.name = body.name;
    product.price = body.price;
    product.images = body.images;
    product.category = body.category;
    product.stock = body.stock;
    product.description = body.description;

    await product.save();

    return Response.json(product);

  } catch (error) {
    console.log(error);
    return Response.json({ error: "Update failed" });
  }
}