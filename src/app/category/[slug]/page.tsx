'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart, Search, SlidersHorizontal, X } from "lucide-react";
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
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // ✅ LOAD WISHLIST
  const loadWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.phone) return;

    const res = await fetch(`/api/wishlist?phone=${user.phone}`);
    const data = await res.json();

    setWishlistIds(data.map((item: any) => String(item._id)));
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
    };
  }, []);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((p: any) => p.category === slug);
        setProducts(filtered);
      });
  }, [slug]);

  // 🛒 ADD TO CART
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

  // ❤️ TOGGLE WISHLIST
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

      setWishlistIds(data.map((item: any) => String(item._id)));
      window.dispatchEvent(new Event("wishlistUpdated"));

      const exists = data.find((item: any) => item._id === product._id);

      toast.success(
        exists ? "Added to wishlist ❤️" : "Removed from wishlist ❌"
      );

    } catch (err) {
      console.error(err);
      toast.error("Error updating wishlist");
    }
  };

  const filteredProducts = products
    .filter((p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p: any) => p.price <= priceRange)
    .filter((p: any) =>
      activeCategory === "all"
        ? true
        : p.category === activeCategory
    )
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



      <div className="sticky sm:top-[70px] top-[52px] z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100">

        <div className="px-4 sm:px-1.5 py-4">

          {/* 🔥 FILTER BOX */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-5">

            {/* TOP ROW */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* 🔍 SEARCH */}
              <div className="relative w-full lg:w-1/3">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search luxury jewellery..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-sm transition"
                />
              </div>

              {/* 💰 PRICE */}
              <div className="flex flex-col w-full lg:w-1/4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Price Range</span>
                  <span className="font-medium text-black">₹{priceRange}</span>
                </div>

                <input
                  type="range"
                  min="100"
                  max="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              {/* 🔽 SORT */}
              <div className="w-full lg:w-1/5">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                >
                  <option value="">Sort by</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                </select>
              </div>

              {/* 🔄 RESET FILTER */}
              <button
                onClick={() => {
                  setSearch("");
                  setPriceRange(5000);
                  setSortOption("");
                  setActiveCategory("all");
                }}
                className="w-full lg:w-auto px-4 py-3 rounded-full border border-gray-200 bg-white text-sm font-medium shadow-sm hover:bg-black hover:text-white transition flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset Filters
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

        {filteredProducts.map((p: any) => (
          <div
            key={p._id}
            onClick={() => {
              if (p.stock === 0) return;
              router.push(`/product/${p._id}`);
            }}
            className={`relative bg-white rounded-xl p-3 shadow transition ${p.stock === 0
              ? "cursor-not-allowed"
              : "hover:shadow-lg cursor-pointer"
              }`}
          >

            {/* IMAGE CLICK → POPUP */}
            <div
              className="relative"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(p);
                setCurrentImage(0);
              }}
            >
              {p.stock === 0 && (
                <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                  SOLD OUT
                </div>
              )}

              <img
                src={p.images?.[0] || p.image}
                className={`h-80 w-full object-cover rounded-lg ${p.stock === 0 ? "opacity-50" : ""
                  }`}
              />
            </div>

            <h2 className="mt-3 text-sm font-medium">{p.name}</h2>
            <p className="text-gray-500">₹{p.price}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (p.stock === 0) return;
                addToCart(p);
              }}
              disabled={p.stock === 0}
              className={`w-full mt-3 py-2 rounded-lg ${p.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white"
                }`}
            >
              {p.stock === 0 ? "Sold Out" : "Add to Cart"}
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
                className={`w-5 h-5 transition ${wishlistIds.includes(String(p._id))
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400"
                  }`}
              />
            </button>

          </div>
        ))}

      </div>

      {/* 🔥 POPUP */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-[90%] max-w-3xl relative"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-4 text-xl"
            >
              ✖
            </button>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <img
                  src={
                    selectedProduct.images?.[currentImage] ||
                    selectedProduct.image
                  }
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {selectedProduct.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  ₹{selectedProduct.price}
                </p>

                <button
                  onClick={() => addToCart(selectedProduct)}
                  disabled={selectedProduct.stock === 0}
                  className={`mt-5 w-full py-3 rounded-xl ${selectedProduct.stock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white"
                    }`}
                >
                  {selectedProduct.stock === 0 ? "Sold Out" : "Add to Cart"}
                </button>

                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className="mt-3 w-full py-3 border rounded-xl"
                >
                  {wishlistIds.includes(String(selectedProduct._id))
                    ? "Remove from Wishlist ❤️"
                    : "Add to Wishlist 🤍"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}