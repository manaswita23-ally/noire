import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { formatINR } from "../../utils/format.js";

const CARD_CONFIG = [
  { key: "totalRevenue", label: "Total Revenue", format: formatINR },
  { key: "totalOrders", label: "Total Orders" },
  { key: "totalCustomers", label: "Total Customers" },
  { key: "totalProducts", label: "Total Products" },
  { key: "pendingOrders", label: "Pending Orders" },
  { key: "lowStockProducts", label: "Low Stock Products" },
];

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);

  useEffect(() => {
    api.get("/admin/analytics/overview").then((r) => setData(r.data.data));
    api.get("/admin/analytics/revenue").then((r) => setRevenue(r.data.data.revenue));
    api.get("/admin/analytics/top-products").then((r) => setTopProducts(r.data.data.topProducts));
    api.get("/admin/analytics/sales-by-category").then((r) => setSalesByCategory(r.data.data.salesByCategory));
  }, []);

  const maxRevenue = Math.max(...revenue.map((r) => r.revenue), 1);
  const maxCategorySale = Math.max(...salesByCategory.map((c) => c.revenue), 1);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif mb-8">Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {CARD_CONFIG.map((c) => (
          <div key={c.key} className="bg-white/5 border border-white/10 p-5">
            <div className="text-xs text-white/50 mb-2">{c.label}</div>
            <div className="text-2xl font-serif">
              {data ? (c.format ? c.format(data[c.key]) : data[c.key]) : "—"}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white/5 border border-white/10 p-6">
          <h2 className="text-sm mb-6 text-white/70">Revenue over time</h2>
          <div className="flex items-end gap-2 h-40">
            {revenue.map((r) => (
              <div key={r._id} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-wine"
                  style={{ height: `${(r.revenue / maxRevenue) * 100}%`, minHeight: 2 }}
                  title={formatINR(r.revenue)}
                />
                <span className="text-[9px] text-white/40 rotate-0">{r._id}</span>
              </div>
            ))}
            {revenue.length === 0 && <p className="text-xs text-white/40">No revenue data yet.</p>}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6">
          <h2 className="text-sm mb-6 text-white/70">Sales by category</h2>
          <div className="space-y-3">
            {salesByCategory.map((c) => (
              <div key={c._id}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{c._id}</span>
                  <span className="text-white/50">{formatINR(c.revenue)}</span>
                </div>
                <div className="h-1.5 bg-white/10">
                  <div className="h-1.5 bg-wine" style={{ width: `${(c.revenue / maxCategorySale) * 100}%` }} />
                </div>
              </div>
            ))}
            {salesByCategory.length === 0 && <p className="text-xs text-white/40">No sales data yet.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-6">
        <h2 className="text-sm mb-4 text-white/70">Top products</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 text-xs">
              <th className="pb-2">Product</th>
              <th className="pb-2">Units Sold</th>
              <th className="pb-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr key={p._id} className="border-t border-white/10">
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.unitsSold}</td>
                <td className="py-2">{formatINR(p.revenue)}</td>
              </tr>
            ))}
            {topProducts.length === 0 && (
              <tr><td colSpan={3} className="py-4 text-white/40 text-xs">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
