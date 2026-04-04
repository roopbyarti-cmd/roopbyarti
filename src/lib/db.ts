// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     if (mongoose.connection.readyState === 1) {
//       return;
//     }

//     await mongoose.connect(process.env.MONGO_URI as string);
//     console.log("MongoDB Connected ✅");
//   } catch (error) {
//     console.log("DB Error ❌", error);
//   }
// };
import mongoose from "mongoose";

let isConnected = false; // 🔥 global flag

export const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected ⚡");
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing ❌");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    isConnected = conn.connections[0].readyState === 1;

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("DB Error ❌", error);
    throw error;
  }
};