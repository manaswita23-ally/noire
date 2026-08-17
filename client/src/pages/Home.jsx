import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api.js";
import { ProductGrid } from "../components/ProductGrid.jsx";

const MOODS = ["Minimal", "Bold", "Calm", "Executive", "Weekend", "Luxury", "Tech", "Everyday"];

export default function Home() {
  const [collections, setCollections] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [mood, setMood] = useState(null);
  const [moodProducts, setMoodProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/collections"),
      api.get("/products", { params: { sort: "featured", limit: 8 } }),
    ]).then(([colRes, prodRes]) => {
      setCollections(colRes.data.data.collections.slice(0, 4));
      setFeatured(prodRes.data.data.products);
      setLoading(false);
    });
  }, []);

  const selectMood = async (m) => {
    setMood(m);
    const res = await api.get("/products", { params: { mood: m, limit: 8 } });
    setMoodProducts(res.data.data.products);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-ink text-offwhite overflow-hidden">
        <div className="container-px py-28 md:py-40 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="eyebrow text-offwhite/50 mb-6">NOIRÉ — SS26 Edit</div>
            <h1 className="heading-serif text-5xl md:text-7xl leading-[1.05] mb-6">
              Curated for<br />the way you live.
            </h1>
            <p className="text-offwhite/70 max-w-md mb-10">
              Discover objects worth keeping. A boutique of considered design — chosen, not mass-produced.
            </p>
            <div className="flex gap-4">
              <Link to="/collections" className="btn-primary bg-offwhite text-ink hover:bg-wine hover:text-offwhite">
                Explore Collection
              </Link>
              <Link to="/shop?sort=newest" className="btn-outline border-offwhite text-offwhite hover:bg-offwhite hover:text-ink">
                New Arrivals
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="aspect-[4/5] bg-charcoal"
          >
            <img
              src="https://picsum.photos/seed/noire-hero/900/1100"
              alt="Featured NOIRÉ lifestyle product"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="container-px py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow mb-3">Featured</div>
            <h2 className="heading-serif text-3xl md:text-4xl">Collections worth exploring</h2>
          </div>
          <Link to="/collections" className="text-sm hidden md:inline hover:text-wine">
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {collections.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative overflow-hidden group ${i === 0 ? "md:col-span-2 aspect-[16/8]" : "aspect-[16/10]"}`}
            >
              <Link to={`/collection/${c.slug}`}>
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/30 flex flex-col justify-end p-6 md:p-8">
                  <h3 className="heading-serif text-2xl md:text-3xl text-offwhite mb-1">{c.name}</h3>
                  <p className="text-offwhite/80 text-sm mb-3 max-w-sm">{c.description}</p>
                  <span className="text-offwhite text-xs tracking-widest2 uppercase underline underline-offset-4">
                    Explore ({c.products?.length || 0})
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SHOP BY MOOD */}
      <section className="bg-ivory py-24">
        <div className="container-px">
          <div className="eyebrow mb-3">Discover</div>
          <h2 className="heading-serif text-3xl md:text-4xl mb-8">Shop by mood</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-10">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => selectMood(m)}
                className={`shrink-0 px-6 py-2 text-sm tracking-wide border transition-colors ${
                  mood === m ? "bg-ink text-offwhite border-ink" : "border-ink/20 hover:border-ink"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <motion.div key={mood} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <ProductGrid products={mood ? moodProducts : featured} loading={loading} />
          </motion.div>
        </div>
      </section>

      {/* NOIRÉ EDIT */}
      <section className="container-px py-24">
        <div className="text-center mb-12">
          <div className="eyebrow mb-3">The Noiré Edit</div>
          <h2 className="heading-serif text-3xl md:text-4xl mb-2">Five pieces. One aesthetic.</h2>
          <p className="text-stone text-sm">A curated combination selected by our editors.</p>
        </div>
        <ProductGrid products={featured.slice(0, 5)} loading={loading} />
        <div className="text-center mt-10">
          <Link to="/shop" className="btn-primary">Shop the Edit</Link>
        </div>
      </section>
    </div>
  );
}
