import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatINR } from "../utils/format.js";

const FREE_SHIPPING_THRESHOLD = 999;

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container-px py-32 text-center">
        <h1 className="heading-serif text-3xl mb-4">Your collection is waiting.</h1>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shipping = remaining === 0 ? 0 : 79;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <div className="container-px py-14">
      <h1 className="heading-serif text-4xl mb-10">Your Bag</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-12">
        <div className="space-y-6">
          {cart.map(({ product, quantity }) => (
            <div key={product._id} className="flex gap-4 border-b border-ink/10 pb-6">
              <Link to={`/product/${product.slug}`} className="w-24 h-28 bg-ivory shrink-0">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <div className="text-xs text-stone">{product.brand}</div>
                    <Link to={`/product/${product.slug}`} className="text-sm">{product.name}</Link>
                  </div>
                  <span className="text-sm">{formatINR((product.discountPrice || product.price) * quantity)}</span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-ink/20">
                    <button className="px-2 py-1" onClick={() => updateQuantity(product._id, Math.max(1, quantity - 1))}>-</button>
                    <span className="px-3 text-sm">{quantity}</span>
                    <button className="px-2 py-1" onClick={() => updateQuantity(product._id, quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(product._id)} className="text-xs text-stone hover:text-wine">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-ivory p-6 h-fit">
          <h2 className="text-sm font-medium mb-4">Your Bag</h2>
          <p className="text-xs text-stone mb-1">{cart.length} items</p>
          <p className="text-xl mb-4">{formatINR(subtotal)}</p>
          {remaining > 0 ? (
            <div className="mb-4">
              <p className="text-xs text-stone mb-2">{formatINR(remaining)} more to unlock free shipping.</p>
              <div className="h-1 bg-ink/10">
                <div
                  className="h-1 bg-wine transition-all"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-wine mb-4">You've unlocked free shipping!</p>
          )}

          <div className="space-y-2 text-sm border-t border-ink/10 pt-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatINR(tax)}</span></div>
            <div className="flex justify-between font-medium text-base pt-2 border-t border-ink/10">
              <span>Total</span><span>{formatINR(total)}</span>
            </div>
          </div>

          <Link to="/checkout" className="btn-primary w-full mt-6">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}
