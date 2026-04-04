'use client';

import { FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 sm:px-12 py-10 mt-16">

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
        <div>
          <img
            src="/roop-logo-white.png"   
            alt="Roop By Arti"
            className="h-10 mb-4"
          />

          <p className="text-sm text-gray-400 leading-relaxed">
            Discover timeless jewellery crafted to elevate your everyday elegance ✨
          </p>
        </div>

        {/* 🔗 QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="/about" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* 📜 POLICIES */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Policies</h3>

          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="/privacy-policy" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/shipping-policy" className="hover:text-white transition">
                Shipping & Delivery Policy
              </a>
            </li>
            <li>
              <a href="/return-policy" className="hover:text-white transition">
                Exchange & Return Policy
              </a>
            </li>
          </ul>
        </div>

        {/* 📱 SOCIAL */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>

          <div className="flex gap-4">

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/18Rbsj3Xkk/"
              target="_blank"
              className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition"
            >
                <FaFacebook size={18} />
              
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/roop_by_arti?igsh=Ynpkemx5Mm15YWhw"
              target="_blank"
              className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition"
              rel="noopener noreferrer"
            >
             <FaInstagram size={18} />
            </a>

          </div>
        </div>

      </div>

      {/* 🔽 BOTTOM */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Roop By Arti. All rights reserved.
      </div>

    </footer>
  );
}