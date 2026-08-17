import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api.js";

const EMPTY = {
  name: "", brand: "", category: "", description: "",
  price: "", discountPrice: "", stock: "", images: "",
  moods: "", tags: "", featured: false, newArrival: false,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then((res) => {
        const p = res.data.data.product;
        setForm({
          ...p,
          price: p.price,
          discountPrice: p.discountPrice || "",
          images: p.images.join(", "),
          moods: p.moods.join(", "),
          tags: p.tags.join(", "),
        });
      });
    }
  }, [id, isEdit]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.brand || !form.category || !form.price || !form.images) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock) || 0,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      moods: form.moods.split(",").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (isEdit) await api.put(`/products/${id}`, payload);
      else await api.post("/products", payload);
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-serif mb-8">{isEdit ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Brand *" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Category *" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Input label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price (₹) *" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          <Input label="Discount Price (₹)" type="number" value={form.discountPrice} onChange={(v) => setForm({ ...form, discountPrice: v })} />
        </div>
        <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        <Input label="Image URLs (comma separated) *" value={form.images} onChange={(v) => setForm({ ...form, images: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Moods (comma separated)" value={form.moods} onChange={(v) => setForm({ ...form, moods: v })} />
          <Input label="Tags (comma separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
        </div>
        <div className="flex gap-6 text-sm text-white/70">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.newArrival} onChange={(e) => setForm({ ...form, newArrival: e.target.checked })} />
            New Arrival
          </label>
        </div>
        {error && <p className="text-sm text-wine">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button className="bg-wine text-offwhite text-sm px-6 py-2.5" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => navigate("/admin/products")} className="text-sm px-6 py-2.5 text-white/60">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs text-white/50 block mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 px-3 py-2.5 text-sm"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs text-white/50 block mb-1">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full bg-white/5 border border-white/10 px-3 py-2.5 text-sm"
      />
    </label>
  );
}
