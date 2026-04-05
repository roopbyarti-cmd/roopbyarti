'use client';

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user?.phone) {
      setLoading(false);
      return;
    }

    fetch(`/api/my-orders?phone=${user.phone}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-20">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-500">
        No orders found 😢
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6 text-center">
        My Orders 📦
      </h1>

      <div className="space-y-6">
        {orders.map((o: any) => (
          <div key={o._id} className="bg-white p-5 rounded-2xl shadow">

            {/* TOP */}
            <div className="flex justify-between mb-3">
              <div>
                <p className="font-semibold">
                  Order ID: {o.orderId}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>

              <p className="font-bold">₹{o.total}</p>
            </div>

            {/* ITEMS */}
            <div className="text-sm text-gray-600">
              {o.items.map((item: any, i: number) => (
                <p key={i}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            {/* STATUS */}
            <div className="mt-4">
              <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                {o.status || "Pending"}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}