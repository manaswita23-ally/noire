import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const LINKS = [
  { label: "Overview", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Customers", to: "/admin/users" },
  { label: "Collections", to: "/admin/collections" },
  { label: "Analytics", to: "/admin/analytics" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#0f0f10] text-offwhite">
      <aside className="w-60 shrink-0 border-r border-white/10 flex flex-col">
        <Link to="/" className="font-serif text-xl tracking-widest2 uppercase px-6 py-6 border-b border-white/10">
          Noiré
          <span className="block text-[10px] tracking-widest2 text-white/40 mt-1">Admin</span>
        </Link>
        <nav className="flex-1 py-4">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/admin"}
              className={({ isActive }) =>
                `block px-6 py-3 text-sm ${isActive ? "bg-white/10 text-offwhite" : "text-white/60 hover:text-offwhite"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10 text-xs text-white/50">
          <div className="mb-2">{user?.name}</div>
          <button onClick={logout} className="hover:text-offwhite">Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
