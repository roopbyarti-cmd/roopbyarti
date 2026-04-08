'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState(5000);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // 🔥 IMPORTANT
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // =========================
  // ✅ LOAD WISHLIST FROM DB
  // =========================
  const loadWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.phone) return;

    const res = await fetch(`/api/wishlist?phone=${user.phone}`);
    const data = await res.json();

    setWishlistIds(data.map((item: any) => item._id));
  };

  useEffect(() => {
    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
    };
  }, []);

  // =========================
  // 🔥 FETCH PRODUCTS
  // =========================
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((p: any) => p.category === slug);
        setProducts(filtered);
      });
  }, [slug]);

  // =========================
  // 🛒 ADD TO CART
  // =========================
  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProduct = cart.find(
      (item: any) => item._id === product._id
    );

    if (existingProduct) {
      if (existingProduct.quantity < existingProduct.stock) {
        existingProduct.quantity += 1;
      } else {
        toast.error("Stock limit reached ❌");
        return;
      }
    } else {
      cart.push({
        ...product,
        quantity: 1,
        stock: product.stock ?? 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("Added to cart");
  };

  // =========================
  // ❤️ FINAL TOGGLE WISHLIST
  // =========================
  const toggleWishlist = async (product: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user?.phone) {
      toast.error("Login required");
      return;
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: String(user.phone),
          product: {
            _id: String(product._id),
            name: product.name,
            price: product.price,
            image: product.image || product.images?.[0],
          }
        })
      });

      const data = await res.json();

      // ✅ UPDATE IDS (IMPORTANT FOR RED HEART)
      setWishlistIds(data.map((item: any) => item._id));

      // ✅ HEADER UPDATE
      window.dispatchEvent(new Event("wishlistUpdated"));

      // ✅ TOAST
      const exists = data.find((item: any) => item._id === product._id);

      toast.success(
        exists ? "Added to wishlist ❤️" : "Removed from wishlist ❌"
      );

    } catch (err) {
      console.error(err);
      toast.error("Error updating wishlist");
    }
  };

  // =========================
  // 🔍 FILTER
  // =========================
  const filteredProducts = products
    .filter((p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p: any) => p.price <= priceRange)
    .sort((a: any, b: any) => {
      if (sortOption === "low") return a.price - b.price;
      if (sortOption === "high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="px-10 py-8">

      <h1 className="text-2xl font-bold mb-6 capitalize text-center">
        {slug}
      </h1>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {filteredProducts.map((p: any) => (
          <div
            key={p._id}
            onClick={() => router.push(`/product/${p._id}`)}
            className="relative bg-white rounded-xl p-3 shadow hover:shadow-lg cursor-pointer"
          >

            <img
              src={p.images?.[0] || p.image}
              className="h-80 w-full object-cover rounded-lg"
            />

            <h2 className="mt-3 text-sm font-medium">{p.name}</h2>
            <p className="text-gray-500">₹{p.price}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(p);
              }}
              className="w-full mt-3 py-2 bg-black text-white rounded-lg"
            >
              Add to Cart
            </button>

            {/* ❤️ HEART */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(p);
              }}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
            >
              <Heart
                className={`w-5 h-5 transition ${
                  wishlistIds.includes(p._id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                }`}
              />
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}