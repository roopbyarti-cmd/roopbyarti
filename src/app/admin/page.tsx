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
    "Content-Type": "application/json", // ✅ MUST
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
      body: JSON.stringify({ id }),
    });

    toast.success("Deleted ❌");
    fetchProducts();
  };
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
          onClick={() => {
            if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
              setIsAuthenticated(true);
            } else {
              alert("Wrong password ❌");
            }
          }}
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
          <div className="bg-white p-6 rounded-2xl shadow-md max-w-xl mb-8">
            <h1 className="text-xl font-semibold mb-4">Add Product</h1>

            <input
              placeholder="Name"
              className="border p-2 w-full mb-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Price"
              className="border p-2 w-full mb-2"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input
              placeholder="Image URLs (comma separated)"
              className="border p-2 w-full mb-2"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
            />

            <input
              placeholder="Category"
              className="border p-2 w-full mb-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <input
              placeholder="Stock"
              className="border p-2 w-full mb-4"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <input
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-4 py-2 rounded-lg"
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
                className="ml-3 px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>

          {/* 📦 PRODUCT LIST */}
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p: any) => (
              <div key={p._id} className="bg-white p-4 rounded-xl shadow">

                <img
                  src={p.images?.[0] || p.image}
                  className="h-40 w-full object-cover rounded-lg mb-3"
                />

                <h2 className="font-medium">{p.name}</h2>
                <p className="text-gray-500">₹{p.price}</p>
                <p className="text-sm">Stock: {p.stock}</p>
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
                  className="flex items-center gap-1 text-blue-500"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="mt-3 flex items-center gap-1 text-red-500"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

              </div>
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