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

  // ✅ LOAD WISHLIST
  const loadWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.phone) return;

    const res = await fetch(`/api/wishlist?phone=${user.phone}`);
    const data = await res.json();

    setWishlistIds(data.map((item: any) => String(item._id)));
  };

  useEffect(() => {
    loadWishlist();

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

  // ❤️ WISHLIST
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

      const ids = data.map((item: any) => String(item._id));
      setWishlistIds(ids);

      window.dispatchEvent(new Event("wishlistUpdated"));

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-10 mb-10">
        {products.map((p: any) => (
          <div
            key={p._id}
            onClick={() => {
              if (p.stock === 0) {
                setSelectedProduct(p);
                setCurrentImage(0);
                return;
              }
              router.push(`/product/${p._id}`);
            }}
            className={`bg-white rounded-2xl overflow-hidden shadow-sm transition group relative p-1.5 ${
              p.stock === 0
                ? "cursor-not-allowed"
                : "hover:shadow-xl cursor-pointer"
            }`}
          >

            {/* SOLD OUT TAG */}
            {p.stock === 0 && (
              <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                SOLD OUT
              </div>
            )}

            {/* IMAGE */}
            <img
              src={
                encodeURI(
                  (p.images && p.images.length > 0
                    ? p.images[0]
                    : p.image) || "/no-image.png"
                )
              }
              className={`h-80 w-full object-cover rounded-xl ${
                p.stock === 0 ? "opacity-50" : ""
              }`}
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
                if (p.stock === 0) return;
                addToCart(p);
              }}
              disabled={p.stock === 0}
              className={`w-full mt-4 py-2.5 rounded-xl text-sm ${
                p.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white"
              }`}
            >
              {p.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>

            {/* ❤️ HEART */}
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

      {/* 🔥 POPUP */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-[90%] max-w-3xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-4 text-xl"
            >
              ✖
            </button>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <img
                  src={
                    selectedProduct.images?.[currentImage] ||
                    selectedProduct.image
                  }
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {selectedProduct.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  ₹{selectedProduct.price}
                </p>

                <button
                  disabled={selectedProduct.stock === 0}
                  className={`mt-4 w-full py-3 rounded-xl ${
                    selectedProduct.stock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white"
                  }`}
                >
                  {selectedProduct.stock === 0 ? "Sold Out" : "Add to Cart"}
                </button>

                {/* ❤️ POPUP HEART */}
                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className="mt-3"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      wishlistIds.includes(String(selectedProduct._id))
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      <TrustedCustomer />
      <VideoSection />
    </div>
  );
}