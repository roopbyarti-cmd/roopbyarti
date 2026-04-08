'use client';

import { useEffect, useState } from "react";
import ExploreCategories from "@/components/ExploreCategories";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import TrustedCustomer from "@/components/TrustedCustomer";
import VideoSection from "@/components/Video";
import { useRouter } from "next/navigation";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const router = useRouter();

  // ✅ LOAD WISHLIST FROM DB (IMPORTANT FIX)
  const loadWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.phone) return;

    const res = await fetch(`/api/wishlist?phone=${user.phone}`);
    const data = await res.json();

    setWishlistIds(data.map((item: any) => String(item._id)));
  };

  useEffect(() => {
    loadWishlist();

    // 🔁 header sync
    window.addEventListener("wishlistUpdated", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
    };
  }, []);

  // ✅ PRODUCTS LOAD
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const featured = data.filter((p: any) => p.isFeatured);

        setProducts(
          featured.length ? featured.slice(0, 6) : data.slice(0, 6)
        );
      });
  }, []);

  // 🛒 CART
  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProduct = cart.find(
      (item: any) => item._id === product._id
    );

    if (existingProduct) {
      if (existingProduct.quantity < existingProduct.stock) {
        existingProduct.quantity += 1;
      } else {
        toast.error("Stock limit reached ❌");
        return;
      }
    } else {
      cart.push({
        ...product,
        quantity: 1,
        stock: product.stock ?? 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

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
            _id: String(product._id || product.id),
            name: product.name,
            price: product.price,
            image: product.image || product.images?.[0],
          },
        }),
      });

      const data = await res.json();

      // ✅ FIX: update IDs instantly
      const ids = data.map((item: any) => String(item._id));
      setWishlistIds(ids);

      // ✅ header update
      window.dispatchEvent(new Event("wishlistUpdated"));

      // ✅ toast
      if (ids.includes(String(product._id))) {
        toast.success("Added to wishlist ❤️");
      } else {
        toast.success("Removed from wishlist ❌");
      }

    } catch (err) {
      console.error(err);
      toast.error("Error");
    }
  };

  return (
    <div>
      {/* Banner */}
      <div className="banner-roop">
        <img src="/roop-by-arti-banner.png" />
      </div>

      <ExploreCategories />

      <h1 className="text-2xl font-bold text-center my-6">
        Roop's Bestsellers
      </h1>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-10 mb-10">
        {products.map((p: any) => (
          <div
            key={p._id}
            onClick={() => router.push(`/product/${p._id}`)}
            className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group relative p-1.5"
          >

            {/* IMAGE */}
            <img
              src={
                encodeURI(
                  (p.images && p.images.length > 0
                    ? p.images[0]
                    : p.image) || "/no-image.png"
                )
              }
              className="h-80 w-full object-cover rounded-xl"
            />

            {/* CONTENT */}
            <h2 className="font-medium text-sm mt-3 text-gray-800">
              {p.name}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              ₹{p.price}
            </p>

            {/* CART */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(p);
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-black text-white text-sm"
            >
              Add to Cart
            </button>

            {/* ❤️ HEART FIXED */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(p);
              }}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
            >
              <Heart
                className={`w-5 h-5 transition ${
                  wishlistIds.includes(String(p._id))
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-gray-400"
                }`}
              />
            </button>

          </div>
        ))}
      </div>

      <TrustedCustomer />
      <VideoSection />
    </div>
  );
}