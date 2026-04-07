'use client';

import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  ChevronDown,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";
<style jsx>{`
  .badge {
    position: absolute;
    top: -8px;
    right: -10px;
    background: black;
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 999px;
  }
`}</style>

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  const [showCategory, setShowCategory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };

    const updateWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    };

    const userData = JSON.parse(localStorage.getItem("user") || "null");
    setUser(userData);

    updateCart();
    updateWishlist();

    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("wishlistUpdated", updateWishlist);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("wishlistUpdated", updateWishlist);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
<div className="flex justify-between items-center px-3 sm:px-4 md:px-8 py-3 sm:py-4">

        {/* 🔥 LEFT */}
        <div className="flex items-center gap-4">
          {/* MOBILE MENU ICON */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(true)}
          >
            <Menu />
          </button>

          <a href="/">
           <img src="/roop-logo.png" className="h-7 sm:h-8 md:h-10" />
          </a>
        </div>

        {/* 🔥 DESKTOP NAV */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">

          <li><a href="/" className="hover:text-black">Home</a></li>

          {/* CATEGORY */}
          <li className="relative">
            <button
              onClick={() => setShowCategory(!showCategory)}
              className="flex items-center gap-1"
            >
              Category
              <ChevronDown className={`w-4 h-4 ${showCategory ? "rotate-180" : ""}`} />
            </button>

            {showCategory && (
              <div className="absolute top-10 bg-white shadow-lg rounded-xl p-3 w-50 ">
                <a href="/category/rings" className="block p-2 hover:bg-gray-100 rounded">Rings</a>
                <a href="/category/earrings" className="block p-2 hover:bg-gray-100 rounded">Earrings</a>
                <a href="/category/necklace" className="block p-2 hover:bg-gray-100 rounded">Necklace</a>
                <a href="/category/bracelet" className="block p-2 hover:bg-gray-100 rounded">Bracelet</a>
                <a href="/category/hair-accessories" className="block p-2 hover:bg-gray-100 rounded">Hair Accessories</a>
              </div>
            )}
          </li>

          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>

          {/* ❤️ */}
          <li className="relative">
            <a href="/wishlist"><Heart /></a>
            {wishlistCount > 0 && (
              <span className="badge">{wishlistCount}</span>
            )}
          </li>

          {/* 🛒 */}
          <li className="relative">
            <a href="/cart"><ShoppingCart /></a>
            {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </li>

          {/* 👤 PROFILE */}
          <li className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-1"
                >
                  <User className="w-5 h-5" />
                  {user.name}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl p-3 w-40 border">
                    <a href="/orders" className="block p-2 hover:bg-gray-100 rounded">
                      My Orders
                    </a>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left p-2 text-red-500 hover:bg-gray-100 rounded"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <a href="/login">
                <button className="bg-black text-white px-4 py-1.5 rounded-lg">
                  Login
                </button>
              </a>
            )}
          </li>

        </ul>

        {/* 🔥 RIGHT (MOBILE ICONS) */}
        <div className="flex md:hidden items-center gap-3">

          <a href="/wishlist" className="relative">
            <Heart />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </a>

          <a href="/cart" className="relative">
            <ShoppingCart />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </a>

        </div>
      </div>

      {/* 🔥 MOBILE MENU DRAWER */}
     {mobileMenu && (
  <div
    className="fixed inset-0 bg-black/40 z-50"
    onClick={() => setMobileMenu(false)} // 👈 outside click close
  >
    <div
      className="w-72 max-w-[80%] bg-white h-full p-5 shadow-xl animate-slideIn"
      onClick={(e) => e.stopPropagation()}
    >

            <button onClick={() => setMobileMenu(false)} className="mb-4">
              <X />
            </button>

            <div className="space-y-5 text-gray-800 font-medium mob-nav">

              <a href="/">Home</a>

              <div>
               <p className="font-semibold text-sm text-gray-500 uppercase cat-head">Categories</p>
                <div className="ml-3 space-y-3 text-sm text-gray-600 mobile-category">
                  <a href="/category/rings">Rings</a>
                  <a href="/category/earrings">Earrings</a>
                  <a href="/category/necklace">Necklace</a>
                  <a href="/category/bracelet">Bracelet</a>
                </div>
              </div>

              <a href="/wishlist">Wishlist</a>
              <a href="/cart">Cart</a>
{user ? (
  <div className="space-y-3">
    <p className="text-sm">Hi, {user.name}</p>

    <a href="/orders" className="block text-sm text-gray-700">
      My Orders 📦
    </a>

    <button
      onClick={handleLogout}
      className="text-red-500 text-left"
    >
      Logout
    </button>
  </div>
) : (
  <a href="/login">Login</a>
)}

            </div>
          </div>
        </div>
      )}

      {/* 🔥 BADGE STYLE */}
      <style jsx>{`
        .badge {
          position: absolute;
          top: -8px;
          right: -10px;
          background: black;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 999px;
        }
      `}</style>

    </header>
  );
}