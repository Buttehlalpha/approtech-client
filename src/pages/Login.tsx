import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Leaf } from "lucide-react";
import hero1 from "../assets/hero1.jpg";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      console.log(res.data);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      toast.success("Login successful! 🎉");

      const role = res.data.user.role;

      // delay so user sees message
      setTimeout(() => {
        if (role === "buyer") {
          navigate("/marketplace");
        } else {
          navigate("/dashboard");
        }
      }, 800);

    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE */}
      <div className="hidden w-1/2 lg:block relative">
        <img
          src={hero1}
          alt="Farm"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 gradient-hero" />

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="font-display text-4xl font-bold text-primary-foreground">
              Welcome Back
            </h2>

            <p className="mt-3 font-body text-lg text-primary-foreground/80">
              Access your farm dashboard and manage your produce listings.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>

            <span className="font-display text-xl font-bold text-foreground">
              AproTeach
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground">
            Sign in to your account
          </h1>

          <p className="mt-2 font-body text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>

          {/* ERROR - Keep for inline display too */}
          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >

            <div>
              <Label className="font-body">
                Email
              </Label>

              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="font-body">
                Password
              </Label>

              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="mt-1"
                required
              />
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;