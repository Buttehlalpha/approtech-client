import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Index from "@/pages/Index";
import Marketplace from "@/pages/Marketplace";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import Farmers from "@/pages/Farmers";
import FarmerDashboard from "@/pages/FarmerDashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

/* PUBLIC LAYOUT */
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner position="top-right" richColors closeButton duration={3000} />

        <BrowserRouter>
          <Routes>
            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PUBLIC PAGES */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Index />
                </PublicLayout>
              }
            />

            <Route
              path="/marketplace"
              element={
                <PublicLayout>
                  <Marketplace />
                </PublicLayout>
              }
            />

            <Route
              path="/product/:id"
              element={
                <PublicLayout>
                  <ProductDetail />
                </PublicLayout>
              }
            />

            <Route
              path="/cart"
              element={
                <PublicLayout>
                  <Cart />
                </PublicLayout>
              }
            />

            {/* ✅ CHECKOUT - Must be before 404 */}
            <Route
              path="/checkout"
              element={
                <PublicLayout>
                  <Checkout />
                </PublicLayout>
              }
            />

            {/* ✅ ORDERS */}
            <Route
              path="/orders"
              element={
                <PublicLayout>
                  <Orders />
                </PublicLayout>
              }
            />

            <Route
              path="/farmers"
              element={
                <PublicLayout>
                  <Farmers />
                </PublicLayout>
              }
            />

            {/* DASHBOARD */}
            <Route path="/dashboard" element={<FarmerDashboard />} />

            {/* ✅ 404 - Must be LAST */}
            <Route
              path="*"
              element={
                <PublicLayout>
                  <NotFound />
                </PublicLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;