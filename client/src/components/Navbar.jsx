import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const NAV_LINKS = [
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "New Arrivals", to: "/shop?sort=newest" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-40 bg-offwhite/95 backdrop-blur border-b border-ink/10 transition-all ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container-px flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-widest2 uppercase">
          Noiré
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-sm tracking-wide text-ink/80 hover:text-wine transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link to="/search" aria-label="Search" className="text-sm hover:text-wine">
            Search
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="text-sm hover:text-wine hidden sm:inline">
            Wishlist
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative text-sm hover:text-wine">
            Bag
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-wine text-offwhite text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/account" className="text-sm hover:text-wine">
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-sm text-stone hover:text-wine"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline text-sm hover:text-wine">
              Account
            </Link>
          )}
          <button
            className="md:hidden text-sm"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden container-px pt-4 pb-6 flex flex-col gap-4 border-t border-ink/10 mt-3"
        >
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)} className="text-sm">
              {l.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
                navigate("/");
              }}
              className="text-left text-sm text-stone"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm">
              Account
            </Link>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}
