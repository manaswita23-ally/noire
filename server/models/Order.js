import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const trackingEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "Order Placed",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      required: true,
    },
    date: { type: Date, default: Date.now },
    description: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pinCode: String,
    },
    deliveryMethod: { type: String, enum: ["Standard", "Express"], default: "Standard" },
    paymentMethod: {
      type: String,
      enum: ["COD", "Demo Card", "UPI Demo"],
      required: true,
    },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    orderStatus: {
      type: String,
      enum: [
        "Order Placed",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Order Placed",
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    trackingHistory: [trackingEventSchema],
    estimatedDelivery: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
