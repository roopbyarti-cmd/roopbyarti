'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<any>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));

    const data = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistIds(data.map((item: any) => item._id));
  }, [id]);

  // 🛒 ADD TO CART
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item: any) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  };

  // ❤️ WISHLIST
  const toggleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    const exists = wishlist.find((item: any) => item._id === product._id);

    if (exists) {
      wishlist = wishlist.filter((item: any) => item._id !== product._id);
    } else {
      wishlist.push(product);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setWishlistIds(wishlist.map((item: any) => item._id));
  };

  if (!product) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="p-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

      {/* LEFT IMAGE */}
      <div>
        <img
          src={product.images?.[0] || product.image}
          className="w-full h-[500px] object-cover rounded-xl"
        />
      </div>

      {/* RIGHT INFO */}
      <div>

        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          {/* ❤️ Wishlist */}
          <button onClick={toggleWishlist}>
            <Heart
              className={`w-6 h-6 ${
                wishlistIds.includes(product._id)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>

        <p className="text-gray-600 mt-2">₹{product.price}</p>

        {/* 🛒 ADD TO CART */}
        <button
          onClick={addToCart}
          className="mt-5 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
        >
          Add to Cart
        </button>

        {/* 📝 DESCRIPTION (DYNAMIC) */}
        <div className="mt-6">
          <h3 className="font-semibold">Description</h3>
          <p className="text-gray-500 mt-2">
            {product.description || "No description available"}
          </p>
        </div>

        {/* 💎 CARE INSTRUCTIONS (COMMON) */}
        <div className="mt-6">
          <h3 className="font-semibold">Jewellery Care Instructions</h3>
          <ul className="text-gray-500 mt-2 space-y-1 text-sm">
            <li>• Keep away from water & perfumes</li>
            <li>• Store in a dry box</li>
            <li>• Avoid direct sunlight</li>
            <li>• Clean with soft cloth</li>
          </ul>
        </div>

      </div>

    </div>
  );
}