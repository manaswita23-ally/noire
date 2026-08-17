import dotenv from "dotenv";
import mongoose from "mongoose";
import slugify from "slugify";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Collection from "../models/Collection.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

dotenv.config();

const MOODS = ["Minimal", "Bold", "Calm", "Executive", "Weekend", "Luxury", "Tech", "Everyday"];
const CATEGORIES = ["Bags", "Watches", "Audio", "Lighting", "Home", "Accessories"];

const IMG = (seed) => `https://picsum.photos/seed/${seed}/800/1000`;

const rawProducts = [
  { name: "Obsidian Leather Backpack", brand: "Noiré Studio", category: "Bags", price: 4999, discountPrice: 3999, moods: ["Minimal", "Executive"], tags: ["leather", "backpack", "work"], featured: true },
  { name: "Aurelia Desk Lamp", brand: "Lumen & Co", category: "Lighting", price: 2499, moods: ["Minimal", "Calm"], tags: ["desk", "lamp", "home"], newArrival: true },
  { name: "Noir Minimal Watch", brand: "Chronos House", category: "Watches", price: 5499, discountPrice: 4499, moods: ["Minimal", "Executive", "Luxury"], tags: ["watch", "minimal", "steel"], featured: true },
  { name: "Atlas Travel Organizer", brand: "Voyage Supply", category: "Bags", price: 1799, moods: ["Everyday", "Weekend"], tags: ["travel", "organizer"] },
  { name: "Vela Ceramic Mug", brand: "Studio Clay", category: "Home", price: 799, moods: ["Calm", "Everyday"], tags: ["mug", "ceramic", "kitchen"] },
  { name: "Élan Wireless Headphones", brand: "Reson8", category: "Audio", price: 6999, discountPrice: 5999, moods: ["Tech", "Bold"], tags: ["headphones", "wireless", "audio"], featured: true, newArrival: true },
  { name: "Sable Slim Wallet", brand: "Noiré Studio", category: "Accessories", price: 1299, moods: ["Minimal", "Executive"], tags: ["wallet", "leather"] },
  { name: "Onyx Mechanical Keyboard", brand: "Keytone", category: "Audio", price: 7499, moods: ["Tech", "Bold"], tags: ["keyboard", "mechanical", "desk"] },
  { name: "Linen Weekender Bag", brand: "Voyage Supply", category: "Bags", price: 3299, moods: ["Weekend", "Everyday"], tags: ["bag", "linen", "travel"] },
  { name: "Ivory Table Clock", brand: "Chronos House", category: "Home", price: 1899, moods: ["Calm", "Minimal"], tags: ["clock", "home", "decor"] },
  { name: "Terra Ceramic Planter", brand: "Studio Clay", category: "Home", price: 999, moods: ["Calm", "Everyday"], tags: ["planter", "ceramic"] },
  { name: "Merid Leather Belt", brand: "Noiré Studio", category: "Accessories", price: 1499, moods: ["Executive", "Minimal"], tags: ["belt", "leather"] },
  { name: "Solstice Sunglasses", brand: "Halo Eyewear", category: "Accessories", price: 2199, moods: ["Bold", "Weekend"], tags: ["sunglasses", "summer"] },
  { name: "Quartz Chronograph Watch", brand: "Chronos House", category: "Watches", price: 8999, moods: ["Luxury", "Executive"], tags: ["watch", "chronograph"], featured: true },
  { name: "Drift Bluetooth Speaker", brand: "Reson8", category: "Audio", price: 3499, discountPrice: 2999, moods: ["Tech", "Weekend"], tags: ["speaker", "bluetooth"] },
  { name: "Fern Table Runner", brand: "Studio Clay", category: "Home", price: 899, moods: ["Calm", "Everyday"], tags: ["runner", "linen", "decor"] },
  { name: "Basalt Card Holder", brand: "Noiré Studio", category: "Accessories", price: 699, moods: ["Minimal", "Everyday"], tags: ["cardholder", "leather"], newArrival: true },
  { name: "Nomad Duffel Bag", brand: "Voyage Supply", category: "Bags", price: 3999, moods: ["Weekend", "Bold"], tags: ["duffel", "travel"] },
  { name: "Halo Pendant Light", brand: "Lumen & Co", category: "Lighting", price: 3299, moods: ["Luxury", "Calm"], tags: ["pendant", "light", "decor"] },
  { name: "Cove Noise-Cancelling Earbuds", brand: "Reson8", category: "Audio", price: 5499, moods: ["Tech", "Everyday"], tags: ["earbuds", "audio"], newArrival: true, featured: true },
  { name: "Ridge Canvas Tote", brand: "Voyage Supply", category: "Bags", price: 1599, moods: ["Everyday", "Minimal"], tags: ["tote", "canvas"] },
  { name: "Marble Coaster Set", brand: "Studio Clay", category: "Home", price: 999, moods: ["Calm", "Luxury"], tags: ["coaster", "marble"] },
  { name: "Element Desk Organizer", brand: "Lumen & Co", category: "Home", price: 1299, moods: ["Minimal", "Executive"], tags: ["desk", "organizer"] },
  { name: "Vantage Aviator Watch", brand: "Chronos House", category: "Watches", price: 6499, moods: ["Bold", "Executive"], tags: ["watch", "aviator"] },
  { name: "Loom Wool Scarf", brand: "Halo Eyewear", category: "Accessories", price: 1399, moods: ["Weekend", "Calm"], tags: ["scarf", "wool"] },
  { name: "Crest Task Chair", brand: "Lumen & Co", category: "Home", price: 8999, moods: ["Executive", "Tech"], tags: ["chair", "office"] },
  { name: "Pulse Fitness Band", brand: "Reson8", category: "Watches", price: 2999, discountPrice: 2499, moods: ["Tech", "Everyday"], tags: ["fitness", "band", "wearable"] },
  { name: "Willow Jewelry Box", brand: "Studio Clay", category: "Home", price: 1799, moods: ["Luxury", "Calm"], tags: ["jewelry", "box", "decor"] },
  { name: "Strand Leather Journal", brand: "Noiré Studio", category: "Accessories", price: 899, moods: ["Minimal", "Executive"], tags: ["journal", "leather"] },
  { name: "Beacon Reading Lamp", brand: "Lumen & Co", category: "Lighting", price: 1999, moods: ["Calm", "Minimal"], tags: ["lamp", "reading"], newArrival: true },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Clearing existing data...");

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Collection.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
  ]);

  console.log("Creating admin & demo users...");
  const admin = await User.create({
    name: "Admin",
    email: process.env.ADMIN_EMAIL || "admin@noire.demo",
    password: process.env.ADMIN_PASSWORD || "Admin@123",
    role: "admin",
  });

  const demoUser = await User.create({
    name: "Aarav Mehta",
    email: "demo@noire.demo",
    password: "Demo@123",
    role: "user",
    addresses: [
      {
        fullName: "Aarav Mehta",
        phone: "9876543210",
        address: "12 Marine Drive",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
        isDefault: true,
      },
    ],
  });

  console.log("Creating products...");
  const products = await Product.insertMany(
    rawProducts.map((p, i) => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true }),
      description: `${p.name} by ${p.brand} — thoughtfully designed for everyday elegance. Crafted with premium materials and finished with meticulous attention to detail.`,
      images: [IMG(`${p.name}-1`), IMG(`${p.name}-2`)],
      stock: Math.floor(Math.random() * 40) + (i % 7 === 0 ? 3 : 15),
      tags: [...p.tags, p.category.toLowerCase()],
      specifications: { Material: "Premium", Origin: "India", Warranty: "1 Year" },
      colors: ["Black", "Ivory"],
    }))
  );

  console.log("Creating collections...");
  const byMood = (mood) => products.filter((p) => p.moods.includes(mood)).map((p) => p._id);
  const collectionsData = [
    { name: "Midnight Essentials", description: "Dark, refined pieces for after-hours elegance.", image: IMG("midnight-essentials"), featured: true, products: byMood("Bold") },
    { name: "Workday Minimal", description: "Clean, functional essentials for the office.", image: IMG("workday-minimal"), featured: true, products: byMood("Executive") },
    { name: "Weekend Escape", description: "Easy, relaxed pieces for time off.", image: IMG("weekend-escape"), featured: true, products: byMood("Weekend") },
    { name: "Under ₹999", description: "Considered design, accessible pricing.", image: IMG("under-999"), products: products.filter((p) => (p.discountPrice || p.price) < 999).map((p) => p._id) },
    { name: "Trending Now", description: "What everyone's adding to their bag.", image: IMG("trending-now"), products: products.slice(0, 8).map((p) => p._id) },
    { name: "New Arrivals", description: "Fresh drops, just in.", image: IMG("new-arrivals"), products: products.filter((p) => p.newArrival).map((p) => p._id) },
    { name: "Editor's Choice", description: "Hand-picked favorites from our editors.", image: IMG("editors-choice"), featured: true, products: products.filter((p) => p.featured).map((p) => p._id) },
  ];
  const collections = await Collection.insertMany(
    collectionsData.map((c) => ({ ...c, slug: slugify(c.name, { lower: true, strict: true }) }))
  );

  // attach collection refs back onto products
  for (const collection of collections) {
    await Product.updateMany(
      { _id: { $in: collection.products } },
      { $addToSet: { collections: collection._id } }
    );
  }

  console.log("Creating a sample delivered order + review...");
  const p1 = products[0];
  const order = await Order.create({
    user: demoUser._id,
    items: [{ product: p1._id, name: p1.name, image: p1.images[0], price: p1.discountPrice || p1.price, quantity: 1 }],
    shippingAddress: demoUser.addresses[0],
    deliveryMethod: "Standard",
    paymentMethod: "UPI Demo",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    subtotal: p1.discountPrice || p1.price,
    shippingCost: 0,
    tax: Math.round((p1.discountPrice || p1.price) * 0.05),
    total: (p1.discountPrice || p1.price) + Math.round((p1.discountPrice || p1.price) * 0.05),
    trackingHistory: [
      { status: "Order Placed", description: "Your order has been placed successfully." },
      { status: "Confirmed", description: "Your order has been confirmed." },
      { status: "Packed", description: "Your order has been packed." },
      { status: "Shipped", description: "Your order has been shipped." },
      { status: "Out for Delivery", description: "Your order is out for delivery." },
      { status: "Delivered", description: "Your order has been delivered." },
    ],
  });

  await Review.create({
    user: demoUser._id,
    product: p1._id,
    order: order._id,
    rating: 5,
    comment: "Beautifully made — exceeded expectations. The leather feels premium and the stitching is flawless.",
  });
  await Product.findByIdAndUpdate(p1._id, { rating: 5, reviewCount: 1 });

  console.log("Seed complete.");
  console.log(`Admin login -> ${admin.email} / (see .env ADMIN_PASSWORD)`);
  console.log(`Demo user login -> demo@noire.demo / Demo@123`);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
