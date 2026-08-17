import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import { ProductGrid } from "../components/ProductGrid.jsx";

export default function CollectionDetail() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/collections/${slug}`).then((res) => {
      setCollection(res.data.data.collection);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="container-px py-24 text-center text-stone">Loading…</div>;
  if (!collection) return <div className="container-px py-24 text-center">Collection not found.</div>;

  return (
    <div>
      <div className="relative h-72 md:h-96">
        <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/40 flex flex-col justify-end p-8 md:p-14">
          <h1 className="heading-serif text-4xl md:text-5xl text-offwhite mb-2">{collection.name}</h1>
          <p className="text-offwhite/80 max-w-lg">{collection.description}</p>
        </div>
      </div>
      <div className="container-px py-14">
        <ProductGrid products={collection.products} />
      </div>
    </div>
  );
}
