import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-offwhite mt-24">
      <div className="container-px py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <div className="font-serif text-2xl tracking-widest2 uppercase mb-4">Noiré</div>
          <p className="text-sm text-offwhite/60 max-w-xs">
            Curated for the way you live. Objects worth keeping, chosen with care.
          </p>
        </div>
        <div>
          <div className="eyebrow text-offwhite/50 mb-4">Shop</div>
          <ul className="space-y-2 text-sm text-offwhite/80">
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/collections">Collections</Link></li>
            <li><Link to="/shop?sort=newest">New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-offwhite/50 mb-4">Account</div>
          <ul className="space-y-2 text-sm text-offwhite/80">
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-offwhite/10 py-6 text-center text-xs text-offwhite/40">
        © {new Date().getFullYear()} NOIRÉ. A student full-stack demonstration project.
      </div>
    </footer>
  );
}
