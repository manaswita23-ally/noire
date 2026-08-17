import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import { formatINR } from "../../utils/format.js";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/products", { params: { search, limit: 50 } }).then((res) => {
      setProducts(res.data.data.products);
      setLoading(false);
    });
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const confirmDelete = async () => {
    await api.delete(`/products/${deleteTarget._id}`);
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif">Products</h1>
        <Link to="/admin/products/new" className="bg-wine text-offwhite text-sm px-5 py-2.5 hover:bg-wineLight">
          + Add Product
        </Link>
      </div>

      <input
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm bg-white/5 border border-white/10 px-4 py-2.5 text-sm mb-6"
      />

      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-white/40 text-xs border-b border-white/10">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Rating</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-white/5">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover" />
                  <div>
                    <div>{p.name}</div>
                    <div className="text-xs text-white/40">{p.brand}</div>
                  </div>
                </td>
                <td className="p-4 text-white/70">{p.category}</td>
                <td className="p-4">{formatINR(p.discountPrice || p.price)}</td>
                <td className={`p-4 ${p.stock <= 5 ? "text-wine" : "text-white/70"}`}>{p.stock}</td>
                <td className="p-4 text-white/70">★ {p.rating}</td>
                <td className="p-4 text-right space-x-3">
                  <Link to={`/admin/products/${p._id}/edit`} className="text-xs underline text-white/70 hover:text-offwhite">
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="text-xs underline text-wine hover:text-wineLight"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && products.length === 0 && (
          <p className="p-8 text-center text-white/40 text-sm">No products found.</p>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1c] border border-white/10 p-6 max-w-sm w-full">
            <p className="text-sm mb-6">
              Delete <strong>{deleteTarget.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="text-sm px-4 py-2 text-white/60">
                Cancel
              </button>
              <button onClick={confirmDelete} className="text-sm px-4 py-2 bg-wine text-offwhite">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
