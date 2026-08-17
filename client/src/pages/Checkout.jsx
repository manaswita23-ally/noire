import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatINR, formatDate } from "../utils/format.js";

const STEPS = ["Address", "Delivery", "Payment", "Confirmation"];

export default function Checkout() {
  const { cart, subtotal, clearLocalCart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("Standard");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [order, setOrder] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const shipping = deliveryMethod === "Express" ? 199 : subtotal >= 999 ? 0 : 79;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const placeOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      const res = await api.post("/orders", {
        items: cart.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
        shippingAddress: address,
        deliveryMethod,
        paymentMethod,
      });
      setOrder(res.data.data.order);
      clearLocalCart();
      if (user) fetchCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0 && !order) {
    return (
      <div className="container-px py-32 text-center">
        <p className="heading-serif text-2xl mb-4">Your bag is empty.</p>
        <button className="btn-primary" onClick={() => navigate("/shop")}>Shop Now</button>
      </div>
    );
  }

  return (
    <div className="container-px py-14 max-w-3xl mx-auto">
      <div className="flex justify-center gap-6 mb-12 text-xs uppercase tracking-wide">
        {STEPS.map((s, i) => (
          <span key={s} className={i === step ? "text-ink font-medium" : "text-stone"}>
            {i + 1}. {s}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="heading-serif text-2xl mb-6">Delivery Address</h2>
          {["fullName", "phone", "address", "city", "state", "pinCode"].map((field) => (
            <input
              key={field}
              placeholder={field === "pinCode" ? "PIN Code" : field.charAt(0).toUpperCase() + field.slice(1)}
              value={address[field]}
              onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
              className="w-full border border-ink/20 px-4 py-3 text-sm"
            />
          ))}
          <button
            className="btn-primary w-full"
            onClick={() => setStep(1)}
            disabled={!address.fullName || !address.phone || !address.address || !address.city || !address.pinCode}
          >
            Continue to Delivery
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="heading-serif text-2xl mb-6">Delivery Method</h2>
          <div className="space-y-3 mb-8">
            {[
              { value: "Standard", label: "Standard Delivery", detail: "4-6 business days · " + (subtotal >= 999 ? "Free" : formatINR(79)) },
              { value: "Express", label: "Express Delivery", detail: "1-2 business days · " + formatINR(199) },
            ].map((opt) => (
              <label key={opt.value} className={`flex justify-between items-center border p-4 cursor-pointer ${deliveryMethod === opt.value ? "border-ink" : "border-ink/20"}`}>
                <div>
                  <input type="radio" name="delivery" className="mr-3" checked={deliveryMethod === opt.value} onChange={() => setDeliveryMethod(opt.value)} />
                  {opt.label}
                </div>
                <span className="text-sm text-stone">{opt.detail}</span>
              </label>
            ))}
          </div>
          <button className="btn-primary w-full" onClick={() => setStep(2)}>Continue to Payment</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="heading-serif text-2xl mb-6">Payment</h2>
          <div className="space-y-3 mb-8">
            {[
              { value: "COD", label: "Cash on Delivery" },
              { value: "Demo Card", label: "Demo Card Payment (simulated)" },
              { value: "UPI Demo", label: "UPI Demo (simulated)" },
            ].map((opt) => (
              <label key={opt.value} className={`flex items-center border p-4 cursor-pointer ${paymentMethod === opt.value ? "border-ink" : "border-ink/20"}`}>
                <input type="radio" name="payment" className="mr-3" checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} />
                {opt.label}
              </label>
            ))}
          </div>
          <div className="bg-ivory p-4 text-sm space-y-1 mb-6">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatINR(tax)}</span></div>
            <div className="flex justify-between font-medium border-t border-ink/10 pt-2"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
          {error && <p className="text-sm text-wine mb-4">{error}</p>}
          <button className="btn-primary w-full" onClick={placeOrder} disabled={placing}>
            {placing ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      )}

      {step === 3 && order && (
        <div className="text-center py-10">
          <h2 className="heading-serif text-3xl mb-3">Order confirmed.</h2>
          <p className="text-stone mb-8">Thank you — your order is on its way.</p>
          <div className="bg-ivory p-6 text-left max-w-sm mx-auto space-y-2 text-sm mb-8">
            <div className="flex justify-between"><span>Order ID</span><span>{order._id.slice(-8).toUpperCase()}</span></div>
            <div className="flex justify-between"><span>Date</span><span>{formatDate(order.createdAt)}</span></div>
            <div className="flex justify-between"><span>Total</span><span>{formatINR(order.total)}</span></div>
            <div className="flex justify-between"><span>Estimated Delivery</span><span>{formatDate(order.estimatedDelivery)}</span></div>
          </div>
          <button className="btn-primary" onClick={() => navigate(`/orders/${order._id}`)}>Track Order</button>
        </div>
      )}
    </div>
  );
}
