export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Shipping & Delivery Policy</h1>

      <p className="text-gray-600 mb-4">
        We process all orders within 24-48 hours.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Delivery Time</h2>
      <p className="text-gray-600">
        Delivery takes 3-7 working days depending on your location.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Charges</h2>
      <p className="text-gray-600">
        Free shipping above ₹999. Otherwise ₹99 delivery charge.
      </p>
    </div>
  );
}