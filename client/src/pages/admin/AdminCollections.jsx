import { useEffect, useState } from "react";
import api from "../../services/api.js";

const EMPTY = { name: "", description: "", image: "", featured: false };

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.get("/collections").then((res) => setCollections(res.data.data.collections));

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.image) {
      setError("Name and image are required.");
      return;
    }
    try {
      await api.post("/collections", form);
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create collection");
    }
  };

  const remove = async (id) => {
    await api.delete(`/collections/${id}`);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif">Collections</h1>
        <button onClick={() => setShowForm((s) => !s)} className="bg-wine text-offwhite text-sm px-5 py-2.5">
          {showForm ? "Cancel" : "+ Add Collection"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white/5 border border-white/10 p-6 mb-8 max-w-lg space-y-3">
          <input
            placeholder="Collection name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 px-3 py-2.5 text-sm"
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full bg-white/5 border border-white/10 px-3 py-2.5 text-sm"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-white/5 border border-white/10 px-3 py-2.5 text-sm"
            rows={2}
          />
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured on homepage
          </label>
          {error && <p className="text-sm text-wine">{error}</p>}
          <button className="bg-wine text-offwhite text-sm px-5 py-2.5">Create Collection</button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {collections.map((c) => (
          <div key={c._id} className="bg-white/5 border border-white/10 overflow-hidden">
            <img src={c.image} alt={c.name} className="w-full h-32 object-cover" />
            <div className="p-4">
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-white/50 mb-3">{c.products?.length || 0} products</div>
              <button onClick={() => remove(c._id)} className="text-xs text-wine underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
