'use client';

import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, Tag } from "lucide-react";
import toast from "react-hot-toast";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  images?: string[];
  stock?: number;
};

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

useEffect(() => {
  const data = JSON.parse(localStorage.getItem("cart") || "[]");

  const fixed = data.map((item: any) => ({
    ...item,
    quantity: Math.min(item.quantity || 1, item.stock || 1),
  }));

  setCart(fixed);
}, []);

  const updateCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

const increaseQty = (i: number) => {
  const updated = [...cart];

  const stock = updated[i].stock ?? 1;

  if (updated[i].quantity < stock) {
    updated[i].quantity += 1;
    updateCart(updated);
  } else {
    toast.error(`Only ${stock} items available ❌`);
  }
};

  const decreaseQty = (i: number) => {
    const updated = [...cart];

    if (updated[i].quantity > 1) {
      updated[i].quantity -= 1;
    } else {
      updated.splice(i, 1);
      toast("Item removed");
    }

    updateCart(updated);
  };

  const removeItem = (i: number) => {
    const updated = [...cart];
    updated.splice(i, 1);
    updateCart(updated);
    toast("Removed from cart");
  };

  // 💰 CALCULATIONS
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  // 🎟️ APPLY COUPON
  const applyCoupon = () => {
    if (coupon === "ROOP10") {
      setDiscount(subtotal * 0.1);
      toast.success("Coupon applied 🎉");
    } else {
      toast.error("Invalid coupon ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-10 py-8">

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Your cart is empty 🛒</h2>
          <p className="text-gray-500 mb-4">Looks like you haven’t added anything yet</p>
          <a
            href="/"
            className="bg-black text-white px-6 py-3 rounded-full"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">

          {/* 🛍️ LEFT SIDE */}
          <div className="md:col-span-2 space-y-4">

            {cart.map((item, i) => {
              const img = item.images?.[0] || item.image;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition"
                >
                  {/* Image */}
                  <img
                    src={img}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="font-medium">{item.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      ₹{item.price}
                    </p>

                    {/* Qty */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => decreaseQty(i)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>
                      {item.stock !== undefined && (
  <p className="text-xs text-gray-400 mt-1">
    {item.stock - item.quantity > 0
      ? `${item.stock - item.quantity} left`
      : "Out of stock"}
  </p>
)}

<button
  onClick={() => increaseQty(i)}
  disabled={item.quantity >= (item.stock ?? 1)}
  className={`w-8 h-8 rounded-full border flex items-center justify-center ${
    !item.stock || item.quantity >= item.stock
      ? "cursor-not-allowed opacity-40"
      : "hover:bg-gray-100"
  }`}
>
  <Plus size={14} />
</button>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeItem(i)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}

          </div>

          {/* 💳 RIGHT SIDE */}
          <div className="bg-white p-6 rounded-2xl shadow-md h-fit sticky top-24">

            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

            {/* Coupon */}
            {/* <div className="flex gap-2 mb-4">
              <div className="flex items-center border rounded-lg px-2 flex-1">
                <Tag size={14} className="text-gray-400 mr-2" />
                <input
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full py-2 outline-none text-sm"
                />
              </div>

              <button
                onClick={applyCoupon}
                className="bg-black text-white px-4 rounded-lg text-sm"
              >
                Apply
              </button>
            </div> */}

            {/* Price */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <a
              href="/checkout"
              className="block mt-6 bg-black text-white text-center py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}