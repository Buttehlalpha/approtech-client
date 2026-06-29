import { useEffect, useState } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import ProductCard from "@/components/ProductCard";

import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const categories = [
  { id: "vegetables", name: "Vegetables", icon: "🥬" },
  { id: "fruits", name: "Fruits", icon: "🍎" },
  { id: "grains", name: "Grains", icon: "🌾" },
  { id: "tubers", name: "Tubers", icon: "🥔" },
  { id: "livestock", name: "Livestock", icon: "🐄" },
];

const Marketplace = () => {
  const [searchParams] = useSearchParams();

  const initialCategory =
    searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const [searchQuery, setSearchQuery] = useState("");

  const [sortBy, setSortBy] = useState("popular");

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // FETCH PRODUCTS FROM BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URL}/api/products`
        );

        setProducts(res.data);

      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // FILTER PRODUCTS
  const filtered = products
    .filter(
      (p: any) =>
        selectedCategory === "all" ||
        p.category === selectedCategory
    )
    .filter((p: any) =>
      p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  // SORT PRODUCTS
  const sorted = [...filtered].sort(
    (a: any, b: any) => {
      if (sortBy === "price-low")
        return a.price - b.price;

      if (sortBy === "price-high")
        return b.price - a.price;

      if (sortBy === "rating")
        return b.rating - a.rating;

      return b.reviews - a.reviews;
    }
  );

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <div className="gradient-hero py-12">
        <div className="container mx-auto px-4">

          <h1 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            Marketplace
          </h1>

          <p className="mt-2 font-body text-primary-foreground/80">
            Fresh produce from verified local farmers
          </p>

          {/* SEARCH */}
          <div className="mt-6 flex max-w-xl gap-2">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-10 bg-primary-foreground/95 border-0"
              />
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* FILTERS */}
        <div className="mb-6 flex flex-wrap items-center gap-4">

          <div className="flex flex-wrap gap-2">

            {/* ALL */}
            <Badge
              className={`cursor-pointer font-body transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/10"
              }`}
              onClick={() =>
                setSelectedCategory("all")
              }
            >
              All
            </Badge>

            {/* CATEGORY */}
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                className={`cursor-pointer font-body transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}
                onClick={() =>
                  setSelectedCategory(cat.id)
                }
              >
                {cat.icon} {cat.name}
              </Badge>
            ))}
          </div>

          {/* SORT */}
          <div className="ml-auto flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="rounded-lg border border-input bg-background px-3 py-1.5 font-body text-sm text-foreground"
            >
              <option value="popular">
                Most Popular
              </option>

              <option value="rating">
                Top Rated
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        {/* RESULTS */}
        <p className="mb-4 font-body text-sm text-muted-foreground">
          {sorted.length} products found
        </p>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center">
            <p className="font-body text-muted-foreground">
              Loading products...
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="py-20 text-center">
            <p className="font-body text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((product: any) => (
              <ProductCard
                key={product._id}
                product={{
                  ...product,

                  // CHANGE PRICE DISPLAY TO NAIRA
                  price: Number(product.price),
                  currency: "₦",
                }}
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          sorted.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-display text-xl text-muted-foreground">
                No products found
              </p>

              <p className="mt-2 font-body text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Marketplace;