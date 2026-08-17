import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, index: true },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
    moods: [{ type: String, index: true }],
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    specifications: { type: Map, of: String, default: {} },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text", tags: "text", category: "text" });

productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

productSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Product", productSchema);
