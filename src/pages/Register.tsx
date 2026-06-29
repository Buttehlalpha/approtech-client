import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import hero1 from "../assets/hero1.jpg";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess("Account created successfully 🎉");

      setTimeout(() => {
        if (res.data.user.role === "buyer") {
          navigate("/marketplace");
        } else {
          navigate("/dashboard");
        }
      }, 800);

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      setError(
        error.response?.data?.message || "Registration failed"
      );
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
          alt="Agriculture"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 gradient-hero" />

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="font-display text-4xl font-bold text-primary-foreground">
              Join AgriConnect
            </h2>

            <p className="mt-3 font-body text-lg text-primary-foreground/80">
              Connecting farmers and buyers for fresh, local agricultural produce.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border bg-white shadow-sm">
              <img
                src="/logo.jpg"
                alt="AgriConnect Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <span className="font-display text-xl font-bold text-foreground">
              AgriConnect
            </span>
          </div>

          {/* TITLE */}
          <h1 className="font-display text-2xl font-bold text-foreground">
            Create your account
          </h1>

          <p className="mt-2 font-body text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>

          {/* ERROR */}
          {error && (
            <p className="mt-4 text-sm text-red-500">{error}</p>
          )}

          {/* SUCCESS */}
          {success && (
            <p className="mt-4 text-sm text-green-600 font-medium">
              {success}
            </p>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {/* ROLE */}
            <div>
              <Label>I am a</Label>

              <div className="mt-2 flex gap-3">
                {["buyer", "farmer"].map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant={
                      form.role === role ? "default" : "outline"
                    }
                    className="flex-1 capitalize"
                    onClick={() =>
                      setForm({ ...form, role })
                    }
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;