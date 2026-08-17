import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
const GUEST_CART_KEY = "noire_guest_cart";

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
};
const writeGuestCart = (items) => localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]); // [{ product, quantity }]
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data.data.cart);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // On login: merge guest cart into DB cart, then load DB cart
  useEffect(() => {
    const init = async () => {
      if (user) {
        const guestItems = readGuestCart();
        if (guestItems.length > 0) {
          await api.post("/cart/merge", {
            items: guestItems.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
          });
          writeGuestCart([]);
        }
        await fetchCart();
      } else {
        setCart(readGuestCart());
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      const res = await api.post("/cart", { productId: product._id, quantity });
      setCart(res.data.data.cart);
    } else {
      const items = readGuestCart();
      const existing = items.find((i) => i.product._id === product._id);
      if (existing) existing.quantity += quantity;
      else items.push({ product, quantity });
      writeGuestCart(items);
      setCart(items);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (user) {
      const res = await api.put(`/cart/${productId}`, { quantity });
      setCart(res.data.data.cart);
    } else {
      const items = readGuestCart().map((i) =>
        i.product._id === productId ? { ...i, quantity } : i
      );
      writeGuestCart(items);
      setCart(items);
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data.data.cart);
    } else {
      const items = readGuestCart().filter((i) => i.product._id !== productId);
      writeGuestCart(items);
      setCart(items);
    }
  };

  const clearLocalCart = () => {
    writeGuestCart([]);
    setCart([]);
  };

  const subtotal = cart.reduce((sum, i) => {
    const price = i.product?.discountPrice || i.product?.price || 0;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearLocalCart,
        fetchCart,
        subtotal,
        itemCount: cart.reduce((n, i) => n + i.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
