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

  useEffect(() => {
    const updateWishlist = () => {
      const data = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistIds(data.map((item: any) => item._id));
    };

    updateWishlist();

    window.addEventListener("wishlistUpdated", updateWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlist);
    };
  }, []);


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
        stock: product.stock ?? 1 // ✅ FIXED
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("Added to cart");
  };
  const toggleWishlist = (product: any) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    const exists = wishlist.find((item: any) => item._id === product._id);

    if (exists) {
      wishlist = wishlist.filter((item: any) => item._id !== product._id);
    } else {
      wishlist.push(product);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // 🔥 notify header
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <div>
      {/* Banner */}
      <div className="banner-roop">
        <img src="/roop-by-arti-banner.png" />
      </div>

      {/* Categories */}
      <ExploreCategories />

      {/* Heading */}
      <h1 className="text-2xl font-bold text-center my-6">
        Roop's Bestsellers
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-10 mb-10">
        {products.map((p: any) => (
          <div
            key={p._id}
            onClick={() => router.push(`/product/${p._id}`)}
            className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group relative p-1.5"
          >
            {/* Image */}
            <div className="relative"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(p);
                setCurrentImage(0);
              }}
            >
              <img
                src={
                  encodeURI(
                    (p.images && p.images.length > 0
                      ? p.images[0]
                      : p.image) || "/no-image.png"
                  )
                }
                onError={(e: any) => {
                  e.target.src = "/no-image.png";
                }}
                className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group h-80 w-full object-cover"
              />
            </div>
            <div >
              {/* Content */}
              <h2 className="font-medium text-sm mt-3 text-gray-800">
                {p.name}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                ₹{p.price}
              </p>

              {/* Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p);
                }}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  const user = JSON.parse(localStorage.getItem("user") || "null");

                  if (!user) {
                    toast.success("Please login first");
                    window.location.href = "/login";
                    return;
                  }

                  toggleWishlist(p);
                }}
                className="absolute top-2 right-2 bg-white backdrop-blur p-2 pl-2.5 h-10 w-10 rounded-full shadow hover:scale-110 active:scale-125 transition"
              >
                <Heart
                  className={`w-5 h-5 transition ${wishlistIds.includes(p._id)
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-gray-400"
                    }`}
                />
              </button>
            </div>
          </div>

        ))}

      </div>
      <TrustedCustomer />
      <VideoSection />
      {/* 🔥 QUICK VIEW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-3xl relative" onClick={(e) => e.stopPropagation()}>

            {/* Close */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-3 text-xl"
            >
              ✖
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Images */}
              <div>
                <img
                  src={encodeURI(
                    selectedProduct.images?.[currentImage] ||
                    selectedProduct.image
                  )}
                  onError={(e: any) => {
                    e.target.src = "/no-image.png";
                  }}
                  className="w-full h-96 object-cover rounded-xl"
                />

                {/* Thumbnails */}
                <div className="flex gap-2 mt-3">
                  {(selectedProduct.images || [selectedProduct.image]).map(
                    (img: string, i: number) => (
                      <img
                        key={i}
                        src={encodeURI(img)}
                        onError={(e: any) => {
                          e.target.src = "/no-image.png";
                        }}
                        onClick={() => setCurrentImage(i)}
                        className={`h-16 w-16 object-cover rounded cursor-pointer border ${currentImage === i ? "border-black" : ""
                          }`}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Info */}
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedProduct.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  ₹{selectedProduct.price}
                </p>

                <button
                  onClick={() => addToCart(selectedProduct)}
                  className="mt-4 w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}