import ProductCard from "./ProductCard.jsx";

export function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] bg-ivory" />
            <div className="h-3 bg-ivory mt-3 w-2/3" />
            <div className="h-3 bg-ivory mt-2 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-24 text-center text-stone">
        <p className="heading-serif text-2xl mb-2">Nothing matched your search.</p>
        <p className="text-sm">Try adjusting your filters or explore another collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
