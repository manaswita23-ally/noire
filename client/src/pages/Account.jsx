import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatINR, formatDate } from "../utils/format.js";

const TABS = ["Profile", "Orders", "Wishlist", "Recently Viewed", "Addresses"];

export default function Account() {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState("Profile");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [profile, setProfile] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [savedMsg, setSavedMsg] = useState("");
  const [newAddress, setNewAddress] = useState({
    fullName: "", phone: "", address: "", city: "", state: "", pinCode: "",
  });

  useEffect(() => {
    if (tab === "Orders") api.get("/orders").then((r) => setOrders(r.data.data.orders));
    if (tab === "Wishlist") api.get("/users/wishlist").then((r) => setWishlist(r.data.data.wishlist));
    if (tab === "Recently Viewed")
      api.get("/users/recently-viewed").then((r) => setRecentlyViewed(r.data.data.recentlyViewed));
  }, [tab]);

  const saveProfile = async (e) => {
    e.preventDefault();
    const res = await api.put("/users/profile", profile);
    setUser(res.data.data.user);
    setSavedMsg("Your profile has been updated.");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const addAddress = async (e) => {
    e.preventDefault();
    await api.post("/users/addresses", newAddress);
    const res = await api.get("/auth/me");
    setUser(res.data.data.user);
    setNewAddress({ fullName: "", phone: "", address: "", city: "", state: "", pinCode: "" });
  };

  return (
    <div className="container-px py-14">
      <h1 className="heading-serif text-4xl mb-10">My Account</h1>
      <div className="flex gap-6 overflow-x-auto no-scrollbar border-b border-ink/10 mb-10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm whitespace-nowrap ${tab === t ? "border-b-2 border-ink font-medium" : "text-stone"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Profile" && (
        <form onSubmit={saveProfile} className="max-w-sm space-y-4">
          <div>
            <label className="text-xs text-stone">Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border border-ink/20 px-4 py-3 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-stone">Email</label>
            <input value={user?.email} disabled className="w-full border border-ink/10 px-4 py-3 text-sm mt-1 bg-ivory text-stone" />
          </div>
          <div>
            <label className="text-xs text-stone">Phone</label>
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full border border-ink/20 px-4 py-3 text-sm mt-1"
            />
          </div>
          {savedMsg && <p className="text-sm text-wine">{savedMsg}</p>}
          <button className="btn-primary">Save Changes</button>
        </form>
      )}

      {tab === "Orders" && (
        <div className="space-y-4">
          {orders.length === 0 && <p className="text-sm text-stone">No orders yet.</p>}
          {orders.map((o) => (
            <Link key={o._id} to={`/orders/${o._id}`} className="flex justify-between border border-ink/10 p-5 hover:border-ink">
              <div>
                <div className="text-sm font-medium">#{o._id.slice(-8).toUpperCase()}</div>
                <div className="text-xs text-stone">{formatDate(o.createdAt)}</div>
              </div>
              <div className="text-sm">{formatINR(o.total)}</div>
              <span className="text-xs uppercase px-3 py-1 bg-ivory h-fit">{o.orderStatus}</span>
            </Link>
          ))}
        </div>
      )}

      {tab === "Wishlist" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlist.length === 0 && <p className="text-sm text-stone">Nothing saved yet.</p>}
          {wishlist.map((p) => (
            <Link key={p._id} to={`/product/${p.slug}`}>
              <div className="aspect-[4/5] bg-ivory mb-2"><img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /></div>
              <div className="text-sm">{p.name}</div>
            </Link>
          ))}
        </div>
      )}

      {tab === "Recently Viewed" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recentlyViewed.length === 0 && <p className="text-sm text-stone">Nothing viewed yet.</p>}
          {recentlyViewed.map((p) => (
            <Link key={p._id} to={`/product/${p.slug}`}>
              <div className="aspect-[4/5] bg-ivory mb-2"><img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /></div>
              <div className="text-sm">{p.name}</div>
            </Link>
          ))}
        </div>
      )}

      {tab === "Addresses" && (
        <div className="max-w-sm">
          <div className="space-y-3 mb-8">
            {(user?.addresses || []).map((a) => (
              <div key={a._id} className="border border-ink/10 p-4 text-sm">
                <div className="font-medium">{a.fullName}</div>
                <div className="text-stone">{a.address}, {a.city}, {a.state} - {a.pinCode}</div>
                <div className="text-stone">{a.phone}</div>
              </div>
            ))}
            {(!user?.addresses || user.addresses.length === 0) && (
              <p className="text-sm text-stone">No saved addresses.</p>
            )}
          </div>
          <form onSubmit={addAddress} className="space-y-3">
            <p className="text-sm font-medium">Add New Address</p>
            {["fullName", "phone", "address", "city", "state", "pinCode"].map((f) => (
              <input
                key={f}
                placeholder={f === "pinCode" ? "PIN Code" : f.charAt(0).toUpperCase() + f.slice(1)}
                value={newAddress[f]}
                onChange={(e) => setNewAddress({ ...newAddress, [f]: e.target.value })}
                className="w-full border border-ink/20 px-4 py-3 text-sm"
                required
              />
            ))}
            <button className="btn-primary w-full">Save Address</button>
          </form>
        </div>
      )}
    </div>
  );
}
