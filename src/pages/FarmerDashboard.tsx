import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

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
} from "lucide-react";

import freshProduce from "@/assets/fresh-produce.jpg";

const FarmerDashboard = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const deleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get correct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return freshProduce;
    if (imagePath.startsWith('http')) return imagePath;
    // If it's a relative path from the backend
    return `${API_URL}/${imagePath}`;
  };

  const handleUploadProduct = async (e: React.FormEvent) => {
    e.preventDefault();

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

      await axios.post(
        `${API_URL}/api/products/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product uploaded successfully 🎉");

      setProductForm({
        name: "",
        price: "",
        unit: "",
        category: "vegetables",
        image: null,
      });
      setPreviewImage(null); // Clear preview after upload

      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f7faf7]">

      {/* SIDEBAR */}
      <aside className="fixed flex h-full w-72 flex-col border-r bg-white p-6">

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
            onClick={() => setCurrentPage("dashboard")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-green-50"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </button>

          <button
            onClick={() => setCurrentPage("myProduce")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-green-50"
          >
            <Package className="h-5 w-5" />
            My Produce
          </button>

          <button
            onClick={() => setCurrentPage("settings")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-green-50"
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="ml-72 flex-1">

        {/* TOPBAR */}
        <div className="flex h-16 items-center justify-between border-b bg-white px-8">

          <h1 className="text-xl font-bold">
            Farmer Dashboard
          </h1>

          {/* AVATAR (REPLACED WELCOME TEXT) */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-bold">
              {getInitials(user.name)}
            </div>
            <span className="font-medium">
              {user.name}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-8">

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
                      <h2 className="text-3xl font-bold">
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

              <div className="rounded-2xl bg-white p-6">
                <h2 className="text-xl font-semibold mb-6">
                  My Products
                </h2>

                <div className="space-y-4">
                  {myProducts.map((product: any) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-4 border p-4 rounded-xl"
                    >
                      <img
                        src={getImageUrl(product.image)}
                        className="h-14 w-14 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = freshProduce;
                        }}
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ₦{Number(product.price).toLocaleString()}
                        </p>
                      </div>

                      <button onClick={() => deleteProduct(product._id)}>
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* UPLOAD */}
              <div className="rounded-2xl bg-white p-6">
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
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: e.target.value,
                      })
                    }
                    className="border p-3 rounded-xl"
                  />

                  <input
                    type="text"
                    placeholder="Unit"
                    value={productForm.unit}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        unit: e.target.value,
                      })
                    }
                    className="border p-3 rounded-xl"
                  />

                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        setPreviewImage(URL.createObjectURL(file));
                        setProductForm({
                          ...productForm,
                          image: file,
                        });
                      }
                    }}
                    className="border p-3 rounded-xl"
                  />

                  {/* Image Preview */}
                  {previewImage && (
                    <div className="md:col-span-2">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="h-32 w-32 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setProductForm({
                            ...productForm,
                            image: null,
                          });
                        }}
                        className="mt-2 text-sm text-red-600 hover:underline"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}

                  <button
                    className="bg-green-600 text-white p-3 rounded-xl md:col-span-2"
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

              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>

              <button
                onClick={handleLogout}
                className="mt-6 bg-red-600 text-white px-4 py-2 rounded-xl"
              >
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