'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Truck, Pencil, Trash2 } from "lucide-react";


export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    images: "", // 👉 comma separated
    category: "",
    stock: "",
    description: "",
  });

  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ORDERS_PER_PAGE = 10;
  const [activeCategoryTab, setActiveCategoryTab] = useState("all");
  const PRODUCTS_PER_PAGE = 6;
  const [productPage, setProductPage] = useState(1);
  const filteredProducts = products.filter((p: any) =>
    activeCategoryTab === "all"
      ? true
      : p.category === activeCategoryTab
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * PRODUCTS_PER_PAGE,
    productPage * PRODUCTS_PER_PAGE
  );

  // 🔥 FETCH ORDERS
  const fetchOrders = (page = 1) => {
    fetch(`/api/all-orders?page=${page}&limit=${ORDERS_PER_PAGE}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders);
        setTotalOrders(data.total);
      });
  };

  // 🔥 FETCH PRODUCTS
  const fetchProducts = () => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
    { cache: "no-store" };
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // 🔥 UPDATE ORDER
  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/update-order", {
      method: "POST",
        headers: {
    "Content-Type": "application/json",
    "authorization": localStorage.getItem("adminToken") || ""
  },
      body: JSON.stringify({ id, status }),
    });

    toast.success(`Order ${status}`);
    fetchOrders();
  };

  // 🔥 ADD PRODUCT
  const handleSubmit = async () => {
    const imageArray = form.images.split(",").map(i => i.trim());

    if (editingId) {
      // 🔥 UPDATE
      await fetch("/api/admin/update-product", {
        method: "POST",
          headers: {
    "Content-Type": "application/json",
    "authorization": localStorage.getItem("adminToken") || ""
  },
       
        body: JSON.stringify({
          id: editingId,
          name: form.name,
          price: Number(form.price),
          images: imageArray,
          category: form.category,
          stock: Number(form.stock),
          description: form.description,
        }),
      });

      toast.success("Product Updated ✅");
      setEditingId(null);

    } else {
      // ➕ ADD
      await fetch("/api/admin/add-product", {
        method: "POST",
        headers: {
    "Content-Type": "application/json",
    "authorization": localStorage.getItem("adminToken") || ""
  },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          images: imageArray,
          category: form.category,
          stock: Number(form.stock),
          description: form.description,
          isFeatured: true,
        }),
      });

      toast.success("Product Added ✅");
    }

    // 🔄 reset form
    setForm({
      name: "",
      price: "",
      images: "",
      category: "",
      stock: "",
      description: "",
    });

    fetchProducts();
  };

  // 🔥 DELETE PRODUCT
  const deleteProduct = async (id: string) => {
    await fetch("/api/admin/delete-product", {
      method: "POST",
        headers: {
    "Content-Type": "application/json",
    "authorization": localStorage.getItem("adminToken") || ""
  },
      body: JSON.stringify({ id }),
    });

    toast.success("Deleted ❌");
    fetchProducts();
  };
  const handleAdminLogin = async () => {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  });

  const data = await res.json();

  if (data.error) {
    alert("Wrong password ❌");
    return;
  }

  // ✅ save token
  localStorage.setItem("adminToken", data.token);

  setIsAuthenticated(true);
};

useEffect(() => {
  const token = localStorage.getItem("adminToken");

  if (token === "admin-secret-token") {
    setIsAuthenticated(true);
  }
}, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Admin Login 🔐
          </h2>

          <input
            type="password"
            placeholder="Enter password"
            className="border p-2 w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleAdminLogin}
            className="w-full bg-black text-white py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 🔥 TABS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-lg ${activeTab === "products" ? "bg-black text-white" : "bg-gray-200"
            }`}
        >
          Products Dashboard
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-lg ${activeTab === "orders" ? "bg-black text-white" : "bg-gray-200"
            }`}
        >
          Orders Dashboard
        </button>
      </div>

      {/* ================= PRODUCTS ================= */}
      {activeTab === "products" && (
        <>
          {/* ➕ ADD PRODUCT */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">

            <h1 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Product" : "Add Product"}
            </h1>

            {/* 🔥 ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input
                placeholder="Name"
                className="border p-2 rounded-lg"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Price"
                className="border p-2 rounded-lg"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />

              <input
                placeholder="Stock"
                className="border p-2 rounded-lg"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>

            {/* 🔥 ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input
                placeholder="Image URLs (comma separated)"
                className="border p-2 rounded-lg"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
              />

              <input
                placeholder="Category"
                className="border p-2 rounded-lg"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            {/* 🔥 ROW 3 (FULL WIDTH) */}
            <textarea
              placeholder="Description"
              className="border p-2 rounded-lg w-full mb-4"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* 🔥 BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      name: "",
                      price: "",
                      images: "",
                      category: "",
                      stock: "",
                      description: "",
                    });
                  }}
                  className="px-6 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>

          </div>



          <div className="flex gap-2 mb-6 flex-wrap">
            {["all", "rings", "earrings", "necklace", "bracelet", "hair-accessories"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategoryTab(cat);
                  setProductPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-sm ${activeCategoryTab === cat
                    ? "bg-black text-white"
                    : "bg-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>






          {/* 📦 PRODUCT LIST */}
          <div className="space-y-4">

            {paginatedProducts.map((p: any) => (
              <div
                key={p._id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >

                {/* 🔥 LEFT SIDE */}
                <div className="flex items-center gap-4">

                  {/* IMAGE */}
                  <img
                    src={p.images?.[0] || p.image}
                    className="h-16 w-16 object-cover rounded-lg border"
                  />

                  {/* INFO */}
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {p.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      ₹{p.price} • Stock: {p.stock}
                    </p>

                    {/* 🔥 LOW STOCK WARNING */}
                    {p.stock <= 2 && (
                      <p className="text-xs text-red-500 mt-1">
                        Low stock ⚠️
                      </p>
                    )}
                  </div>
                </div>

                {/* 🔥 RIGHT SIDE BUTTONS */}
                <div className="flex items-center gap-3">

                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setEditingId(p._id);

                      setForm({
                        name: p.name,
                        price: String(p.price),
                        images: p.images?.join(",") || p.image || "",
                        category: p.category,
                        stock: String(p.stock),
                        description: p.description || "",
                      });

                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                </div>
              </div>
            ))}

          </div>





          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setProductPage(i + 1)}
                className={`px-3 py-1 rounded ${productPage === i + 1
                    ? "bg-black text-white"
                    : "bg-gray-200"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ================= ORDERS ================= */}
      {activeTab === "orders" && (
        <>
          <h1 className="text-2xl font-bold mb-6">
            Orders Dashboard 📦
          </h1>

          <div className="grid gap-6">
            {orders.map((o: any) => (
              <div key={o._id} className="bg-white p-5 rounded-2xl shadow">

                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{o.name}</p>
                    <p className="text-sm">{o.phone}</p>
                  </div>

                  <p className="font-bold">₹{o.total}</p>
                </div>

                <div className="mt-3">
                  {o.items.map((item: any, i: number) => (
                    <p key={i}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => updateStatus(o._id, "approved")} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                  <button onClick={() => updateStatus(o._id, "rejected")} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                  <button onClick={() => updateStatus(o._id, "shipped")} className="bg-blue-500 text-white px-3 py-1 rounded">Ship</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}