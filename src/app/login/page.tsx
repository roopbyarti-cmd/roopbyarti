'use client';

import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const url = isLogin ? "/api/login" : "/api/register";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (data.error) {
      toast.success(data.error);
      return;
    }

    // ✅ Save user
    localStorage.setItem("user", JSON.stringify(data));

    toast.success("Welcome");

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-2xl shadow-md w-[90%] max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <input
            placeholder="Name"
            className="border p-3 w-full mb-3 rounded-lg"
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          className="border p-3 w-full mb-3 rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-3 rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-3 rounded-xl mt-2"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="text-center mt-4 cursor-pointer text-sm text-gray-600"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "New user? Register here"
            : "Already have account? Login"}
        </p>

      </div>
    </div>
  );
}