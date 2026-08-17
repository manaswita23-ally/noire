import { useEffect, useState } from "react";
import api from "../services/api.js";
import { ProductGrid } from "../components/ProductGrid.jsx";

export default function Search() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      api.get("/products", { params: { search: query, limit: 24 } }).then((res) => {
        setProducts(res.data.data.products);
        setTotal(res.data.data.pagination.total);
        setLoading(false);
      });
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="container-px py-14 max-w-4xl mx-auto">
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands, moods…"
        className="w-full border-b border-ink/30 pb-4 text-2xl heading-serif bg-transparent focus:outline-none mb-8"
      />
      {query && !loading && (
        <p className="text-sm text-stone mb-6">{total} results for "{query}"</p>
      )}
      <ProductGrid products={products} loading={loading && query.length > 0} />
    </div>
  );
}
