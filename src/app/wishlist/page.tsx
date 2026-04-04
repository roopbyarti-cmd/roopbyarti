'use client';

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(data);
  }, []);

  // 🔥 REMOVE ITEM
  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // 🔥 ADD TO CART
  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItem = cart.find((item: any) => item._id === product._id);

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
        <p className="text-center text-gray-500">No items yet</p>
      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-10">

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

                {/* 🔥 MOVE TO CART */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                  }}
                  className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-black to-gray-800 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition"
                >
                  Move to Cart
                </button>
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(p._id);
                }}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-md hover:scale-110 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="black"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 7h12M9 7V5h6v2m-7 4v6m4-6v6m4-6v6M4 7h16l-1 14H5L4 7z"
                  />
                </svg>
              </button>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* 🔥 QUICK VIEW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">

          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-3xl relative">

            {/* CLOSE */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-4 text-xl"
            >
              ✖
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* IMAGES */}
              <div>
                <img
                  src={encodeURI(
                    selectedProduct.images?.[currentImage] ||
                    selectedProduct.image
                  )}
                  onError={(e: any) => (e.target.src = "/no-image.png")}
                  className="w-full h-96 object-cover rounded-xl"
                />

                <div className="flex gap-2 mt-3">
                  {(selectedProduct.images || [selectedProduct.image]).map(
                    (img: string, i: number) => (
                      <img
                        key={i}
                        src={encodeURI(img)}
                        onClick={() => setCurrentImage(i)}
                        className={`h-16 w-16 object-cover rounded cursor-pointer border ${
                          currentImage === i ? "border-black" : ""
                        }`}
                      />
                    )
                  )}
                </div>
              </div>

              {/* INFO */}
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedProduct.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  ₹{selectedProduct.price}
                </p>

                {/* 🔥 BUTTONS */}
                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-black to-gray-800 text-white font-medium shadow-md hover:shadow-lg transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() =>
                      removeFromWishlist(selectedProduct._id)
                    }
                    className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
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