import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import { ProductGrid } from "../components/ProductGrid.jsx";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "priceLowHigh", label: "Price: Low to High" },
  { value: "priceHighLow", label: "Price: High to Low" },
  { value: "topRated", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({ categories: [], moods: [], brands: [] });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const mood = searchParams.get("mood") || "";
  const sort = searchParams.get("sort") || "featured";
  const page = Number(searchParams.get("page") || 1);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  useEffect(() => {
    api.get("/products/meta/facets").then((res) => setFacets(res.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { category, mood, sort, page, limit: 12 } })
      .then((res) => {
        setProducts(res.data.data.products);
        setPagination(res.data.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [category, mood, sort, page]);

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <div className="text-sm font-medium mb-3">Category</div>
        <div className="space-y-2">
          {facets.categories.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-stone">
              <input
                type="radio"
                name="category"
                checked={category === c}
                onChange={() => setParam("category", c)}
              />
              {c}
            </label>
          ))}
          {category && (
            <button onClick={() => setParam("category", "")} className="text-xs text-wine">
              Clear
            </button>
          )}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium mb-3">Mood</div>
        <div className="space-y-2">
          {facets.moods.map((m) => (
            <label key={m} className="flex items-center gap-2 text-sm text-stone">
              <input type="radio" name="mood" checked={mood === m} onChange={() => setParam("mood", m)} />
              {m}
            </label>
          ))}
          {mood && (
            <button onClick={() => setParam("mood", "")} className="text-xs text-wine">
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-px py-14">
      <div className="mb-10">
        <div className="eyebrow mb-2">Shop</div>
        <h1 className="heading-serif text-4xl">All Products</h1>
      </div>

      <div className="flex justify-between items-center mb-8 md:hidden">
        <button onClick={() => setDrawerOpen(true)} className="btn-outline text-xs px-4 py-2">
          Filters
        </button>
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="border border-ink/20 text-sm px-3 py-2 bg-transparent"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden md:block">
          <FilterContent />
        </aside>

        <div>
          <div className="hidden md:flex justify-between items-center mb-6">
            <span className="text-sm text-stone">{pagination.total || 0} products</span>
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="border border-ink/20 text-sm px-3 py-2 bg-transparent"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <ProductGrid products={products} loading={loading} />

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-14">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setParam("page", i + 1 === 1 ? "" : String(i + 1))}
                  className={`w-8 h-8 text-sm ${page === i + 1 ? "bg-ink text-offwhite" : "text-stone"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-offwhite p-6 overflow-y-auto">
            <button onClick={() => setDrawerOpen(false)} className="text-sm mb-6">
              Close ✕
            </button>
            <FilterContent />
          </div>
        </div>
      )}
    </div>
  );
}
