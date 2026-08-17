import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api.js";
import { formatINR, formatDate } from "../utils/format.js";

const STAGES = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => {
      setOrder(res.data.data.order);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container-px py-24 text-center text-stone">Loading…</div>;
  if (!order) return <div className="container-px py-24 text-center">Order not found.</div>;

  const doneStatuses = order.trackingHistory.map((t) => t.status);

  return (
    <div className="container-px py-14 max-w-3xl mx-auto">
      <h1 className="heading-serif text-3xl mb-2">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="text-sm text-stone mb-10">Placed on {formatDate(order.createdAt)}</p>

      <div className="mb-12">
        {STAGES.map((stage, i) => {
          const event = order.trackingHistory.find((t) => t.status === stage);
          const isDone = doneStatuses.includes(stage);
          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${isDone ? "bg-wine" : "bg-ink/15"}`} />
                {i < STAGES.length - 1 && (
                  <div className={`w-px flex-1 ${isDone ? "bg-wine" : "bg-ink/15"}`} style={{ minHeight: 40 }} />
                )}
              </div>
              <div className="pb-8">
                <div className={`text-sm ${isDone ? "text-ink font-medium" : "text-stone"}`}>{stage}</div>
                {event && (
                  <>
                    <div className="text-xs text-stone">{formatDate(event.date)}</div>
                    <p className="text-xs text-stone mt-1">{event.description}</p>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-ivory p-6 space-y-2 text-sm">
        {order.items.map((item) => (
          <div key={item.product} className="flex justify-between">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatINR(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-medium border-t border-ink/10 pt-2 mt-2">
          <span>Total</span><span>{formatINR(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
