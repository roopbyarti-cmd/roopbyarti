'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState(0);

  // ✅ LOAD WISHLIST FROM DB
  const fetchWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user?.phone) return;

    const res = await fetch(`/api/wishlist?phone=${user.phone}`);
    const data = await res.json();

    setWishlist(data);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ✅ TOGGLE (ADD / REMOVE)
  const toggleWishlist = async (product: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user?.phone) {
      toast.error("Login required");
      return;
    }

    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ FIX
      },
      body: JSON.stringify({
        phone: user.phone,
        product,
      }),
    });

    const data = await res.json();

    setWishlist(data); // ✅ sync with DB
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // ✅ REMOVE (CALL SAME API)
  const removeFromWishlist = (product: any) => {
    toggleWishlist(product); // 🔥 reuse API
    toast.success("Removed from wishlist");
  };

  // 🛒 ADD TO CART
  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItem = cart.find(
      (item: any) => item._id === product._id
    );

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("Added to cart");
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6 text-center">
        My Wishlist ❤️
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">
          No items yet
        </p>
      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 sm:px-10">

          {wishlist.map((p: any) => (
            <div
              key={p._id}
              onClick={() => {
                setSelectedProduct(p);
                setCurrentImage(0);
              }}
              className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden relative group"
            >

              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src={encodeURI(p.images?.[0] || p.image || "/no-image.png")}
                  onError={(e: any) => (e.target.src = "/no-image.png")}
                  className="h-52 w-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h2 className="text-sm font-medium text-gray-800">
                  {p.name}
                </h2>

                <p className="text-gray-600 mt-1 font-semibold">
                  ₹{p.price}
                </p>

                {/* MOVE TO CART */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                  }}
                  className="mt-3 w-full py-2 rounded-xl bg-black text-white text-sm"
                >
                  Move to Cart
                </button>

                {/* REMOVE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(p);
                  }}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* 🔥 POPUP */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
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

                <div className="flex gap-2 mt-3">
                  {(selectedProduct.images || [selectedProduct.image]).map(
                    (img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        onClick={() => setCurrentImage(i)}
                        className={`h-16 w-16 rounded cursor-pointer ${
                          currentImage === i ? "border-2 border-black" : ""
                        }`}
                      />
                    )
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {selectedProduct.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  ₹{selectedProduct.price}
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="flex-1 py-3 bg-black text-white rounded-xl"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishlist(selectedProduct)}
                    className="flex-1 py-3 border rounded-xl"
                  >
                    Remove
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}