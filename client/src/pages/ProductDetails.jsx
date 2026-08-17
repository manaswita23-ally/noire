import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatINR } from "../utils/format.js";
import { ProductGrid } from "../components/ProductGrid.jsx";

const ACCORDIONS = [
  { key: "description", label: "Description" },
  { key: "details", label: "Details" },
  { key: "shipping", label: "Shipping" },
  { key: "returns", label: "Returns" },
];

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [recs, setRecs] = useState({ completeTheLook: [], youMayAlsoLike: [] });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then((res) => {
      const p = res.data.data.product;
      setProduct(p);
      setLoading(false);
      api.get(`/products/${p._id}/reviews`).then((r) => setReviews(r.data.data.reviews));
      api.get(`/products/${p._id}/recommendations`).then((r) => setRecs(r.data.data));
      if (user) {
        api.post("/users/recently-viewed", { productId: p._id }).catch(() => {});
      } else {
        try {
          const key = "noire_recently_viewed";
          const list = JSON.parse(localStorage.getItem(key)) || [];
          const filtered = [p._id, ...list.filter((x) => x !== p._id)].slice(0, 8);
          localStorage.setItem(key, JSON.stringify(filtered));
        } catch {}
      }
    });
    window.scrollTo(0, 0);
  }, [id, user]);

  if (loading || !product) {
    return <div className="container-px py-24 text-stone text-center">Loading…</div>;
  }

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="container-px py-14">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-[4/5] bg-ivory mb-3 overflow-hidden">
            <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-16 h-20 overflow-hidden border ${activeImg === i ? "border-ink" : "border-transparent"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest2 text-stone mb-2">{product.brand}</div>
          <h1 className="heading-serif text-3xl md:text-4xl mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm text-stone mb-4">
            <span>★ {product.rating || "No ratings"}</span>
            <span>·</span>
            <span>{product.reviewCount} reviews</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">{formatINR(price)}</span>
            {hasDiscount && <span className="text-stone line-through">{formatINR(product.price)}</span>}
          </div>

          <p className="text-sm text-stone mb-6">
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </p>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-ink/20">
              <button className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <span className="px-4">{qty}</span>
              <button className="px-3 py-2" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <button
              className="btn-primary flex-1"
              disabled={product.stock === 0}
              onClick={() => addToCart(product, qty)}
            >
              Add to Cart
            </button>
          </div>
          <div className="flex gap-4 mb-10">
            <button className="btn-outline flex-1">Buy Now</button>
            <button
              className="btn-outline flex-1"
              onClick={() => user && api.post("/users/wishlist", { productId: product._id })}
            >
              ♡ Wishlist
            </button>
          </div>

          <div className="border-t border-ink/10">
            {ACCORDIONS.map((a) => (
              <div key={a.key} className="border-b border-ink/10">
                <button
                  className="w-full flex justify-between items-center py-4 text-sm"
                  onClick={() => setOpenAccordion(openAccordion === a.key ? null : a.key)}
                >
                  {a.label}
                  <span>{openAccordion === a.key ? "–" : "+"}</span>
                </button>
                {openAccordion === a.key && (
                  <p className="text-sm text-stone pb-4">
                    {a.key === "description" && product.description}
                    {a.key === "details" &&
                      Object.entries(product.specifications || {}).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    {a.key === "shipping" && "Free shipping on orders above ₹999. Standard delivery in 4-6 business days, Express in 1-2 business days."}
                    {a.key === "returns" && "Easy 7-day returns. Items must be unused and in original packaging."}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {recs.completeTheLook.length > 0 && (
        <section className="mt-24">
          <h2 className="heading-serif text-2xl mb-6">Complete the Look</h2>
          <ProductGrid products={recs.completeTheLook} />
        </section>
      )}

      {recs.youMayAlsoLike.length > 0 && (
        <section className="mt-24">
          <h2 className="heading-serif text-2xl mb-6">You May Also Like</h2>
          <ProductGrid products={recs.youMayAlsoLike} />
        </section>
      )}

      <section className="mt-24 max-w-2xl">
        <h2 className="heading-serif text-2xl mb-6">Reviews ({reviews.length})</h2>
        {reviews.length === 0 && <p className="text-sm text-stone">No reviews yet.</p>}
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-ink/10 pb-4">
              <div className="text-sm font-medium">{r.user?.name}</div>
              <div className="text-xs text-stone mb-1">★ {r.rating}</div>
              <p className="text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
