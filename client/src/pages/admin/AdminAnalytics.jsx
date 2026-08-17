import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { formatINR } from "../../utils/format.js";

export default function AdminAnalytics() {
  const [revenue, setRevenue] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    api.get("/admin/analytics/revenue").then((r) => setRevenue(r.data.data.revenue));
    api.get("/admin/analytics/new-customers").then((r) => setNewCustomers(r.data.data.newCustomers));
    api.get("/admin/analytics/top-products").then((r) => setTopProducts(r.data.data.topProducts));
  }, []);

  const totalRevenue = revenue.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = revenue.reduce((s, r) => s + r.orders, 0);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif mb-8">Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white/5 border border-white/10 p-5">
          <div className="text-xs text-white/50 mb-2">Total Revenue</div>
          <div className="text-xl font-serif">{formatINR(totalRevenue)}</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-5">
          <div className="text-xs text-white/50 mb-2">Total Orders</div>
          <div className="text-xl font-serif">{totalOrders}</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-5">
          <div className="text-xs text-white/50 mb-2">Average Order Value</div>
          <div className="text-xl font-serif">{formatINR(Math.round(avgOrderValue))}</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 mb-8">
        <h2 className="text-sm mb-4 text-white/70">Monthly revenue</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 text-xs">
              <th className="pb-2">Month</th><th className="pb-2">Orders</th><th className="pb-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {revenue.map((r) => (
              <tr key={r._id} className="border-t border-white/10">
                <td className="py-2">{r._id}</td>
                <td className="py-2">{r.orders}</td>
                <td className="py-2">{formatINR(r.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 p-6">
          <h2 className="text-sm mb-4 text-white/70">Best-selling products</h2>
          {topProducts.map((p) => (
            <div key={p._id} className="flex justify-between text-sm py-1.5 border-b border-white/5">
              <span>{p.name}</span><span className="text-white/50">{p.unitsSold} sold</span>
            </div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 p-6">
          <h2 className="text-sm mb-4 text-white/70">New customers by month</h2>
          {newCustomers.map((c) => (
            <div key={c._id} className="flex justify-between text-sm py-1.5 border-b border-white/5">
              <span>{c._id}</span><span className="text-white/50">{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
