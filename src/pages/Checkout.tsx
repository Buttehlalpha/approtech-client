import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import axios from "axios";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Loader2,
  Copy,
  Banknote,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderRef, setOrderRef] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    deliveryNotes: "",
  });

  const deliveryFee = 2000;
  const total = totalPrice + deliveryFee;

  const bankDetails = {
    bankName: "GTBank",
    accountName: "AgriConnect Farms",
    accountNumber: "0123456789",
  };

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate("/cart");
    }
  }, [items, navigate, orderComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateOrderRef = () => {
    return "ORD-" + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const ref = generateOrderRef();
      setOrderRef(ref);

      const orderData = {
        orderRef: ref,
        items: items.map(({ product, quantity }) => ({
          productId: product._id || product.id,
          name: product.name,
          price: Number(product.price),
          quantity: quantity,
          total: Number(product.price) * quantity,
        })),
        totalAmount: total,
        deliveryFee: deliveryFee,
        paymentMethod: "bank-transfer",
        customerInfo: formData,
        status: "pending",
      };

      console.log("📦 Order Data:", orderData);

      const response = await axios.post(
        `${API_URL}/api/orders/create`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Order Created:", response.data);
      
      setOrderId(response.data.order?._id || ref);
      setOrderComplete(true);
      clearCart();
      
      toast.success("Order placed successfully! 🎉");

    } catch (error: any) {
      console.error("❌ Order Error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const OrderSummary = () => (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">Order Summary</h3>
      
      {items.map(({ product, quantity }) => (
        <div key={product._id || product.id} className="flex justify-between text-sm">
          <span>{product.name} x {quantity}</span>
          <span>₦{(Number(product.price) * quantity).toLocaleString()}</span>
        </div>
      ))}
      
      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₦{totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery Fee</span>
          <span>₦{deliveryFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-green-700 pt-2 border-t">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  const BankTransferDetails = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
      <h4 className="font-semibold text-blue-800 flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        Bank Transfer Details
      </h4>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
          <span className="text-gray-600">Bank</span>
          <span className="font-medium text-gray-800">{bankDetails.bankName}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
          <span className="text-gray-600">Account Name</span>
          <span className="font-medium text-gray-800">{bankDetails.accountName}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
          <span className="text-gray-600">Account Number</span>
          <span className="font-mono font-bold text-lg text-blue-700">{bankDetails.accountNumber}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(bankDetails.accountNumber)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
        <p className="font-medium">⚠️ Important:</p>
        <p>Please use your Order Reference when making payment.</p>
        <p className="font-mono text-xs mt-1 bg-yellow-100 p-1 rounded">Reference: {orderRef || "Pending Order"}</p>
      </div>
    </div>
  );

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed! 🎉</h2>
            <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order Reference</p>
              <p className="font-mono font-bold text-lg text-green-700">{orderRef}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Next Steps:</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Make payment to the bank account below</li>
                <li>Use <strong>{orderRef}</strong> as reference</li>
                <li>We'll confirm payment within 24 hours</li>
                <li>Your produce will be delivered after confirmation</li>
              </ol>
            </div>

            <BankTransferDetails />

            <div className="flex gap-3 mt-6">
              <Link to="/marketplace" className="flex-1">
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </Link>
              <Link to="/orders" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700">View Orders</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Link to="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Details</h2>
              
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Email *</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone *</Label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="080 1234 5678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Delivery Address *</Label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">City *</Label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Lagos"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">State *</Label>
                    <Input
                      type="text"
                      name="state"
                      placeholder="Lagos"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Delivery Notes</Label>
                  <textarea
                    name="deliveryNotes"
                    placeholder="Any special instructions for delivery"
                    value={formData.deliveryNotes}
                    onChange={handleInputChange}
                    className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    rows={3}
                  />
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
              <div className="border-2 border-green-600 bg-green-50 rounded-xl p-4 flex items-center gap-4">
                <Banknote className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">Bank Transfer</p>
                  <p className="text-sm text-gray-500">Pay via bank transfer</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">💳 You'll see bank details after placing your order</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <OrderSummary />

              <Button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  `Place Order • ₦${total.toLocaleString()}`
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing this order, you agree to our Terms and Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;