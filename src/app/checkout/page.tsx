'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function Checkout() {
  const validateForm = () => {
  // Name
  if (!name.trim()) {
    toast.error("Enter your name");
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Enter valid email");
    return false;
  }

  // Phone (10 digit only)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    toast.error("Enter valid 10-digit phone number");
    return false;
  }

  // Address
  if (address.trim().length < 10) {
    toast.error("Enter proper address");
    return false;
  }

  return true;
};
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  // Add these lines below your subtotal calculation
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;  // 👈 added shipping logic
  const total = subtotal + shipping;          // 👈 include shipping in total

  const [showQR, setShowQR] = useState(false);
  const [utr, setUtr] = useState("");

  const ADMIN_PHONE = "919650758474"; // 👈 apna number (without +)
  const upiId = "9650758474@ptyes"; // 👈 apni UPI ID daalo
  const upiName = "Roop by Arti"; // 👈 business name

  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    upiName
  )}&am=${total}&cu=INR`;


  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (key) {
      emailjs.init(key);
    }

    const data = JSON.parse(localStorage.getItem("cart") || "[]");

    const fixedData = data.map((item: any) => ({
      ...item,
      quantity: item.quantity || 1,
    }));

    setCart(fixedData);
  }, []);



  // 👉 STEP 1
  const handleProceed = () => {
   if (!validateForm()) return;

    setShowQR(true);
  };


  const sendWhatsApp = () => {
    const itemsText = cart
      .map((item) => `${item.name} x${item.quantity}`)
      .join("%0A");

    const message = `🛒 *New Order Received* %0A
👤 Name: ${name} %0A
📧 Email: ${email} %0A
📱 Phone: ${phone} %0A
🏠 Address: ${address} %0A
💰 Total: ₹${total} %0A
🔢 UTR: ${utr} %0A
📦 Items:%0A${itemsText}`;

    // 👉 Admin WhatsApp
    window.open(
      `https://wa.me/${ADMIN_PHONE}?text=${message}`,
      "_blank"
    );

    // 👉 Customer WhatsApp
    window.open(
      `https://wa.me/${phone}?text=Hi ${name}, your order of ₹${total} is received! 🎉`,
      "_blank"
    );
  };

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  const handleSubmitPayment = async () => {
    const generatedOrderId = "ORD" + Date.now();
    if (!/^[0-9]{12}$/.test(utr)) {
      toast.error("Enter valid UTR");
      return;
    }





    await fetch("/api/order", {
      method: "POST",
      body: JSON.stringify({
        orderId: generatedOrderId,
        name,
        email,
        address,
        phone,
        items: cart,
        total,
        utr,
      }),
    });
    localStorage.setItem(
      "user",
      JSON.stringify({ name, email, phone })
    );

    // ✅ WHATSAPP SEND
    sendWhatsApp();

    toast.success("Order placed ✅");

    localStorage.removeItem("cart");

    setOrderId(generatedOrderId);
    setOrderPlaced(true);
  };
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow text-center max-w-md w-full">

          <h1 className="text-2xl font-bold mb-3">
            🎉 Thank You for your Order!
          </h1>

          <p className="text-gray-600 mb-4">
            Your order has been placed successfully.
          </p>

          <p className="font-semibold text-lg mb-2">
            Order ID: <span className="text-green-600">{orderId}</span>
          </p>

          <p className="text-sm text-gray-500 mb-6">
            You can track your order in "My Orders"
          </p>

          <a
            href="/orders"
            className="block bg-black text-white py-3 rounded-xl mb-3"
          >
            View My Orders
          </a>

          <a
            href="/"
            className="block border py-3 rounded-xl"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Checkout 💳
      </h1>

      {/* ITEMS */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <h2 className="font-semibold mb-3">Your Items</h2>

        {cart.map((item, i) => (
          <p key={i} className="text-sm text-gray-600">
            {item.name} × {item.quantity} = ₹{item.price * item.quantity}
          </p>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-4 text-center">
        Total: ₹{total} {shipping > 0 && `(including ₹${shipping} shipping)`}
      </h2>

      {/* FORM */}
      <div className="space-y-3">
        <input
          placeholder="Full Name"
          className="border p-3 w-full rounded-lg"
          onChange={(e) => setName(e.target.value)}
        />

       <input
  placeholder="Email"
  className="border p-3 w-full rounded-lg"
  value={email}
  onChange={(e) => setEmail(e.target.value.trim())}
/>

        <input
          placeholder="Address"
          className="border p-3 w-full rounded-lg"
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
  placeholder="Phone"
  className="border p-3 w-full rounded-lg"
  value={phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); // only numbers
    if (value.length <= 10) {
      setPhone(value);
    }
  }}
/>
      </div>

      {!showQR && (
        <button
          onClick={handleProceed}
          className="bg-black text-white w-full py-3 mt-5 rounded-xl"
        >
          Proceed to Pay 💳
        </button>
      )}

      {showQR && (
        <div className="mt-8 text-center bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold text-lg mb-2">
            Scan & Pay via Paytm
          </h3>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
              upiLink
            )}`}
            className="w-52 mx-auto my-4 rounded-lg"
          />
          <p className="text-red-500 text-sm">
            ⚠️ Fake UTR will lead to order cancellation
          </p>
          <input
            placeholder="Enter 12-digit UTR"
            className="border p-3 w-full mb-3 rounded-lg"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
          />



          <button
            onClick={handleSubmitPayment}
            disabled={!utr || utr.length !== 12}
            className={`w-full py-3 rounded-xl ${utr.length === 12
                ? "bg-green-600 text-white"
                : "bg-gray-300"
              }`}
          >
            Submit Payment ✅
          </button>
        </div>
      )}
    </div>
  );
}