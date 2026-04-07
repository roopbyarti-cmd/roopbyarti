'use client';

import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const handleLogin = () => {
    // ✅ validation
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Enter valid 10-digit phone number");
      return;
    }

    // ✅ save user
    const userData = {
      name: name || "User",
      phone,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    toast.success("Login successful 🎉");

    // 👉 redirect to orders
    window.location.href = "/orders";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-2xl shadow-md w-[90%] max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <input
          placeholder="Your Name (optional)"
          className="border p-3 w-full mb-3 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Enter Phone Number"
          className="border p-3 w-full mb-3 rounded-lg"
          value={phone}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 10) setPhone(val);
          }}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded-xl mt-2"
        >
          Continue
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Use same phone number to see your orders & wishlist
        </p>

      </div>
    </div>
  );
}