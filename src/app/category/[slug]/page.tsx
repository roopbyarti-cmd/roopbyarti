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

  // ✅ YAHAN DALNA HAI (useEffect ke bahar)
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


  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  useEffect(() => {
    const updateWishlist = () => {
      const data = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistIds(data.map((item: any) => item._id));
    };

    updateWishlist();

    window.addEventListener("wishlistUpdated", updateWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlist);
    };
  }, []);
  // 🔥 Fetch category products
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((p: any) => p.category === slug);
        setProducts(filtered);
      });
  }, [slug]);

  // 🛒 Add to cart
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
        stock: product.stock ?? 1 // ✅ FIXED
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("Added to cart");
  };
  const toggleWishlist = (product: any) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    const exists = wishlist.find((item: any) => item._id === product._id);

    if (exists) {
      wishlist = wishlist.filter((item: any) => item._id !== product._id);
    } else {
      wishlist.push(product);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // 🔥 notify header
    window.dispatchEvent(new Event("wishlistUpdated"));
  };
  return (
    <div className="px-10 py-8">

      <h1 className="text-2xl font-bold mb-6 capitalize text-center">
        {slug}
      </h1>


    <div className="sticky top-[60px] z-40 bg-white/90 backdrop-blur-md shadow-md rounded-xl sm:rounded-2xl px-3 py-3 sm:p-5 mx-2 sm:mx-10 mb-6 border border-gray-100">

       

          {/* TOP ROW */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* 🔍 SEARCH */}
            <div className="relative w-full lg:w-1/3">
              <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search luxury jewellery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-10 pr-3 py-2 rounded-lg sm:rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none text-sm"
              />
            </div>

            {/* 💰 PRICE */}
            <div className="flex flex-col w-full ">
              <div className="flex justify-between text-[11px] sm:text-xs text-gray-500 mb-1">
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
            <div className="flex gap-2 w-full lg:w-1/4">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-2 rounded-lg sm:rounded-full border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-black outline-none"
              >
                <option value="">Sort by</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
              </select>
            </div>


            <button
              onClick={() => {
                setSearch("");
                setPriceRange(5000);
                setSortOption("");
                setActiveCategory("all");
              }}
              className="px-3 py-2 rounded-lg border text-xs sm:text-sm text-gray-600 hover:bg-gray-100 transition whitespace-nowrap"
            >
              Reset Filter

            </button>
          </div>



      
      </div>
      {/* ✅ PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 px-4 sm:px-10 mb-10">
        {filteredProducts.map((p: any) => {

          const mainImage = p.images?.[0] || p.image; // 🔥 FIX

          return (
            <div
              key={p._id}
              onClick={() => router.push(`/product/${p._id}`)}
              className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group relative p-1.5"
            >
              {/* Image */}
              <div className="relative" onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(p);
                setCurrentImage(0);
              }}>
                <img
                  src={mainImage}
                  className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group h-56 sm:h-64 md:h-72 lg:h-80mt-4 py-2.5 w-full object-cover"
                />
              </div>
              <div>
                {/* Content */}
                <h2 className="font-medium text-sm mt-3 text-gray-800">
                  {p.name}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  ₹{p.price}
                </p>

                {/* Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 prevent popup open
                    addToCart(p);
                  }}
                  className="w-full mt-3 sm:mt-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300"
                >
                  Add to Cart
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    const user = JSON.parse(localStorage.getItem("user") || "null");

                    if (!user) {
                      toast.success("Please login first");
                      window.location.href = "/login";
                      return;
                    }

                    toggleWishlist(p);
                  }}
                  className="absolute top-2 right-2 bg-white backdrop-blur p-2 pl-2.5 h-10 w-10 rounded-full shadow hover:scale-110 active:scale-125 transition"
                >
                  <Heart
                    className={`w-5 h-5 transition ${wishlistIds.includes(p._id)
                      ? "fill-red-500 text-red-500 scale-110"
                      : "text-gray-400"
                      }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ POPUP MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedProduct(null)}>

          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-3xl relative" onClick={(e) => e.stopPropagation()}>

            {/* Close */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-3 text-xl"
            >
              ✖
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Images */}
              <div>
                <img
                  src={
                    selectedProduct.images?.[currentImage] ||
                    selectedProduct.image
                  }
                  className="w-full h-96 object-cover rounded-xl"
                />

                {/* Thumbnails */}
                <div className="flex gap-2 mt-3">
                  {(selectedProduct.images || [selectedProduct.image]).map(
                    (img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        onClick={() => setCurrentImage(i)}
                        className={`h-16 w-16 object-cover rounded cursor-pointer border ${currentImage === i ? "border-black" : ""
                          }`}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Info */}
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedProduct.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  ₹{selectedProduct.price}
                </p>

                <button
                  onClick={() => addToCart(selectedProduct)}
                  className="mt-4 w-full py-3 bg-black text-white rounded-xl"
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}