// import { connectDB } from "@/lib/db";
// import Order from "@/models/Order";

// export async function POST(req: Request) {
//   await connectDB();

//   const body = await req.json();

//   const order = await Order.create(body);

//   return Response.json({ success: true, order });
// }


import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      email,
      phone,
      address,
      items,
      total,
      utr,
      screenshot,
      paymentStatus,
    } = body;

    // ✅ BASIC VALIDATION
    if (!name || !phone || !address || !items || !total) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ CREATE ORDER
    const order = await Order.create({
      orderId: body.orderId, 
      name,
      email,
      phone,
      address,
      items,
      total,
      utr,
      screenshot: screenshot || "", // 👈 optional
      paymentStatus: paymentStatus || "pending_verification",
      status: "pending", // 🔥 IMPORTANT
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Order API Error:", error);

    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}