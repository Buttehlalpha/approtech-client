import {
  Star,
  ShoppingCart,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Product } from "@/lib/mock-data";

import { useCart } from "@/context/CartContext";

import { Link } from "react-router-dom";

import freshProduce from "@/assets/fresh-produce.jpg";

interface ProductCardProps {
  product: Product | any;
}

const ProductCard = ({
  product,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL;

  // Function to get correct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return freshProduce;
    if (imagePath.startsWith('http')) return imagePath;
    // If it's a relative path from the backend
    return `${API_URL}/${imagePath}`;
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">

      <Link to={`/product/${product._id || product.id}`}>

        <div className="relative aspect-[4/3] overflow-hidden">

          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // If image fails to load, use fallback
              (e.target as HTMLImageElement).src = freshProduce;
            }}
          />

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">

              <span className="text-lg font-bold text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">

        <Link
          to={`/product/${product._id || product.id}`}
        >
          <h3 className="text-lg font-semibold text-card-foreground transition-colors hover:text-primary">

            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">

          <MapPin className="h-3.5 w-3.5" />

          <span>
            {product.location || "Nigeria"}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1">

          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

          <span className="text-sm font-medium">
            {product.rating || 4.5}
          </span>

          <span className="text-xs text-muted-foreground">
            ({product.reviews || 0})
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">

          <div>

            <span className="text-xl font-bold text-primary">
              ₦
              {Number(
                product.price
              ).toLocaleString()}
            </span>

            <span className="text-sm text-muted-foreground">
              /{product.unit || 'kg'}
            </span>
          </div>

          <Button
            size="sm"
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
            className="gap-1"
          >

            <ShoppingCart className="h-4 w-4" />

            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;