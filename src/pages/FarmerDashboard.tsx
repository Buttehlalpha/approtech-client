import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // Install: npm install sonner

import {
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Edit,
  Trash2,
  LayoutDashboard,
  Settings,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import freshProduce from "@/assets/fresh-produce.jpg";

const FarmerDashboard = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    unit: "",
    category: "vegetables",
    image: null as File | null,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/products/my-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMyProducts(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
    }
  };

  const stats = [
    {
      label: "Total Products",
      value: myProducts.length,
      icon: Package,
      change: "+ New uploads",
    },
    {
      label: "Revenue",
      value: `₦${myProducts
        .reduce((acc, item: any) => acc + Number(item.price || 0), 0)
        .toLocaleString()}`,
      icon: DollarSign,
      change: "Estimated earnings",
    },
    {
      label: "Orders",
      value: "156",
      icon: TrendingUp,
      change: "+8 this week",
    },
    {
      label: "Customers",
      value: "89",
      icon: Users,
      change: "+15 new",
    },
  ];

  const getInitials = (name: string) =>
    name?.split(" ").map((w) => w[0]).join("").toUpperCase();

  const handleLogout = () => {
    toast.success("Logging out...");
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }, 500);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return freshProduce;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('uploads/')) return `${API_URL}/${imagePath}`;
    return `${API_URL}/${imagePath}`;
  };

  const handleUploadProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.name || !productForm.price || !productForm.unit) {
      toast.error("Please fill all fields");
      return;
    }

    if (!productForm.image) {
      toast.error("Please select an image");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("unit", productForm.unit);
      formData.append("category", productForm.category);

      if (productForm.image) {
        formData.append("image", productForm.image);
      }

      const response = await axios.post(
        `${API_URL}/api/products/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product uploaded successfully! 🎉");

      setProductForm({
        name: "",
        price: "",
        unit: "",
        category: "vegetables",
        image: null,
      });

      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      fetchProducts();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f7faf7]">

      {/* MOBILE SIDEBAR TOGGLE */}
      <button
        className="fixed top-4 left-4 z-50 rounded-lg bg-green-600 p-2 text-white lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* SIDEBAR - Mobile responsive */}
      <aside className={`
        fixed h-full w-72 flex-col border-r bg-white p-6 transition-transform duration-300 z-40
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>

        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-green-700">
            AgriConnect
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Smart farming marketplace
          </p>
        </div>

        {/* USER */}
        <div className="mb-8 rounded-2xl bg-green-600 p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-700 font-bold">
              {getInitials(user.name)}
            </div>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-green-100 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav className="space-y-2">
          <button
            onClick={() => {
              setCurrentPage("dashboard");
              setSidebarOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
              currentPage === "dashboard" ? "bg-green-50 text-green-700" : "hover:bg-green-50"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </button>

          <button
            onClick={() => {
              setCurrentPage("myProduce");
              setSidebarOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
              currentPage === "myProduce" ? "bg-green-50 text-green-700" : "hover:bg-green-50"
            }`}
          >
            <Package className="h-5 w-5" />
            My Produce
          </button>

          <button
            onClick={() => {
              setCurrentPage("settings");
              setSidebarOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
              currentPage === "settings" ? "bg-green-50 text-green-700" : "hover:bg-green-50"
            }`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1">
        {/* TOPBAR */}
        <div className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8">
          <h1 className="text-xl font-bold ml-12 lg:ml-0">
            Farmer Dashboard
          </h1>

          {/* AVATAR */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-bold">
              {getInitials(user.name)}
            </div>
            <span className="font-medium hidden sm:inline">
              {user.name}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 lg:p-8 space-y-8">

          {/* DASHBOARD */}
          {currentPage === "dashboard" && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {stat.label}
                      </p>
                      <h2 className="text-2xl lg:text-3xl font-bold">
                        {stat.value}
                      </h2>
                      <p className="text-xs text-green-600">
                        {stat.change}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <stat.icon className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MY PRODUCE */}
          {currentPage === "myProduce" && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-4 lg:p-6">
                <h2 className="text-xl font-semibold mb-6">
                  My Products ({myProducts.length})
                </h2>

                <div className="space-y-4">
                  {myProducts.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      You haven't uploaded any products yet.
                    </p>
                  ) : (
                    myProducts.map((product: any) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-4 border p-4 rounded-xl flex-wrap"
                      >
                        <img
                          src={getImageUrl(product.image)}
                          className="h-14 w-14 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = freshProduce;
                          }}
                          alt={product.name}
                        />

                        <div className="flex-1 min-w-[120px]">
                          <h3 className="font-semibold">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ₦{Number(product.price).toLocaleString()} / {product.unit}
                          </p>
                        </div>

                        <button 
                          onClick={() => deleteProduct(product._id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* UPLOAD */}
              <div className="rounded-2xl bg-white p-4 lg:p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Upload Product
                </h2>

                <form
                  onSubmit={handleUploadProduct}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        name: e.target.value,
                      })
                    }
                    className="border p-3 rounded-xl"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Price (₦)"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: e.target.value,
                      })
                    }
                    className="border p-3 rounded-xl"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Unit (kg, dozen, etc.)"
                    value={productForm.unit}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        unit: e.target.value,
                      })
                    }
                    className="border p-3 rounded-xl"
                    required
                  />

                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="border p-3 rounded-xl"
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="tubers">Tubers</option>
                    <option value="livestock">Livestock</option>
                  </select>

                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        image: e.target.files?.[0] || null,
                      })
                    }
                    className="border p-3 rounded-xl md:col-span-2"
                    required
                  />

                  <button
                    type="submit"
                    className="bg-green-600 text-white p-3 rounded-xl md:col-span-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Product"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {currentPage === "settings" && (
            <div className="bg-white p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">
                Settings
              </h2>

              <div className="space-y-3">
                <p><span className="font-medium">Name:</span> {user.name}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Role:</span> {user.role}</p>
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;