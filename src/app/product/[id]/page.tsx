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

  // ✅ LOAD PRODUCT + WISHLIST
  useEffect(() => {
    if (!id) return;

    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));

    // 🔥 FIX: LOAD FROM DB (NOT localStorage)
    const loadWishlist = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user?.phone) return;

      const res = await fetch(`/api/wishlist?phone=${user.phone}`);
      const data = await res.json();

      setWishlistIds(data.map((item: any) => item._id));
    };

    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
    };

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

  // ❤️ FINAL FIXED TOGGLE
  const toggleWishlist = async (product: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user?.phone) {
      toast.error("Login required");
      return;
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: String(user.phone),
          product: {
            _id: String(product._id),
            name: product.name,
            price: product.price,
            image: product.image || product.images?.[0],
          },
        }),
      });

      const data = await res.json();

      // ✅ HEART COLOR FIX
      setWishlistIds(data.map((item: any) => item._id));

      // ✅ HEADER COUNT UPDATE
      window.dispatchEvent(new Event("wishlistUpdated"));

      const exists = data.find((item: any) => item._id === product._id);

      toast.success(
        exists ? "Added to wishlist ❤️" : "Removed from wishlist ❌"
      );

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
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
          <button onClick={() => toggleWishlist(product)}>
            <Heart
              className={`w-6 h-6 transition ${
                wishlistIds.includes(String(product._id))
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

        {/* 📝 DESCRIPTION */}
        <div className="mt-6">
          <h3 className="font-semibold">Description</h3>
          <p className="text-gray-500 mt-2">
            {product.description || "No description available"}
          </p>
        </div>

        {/* 💎 CARE */}
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