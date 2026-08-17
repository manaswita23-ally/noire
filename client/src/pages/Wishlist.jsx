import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { ProductGrid } from "../components/ProductGrid.jsx";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/wishlist").then((res) => {
      setWishlist(res.data.data.wishlist);
      setLoading(false);
    });
  }, []);

  if (!loading && wishlist.length === 0) {
    return (
      <div className="container-px py-32 text-center">
        <h1 className="heading-serif text-3xl mb-4">Nothing saved yet.</h1>
        <Link to="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container-px py-14">
      <h1 className="heading-serif text-4xl mb-10">Wishlist</h1>
      <ProductGrid products={wishlist} loading={loading} />
    </div>
  );
}
