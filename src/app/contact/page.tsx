'use client';

import TrustedCustomer from "@/components/TrustedCustomer";
import VideoSection from "@/components/Video";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Message sent 💌");
      setForm({ name: "", email: "", message: "" });
    } else {
      toast.error("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 sm:px-12 py-12">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* 🖼️ LEFT IMAGE */}
        <div className="hidden md:block">
          <img
            src="/contact.png"   // 👈 luxury model image
            className="w-full h-[500px] object-cover rounded-2xl shadow"
          />
        </div>

        {/* 📩 FORM */}
        <div className="bg-white p-8 rounded-2xl shadow">

          <h1 className="text-3xl font-bold mb-2">
            Get in Touch ✨
          </h1>

          <p className="text-gray-500 mb-6">
            We'd love to hear from you. Send us a message and we’ll respond soon.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <textarea
              placeholder="Your Message"
              className="w-full border p-3 rounded-lg h-32 focus:ring-2 focus:ring-black outline-none"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
            >
              {loading ? "Sending..." : "Send Message 🚀"}
            </button>

          </form>
          

        </div>
      

      </div>
      <br/><br/><br/>
  <TrustedCustomer/>
  <VideoSection/>
    </div>
  );
}