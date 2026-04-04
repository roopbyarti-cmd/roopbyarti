import mongoose from "mongoose";
import fs from "fs";
import Product from "../src/models/Product.ts";

const MONGO_URI = "mongodb+srv://roopbyarti:arti123@cluster0.7r7tgkn.mongodb.net/jewellery";

async function importData() {
  try {
    await mongoose.connect(MONGO_URI);

    const data = JSON.parse(fs.readFileSync("products.json", "utf-8"));

    await Product.deleteMany(); // optional (old data remove)

    await Product.insertMany(data);

    console.log("Products Imported ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

importData();