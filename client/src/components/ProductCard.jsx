import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import { formatINR } from "../utils/format.js";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [wished, setWished] = useState(false);
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return;
    setWished((w) => !w);
    await api.post("/users/wishlist", { productId: product._id });
  };

  const quickAdd = async (e) => {
    e.preventDefault();
    await addToCart(product, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-wine text-offwhite text-[10px] tracking-widest2 uppercase px-2 py-1">
              Sale
            </span>
          )}
          <button
            onClick={toggleWishlist}
            aria-label="Toggle wishlist"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-offwhite/90 flex items-center justify-center text-sm"
          >
            {wished ? "♥" : "♡"}
          </button>
          <button
            onClick={quickAdd}
            className="absolute bottom-0 left-0 right-0 bg-ink text-offwhite text-xs tracking-widest2 uppercase py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            Quick Add
          </button>
        </div>
        <div className="mt-3">
          <div className="text-xs text-stone uppercase tracking-wide">{product.brand}</div>
          <div className="text-sm mt-0.5">{product.name}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm">{formatINR(price)}</span>
            {hasDiscount && (
              <span className="text-xs text-stone line-through">{formatINR(product.price)}</span>
            )}
            {product.rating > 0 && (
              <span className="text-xs text-stone ml-auto">★ {product.rating}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
