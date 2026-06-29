import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import FarmerCard from "@/components/FarmerCard";
import { Button } from "@/components/ui/button";
import { farmers } from "@/lib/mock-data";
import { ArrowRight, Shield, Truck, ShoppingCart, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const topFarmers = farmers.slice(0, 3);

  // FETCH PRODUCTS FROM MONGODB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/api/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* HOW IT WORKS (REPLACED CATEGORY SECTION) */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            How FarmLink Works
          </h2>
          <p className="mt-2 font-body text-muted-foreground">
            Fresh food from farmers to your doorstep in 3 simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: ShoppingCart,
              title: "Choose Products",
              desc: "Browse fresh produce directly from local farmers.",
            },
            {
              icon: Leaf,
              title: "Order Online",
              desc: "Place your order easily and securely in seconds.",
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              desc: "Get fresh farm produce delivered to your doorstep.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="text-center rounded-xl border border-border bg-card p-8 shadow-soft"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-light">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-card-foreground">
                {step.title}
              </h3>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Featured Produce
              </h2>
              <p className="mt-2 font-body text-muted-foreground">
                Hand-picked selections from our best farmers
              </p>
            </div>

            <Link to="/marketplace" className="hidden md:block">
              <Button variant="ghost" className="gap-2 font-body text-primary">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading && (
            <p className="text-center text-muted-foreground">
              Loading products...
            </p>
          )}

          {error && (
            <p className="text-center text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-6 text-center md:hidden">
            <Link to="/marketplace">
              <Button variant="default" className="gap-2">
                View All Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Why FarmLink?
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Quality Guaranteed",
              desc: "Every product verified for freshness and quality standards.",
            },
            {
              icon: Truck,
              title: "Farm-Fresh Delivery",
              desc: "Direct from farms to your doorstep, ensuring maximum freshness.",
            },
            {
              icon: Leaf,
              title: "Support Local",
              desc: "Empower local farmers and build stronger agricultural communities.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="text-center rounded-xl border border-border bg-card p-8 shadow-soft"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-light">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-card-foreground">
                {item.title}
              </h3>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FARMERS */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Meet Our Farmers
              </h2>
              <p className="mt-2 font-body text-muted-foreground">
                The people behind your fresh produce
              </p>
            </div>

            <Link to="/farmers" className="hidden md:block">
              <Button variant="ghost" className="gap-2 font-body text-primary">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topFarmers.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Start Selling?
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-body text-lg text-primary-foreground/80">
            Join hundreds of farmers already growing their business with FarmLink.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/register">
              <Button variant="hero" size="lg">
                Register as Farmer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;