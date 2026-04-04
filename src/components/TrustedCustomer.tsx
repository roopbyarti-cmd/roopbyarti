'use client';

import { Star } from "lucide-react";

export default function TrustedCustomer() {
  return (
    <div className="w-full bg-gray-100 py-10 text-center">

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
        5k+ Women Trust Roop By Arti
      </h2>

      {/* Rating Section */}
      <div className="flex items-center justify-center gap-2 mt-3">

        {/* Stars */}
        <div className="flex gap-1 text-black">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill="black" />
          ))}
        </div>

        {/* Rating Text */}
        <span className="text-gray-700 text-sm sm:text-base">
          4.87 ★ (1,002)
        </span>
      </div>

    </div>
  );
}