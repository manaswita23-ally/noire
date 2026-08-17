import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { formatINR, formatDate } from "../utils/format.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders").then((res) => {
      setOrders(res.data.data.orders);
      setLoading(false);
    });
  }, []);

  if (!loading && orders.length === 0) {
    return (
      <div className="container-px py-32 text-center">
        <h1 className="heading-serif text-3xl mb-4">No orders yet.</h1>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-px py-14">
      <h1 className="heading-serif text-4xl mb-10">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <Link
            key={o._id}
            to={`/orders/${o._id}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between border border-ink/10 p-5 hover:border-ink transition-colors"
          >
            <div>
              <div className="text-sm font-medium">Order #{o._id.slice(-8).toUpperCase()}</div>
              <div className="text-xs text-stone">{formatDate(o.createdAt)}</div>
            </div>
            <div className="text-sm mt-2 sm:mt-0">{formatINR(o.total)}</div>
            <span className="text-xs uppercase tracking-wide mt-2 sm:mt-0 px-3 py-1 bg-ivory w-fit">
              {o.orderStatus}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
