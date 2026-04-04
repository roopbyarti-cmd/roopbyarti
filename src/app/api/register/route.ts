import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    return Response.json({ error: "User already exists" });
  }

  const user = await User.create({ name, email, password });

  return Response.json(user);
}