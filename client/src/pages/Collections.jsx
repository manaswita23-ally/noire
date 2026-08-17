import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

export default function Collections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    api.get("/collections").then((res) => setCollections(res.data.data.collections));
  }, []);

  return (
    <div className="container-px py-14">
      <h1 className="heading-serif text-4xl mb-10">Collections</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {collections.map((c) => (
          <Link key={c._id} to={`/collection/${c.slug}`} className="relative aspect-[16/10] overflow-hidden group">
            <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-ink/30 flex flex-col justify-end p-6">
              <h2 className="heading-serif text-2xl text-offwhite mb-1">{c.name}</h2>
              <p className="text-offwhite/80 text-sm">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
