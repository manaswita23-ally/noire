import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);
