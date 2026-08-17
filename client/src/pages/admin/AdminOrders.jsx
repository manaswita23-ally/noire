import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { formatINR, formatDate } from "../../utils/format.js";

const STATUSES = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/orders/admin/all", { params: { status: statusFilter, limit: 50 } }).then((res) => {
      setOrders(res.data.data.orders);
      setLoading(false);
    });
  };

  useEffect(load, [statusFilter]);

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    load();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-sm px-3 py-2"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-white/40 text-xs border-b border-white/10">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-white/5">
                <td className="p-4">{o._id.slice(-8).toUpperCase()}</td>
                <td className="p-4 text-white/70">{o.user?.name}</td>
                <td className="p-4 text-white/70">{formatDate(o.createdAt)}</td>
                <td className="p-4">{formatINR(o.total)}</td>
                <td className="p-4 text-white/70">{o.paymentStatus}</td>
                <td className="p-4">
                  <select
                    value={o.orderStatus}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="bg-white/5 border border-white/10 px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && orders.length === 0 && (
          <p className="p-8 text-center text-white/40 text-sm">No orders found.</p>
        )}
      </div>
    </div>
  );
}
