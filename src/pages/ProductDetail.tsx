import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

import {
  Star,
  MapPin,
  ShoppingCart,
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";

import freshProduce from "@/assets/fresh-produce.jpg";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;

  // FETCH SINGLE PRODUCT
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/products`
      );

      const foundProduct = res.data.find(
        (p: any) => p._id === id
      );

      setProduct(foundProduct);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-lg font-semibold">
          Loading product...
        </h2>
      </div>
    );
  }

  // NOT FOUND
  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <h2 className="text-2xl font-bold text-foreground">
            Product not found
          </h2>

          <Link to="/marketplace">
            <Button className="mt-4">
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf7]">

      <div className="container mx-auto px-4 py-8">

        {/* BACK BUTTON */}
        <Link
          to="/marketplace"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        {/* PRODUCT DETAIL */}
        <div className="mt-4 grid gap-8 lg:grid-cols-2">

          {/* IMAGE */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm border">

            <img
              src={
                product.image
                  ? `${API_URL}/${product.image}`
                  : freshProduce
              }
              alt={product.name}
              className="h-full w-full object-cover aspect-square"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-5">

            {/* TITLE */}
            <div>

              <Badge className="mb-3 bg-green-100 text-green-700">
                Fresh Farm Produce
              </Badge>

              <h1 className="text-4xl font-bold text-gray-800">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">

                <MapPin className="h-4 w-4" />

                <span>
                  Nigeria
                </span>

                <span>•</span>

                <span>
                  by {product.farmerName || "Farmer"}
                </span>
              </div>
            </div>

            {/* RATING */}
            <div className="flex items-center gap-2">

              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

              <span className="font-medium">
                4.8
              </span>

              <span className="text-sm text-muted-foreground">
                (120 reviews)
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="leading-relaxed text-muted-foreground">

              Fresh quality {product.name} directly from local farmers.
              Carefully harvested and supplied for healthy feeding and
              affordable market prices across Nigeria.
            </p>

            {/* PRICE */}
            <div>

              <span className="text-5xl font-bold text-green-700">
                ₦
                {Number(
                  product.price
                ).toLocaleString()}
              </span>

              <span className="ml-2 text-lg text-muted-foreground">
                /{product.unit}
              </span>
            </div>

            {/* QUANTITY + CART */}
            <div className="flex items-center gap-4">

              {/* QTY */}
              <div className="flex items-center rounded-xl border bg-white">

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setQty(
                      Math.max(1, qty - 1)
                    )
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="w-12 text-center font-medium">
                  {qty}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setQty(qty + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* ADD CART */}
              <Button
                className="flex-1 gap-2 rounded-xl bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={() =>
                  addToCart(product, qty)
                }
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* DELIVERY INFO */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">

              <h3 className="font-semibold text-gray-800">
                Delivery Information
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">

                Fast delivery available within Nigeria.
                Orders are processed quickly to ensure
                fresh farm produce reaches customers
                safely and on time.
              </p>
            </div>

            {/* EXTRA INFO */}
            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-white p-4 shadow-sm border">

                <p className="text-sm text-muted-foreground">
                  Category
                </p>

                <h3 className="mt-2 font-semibold capitalize">
                  {product.category}
                </h3>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm border">

                <p className="text-sm text-muted-foreground">
                  Availability
                </p>

                <h3 className="mt-2 font-semibold text-green-700">
                  In Stock
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;