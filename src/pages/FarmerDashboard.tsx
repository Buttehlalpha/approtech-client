import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Trash2,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Edit,
} from "lucide-react";

import freshProduce from "@/assets/fresh-produce.jpg";

const FarmerDashboard = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

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
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/products/my-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Fetched products:", res.data);
      res.data.forEach((product: any, index: number) => {
        console.log(`📦 Product ${index + 1}: ${product.name} - Image: ${product.image || 'No image'}`);
      });

      setMyProducts(res.data);
    } catch (error: any) {
      console.error("❌ Fetch products error:", error);
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Products",
      value: myProducts.length,
      icon: Package,
      change: "+ New uploads",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Revenue",
      value: `₦${myProducts
        .reduce((acc, item: any) => acc + Number(item.price || 0), 0)
        .toLocaleString()}`,
      icon: DollarSign,
      change: "Estimated earnings",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Orders",
      value: "156",
      icon: TrendingUp,
      change: "+8 this week",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Customers",
      value: "89",
      icon: Users,
      change: "+15 new",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const getInitials = (name: string) =>
    name?.split(" ").map((w) => w[0]).join("").toUpperCase() || "U";

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
      setDeleteLoading(id);
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(null);
    }
  };

  // ✅ FIXED: Better image URL handling with localhost replacement
  const getImageUrl = (imagePath: string) => {
    console.log("🔍 Original image path:", imagePath);
    
    if (!imagePath) {
      console.log("❌ No image path, using fallback");
      return freshProduce;
    }
    
    // ✅ FIX: Replace localhost with production URL
    let fixedPath = imagePath;
    if (imagePath.includes('localhost:5000')) {
      fixedPath = imagePath.replace('http://localhost:5000', 'https://approtech-backend.onrender.com');
      console.log("🔄 Fixed localhost URL:", fixedPath);
    }
    
    if (fixedPath.startsWith('http://') || fixedPath.startsWith('https://')) {
      console.log("✅ Using full URL:", fixedPath);
      return fixedPath;
    }
    
    if (fixedPath.startsWith('uploads/')) {
      const fullUrl = `${API_URL}/${fixedPath}`;
      console.log("✅ Using uploads path:", fullUrl);
      return fullUrl;
    }
    
    if (!fixedPath.includes('/')) {
      const fullUrl = `${API_URL}/uploads/${fixedPath}`;
      console.log("✅ Using filename:", fullUrl);
      return fullUrl;
    }
    
    const fullUrl = `${API_URL}/${fixedPath}`;
    console.log("✅ Using default path:", fullUrl);
    return fullUrl;
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
      setUploadLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("unit", productForm.unit);
      formData.append("category", productForm.category);
      formData.append("image", productForm.image);

      console.log("=== UPLOADING PRODUCT ===");
      console.log("Product data:", {
        name: productForm.name,
        price: productForm.price,
        unit: productForm.unit,
        category: productForm.category,
        image: productForm.image?.name || "No image"
      });

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

      console.log("✅ Upload Response:", response.data);
      console.log("✅ Image URL from server:", response.data.product?.image);

      toast.success("Product uploaded successfully! 🎉");

      setProductForm({
        name: "",
        price: "",
        unit: "",
        category: "vegetables",
        image: null,
      });

      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      await fetchProducts();

    } catch (error: any) {
      console.error("❌ Upload Error:", error);
      console.error("❌ Error Response:", error.response?.data);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploadLoading(false);
    }
  };

  const renderProducts = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Loading products...</p>
        </div>
      );
    }

    if (myProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">You haven't uploaded any products yet.</p>
          <p className="text-gray-400 text-sm mt-2">Click "Upload Product" below to get started!</p>
        </div>
      );
    }

    return myProducts.map((product: any) => {
      console.log(`📦 Rendering ${product.name} - Image: ${product.image}`);
      
      // ✅ Get the image URL with localhost fix
      const imageUrl = getImageUrl(product.image);
      console.log(`🖼️ Final image URL for ${product.name}:`, imageUrl);
      
      return (
        <div
          key={product._id}
          className="flex items-center gap-4 border p-4 rounded-xl hover:shadow-md transition-shadow flex-wrap"
        >
          <img
            src={imageUrl}
            className="h-16 w-16 rounded-lg object-cover border"
            onError={(e) => {
              console.error("❌ Image failed to load:", product.image);
              console.error("❌ Attempted URL:", imageUrl);
              (e.target as HTMLImageElement).src = freshProduce;
            }}
            alt={product.name}
          />

          <div className="flex-1 min-w-[150px]">
            <h3 className="font-semibold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500">
              ₦{Number(product.price).toLocaleString()} / {product.unit}
            </p>
            <p className="text-xs text-gray-400 capitalize">Category: {product.category}</p>
            <p className="text-xs text-gray-400 break-all">Image path: {product.image || 'No image'}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <button 
              onClick={() => deleteProduct(product._id)}
              disabled={deleteLoading === product._id}
              className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
            >
              {deleteLoading === product._id ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f7faf7]">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 rounded-lg bg-green-600 p-2 text-white shadow-lg lg:hidden transition-all hover:bg-green-700"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed h-full w-72 flex-col border-r bg-white p-6 transition-transform duration-300 z-40 shadow-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-green-700">AgriConnect</h1>
          <p className="mt-1 text-sm text-gray-500">Smart farming marketplace</p>
        </div>

        <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-700 font-bold text-lg">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{user.name || 'User'}</h3>
              <p className="text-sm text-green-100 capitalize">{user.role || 'Farmer'}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => { setCurrentPage("dashboard"); setSidebarOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              currentPage === "dashboard" 
                ? "bg-green-50 text-green-700 font-medium shadow-sm" 
                : "hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </button>
          <button
            onClick={() => { setCurrentPage("myProduce"); setSidebarOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              currentPage === "myProduce" 
                ? "bg-green-50 text-green-700 font-medium shadow-sm" 
                : "hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <Package className="h-5 w-5" /> My Produce
          </button>
          <button
            onClick={() => { setCurrentPage("settings"); setSidebarOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              currentPage === "settings" 
                ? "bg-green-50 text-green-700 font-medium shadow-sm" 
                : "hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <Settings className="h-5 w-5" /> Settings
          </button>
        </nav>

        <div className="mt-auto lg:hidden pt-6 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        {/* Topbar */}
        <div className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8 shadow-sm">
          <h1 className="text-xl font-bold ml-12 lg:ml-0 text-gray-800">
            {currentPage === "dashboard" && "Dashboard"}
            {currentPage === "myProduce" && "My Produce"}
            {currentPage === "settings" && "Settings"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-medium hidden sm:inline text-gray-700">{user.name || 'User'}</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-bold">
              {getInitials(user.name)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-8 space-y-8">
          {/* Dashboard */}
          {currentPage === "dashboard" && (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">{stat.value}</h2>
                        <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setCurrentPage("myProduce")}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <PlusCircle className="h-6 w-6 text-green-600" />
                    <span className="font-medium text-green-700">Upload New Product</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage("myProduce")}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <Edit className="h-6 w-6 text-blue-600" />
                    <span className="font-medium text-blue-700">Manage Products</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* My Produce */}
          {currentPage === "myProduce" && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-4 lg:p-6 border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    My Products <span className="text-sm font-normal text-gray-500">({myProducts.length})</span>
                  </h2>
                  <button
                    onClick={fetchProducts}
                    className="text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                <div className="space-y-4">
                  {renderProducts()}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 lg:p-6 border shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-green-600" />
                  Upload New Product
                </h2>

                <form onSubmit={handleUploadProduct} className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Fresh Tomatoes"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full border p-3 rounded-xl mt-1 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Price (₦)</label>
                    <input
                      type="number"
                      placeholder="e.g., 1500"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full border p-3 rounded-xl mt-1 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Unit</label>
                    <input
                      type="text"
                      placeholder="e.g., kg, dozen, bunch"
                      value={productForm.unit}
                      onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                      className="w-full border p-3 rounded-xl mt-1 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full border p-3 rounded-xl mt-1 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="grains">Grains</option>
                      <option value="tubers">Tubers</option>
                      <option value="livestock">Livestock</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Product Image</label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.files?.[0] || null })}
                      className="w-full border p-3 rounded-xl mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-green-600 text-white p-4 rounded-xl md:col-span-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    disabled={uploadLoading}
                  >
                    {uploadLoading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-5 w-5" />
                        Upload Product
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Settings */}
          {currentPage === "settings" && (
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
              
              <div className="space-y-4 max-w-md">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium text-gray-800">{user.name || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-800">{user.email || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Role</span>
                  <span className="font-medium text-gray-800 capitalize">{user.role || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Total Products</span>
                  <span className="font-medium text-gray-800">{myProducts.length}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-8 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
              >
                <LogOut className="h-5 w-5" /> 
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