import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, User } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ USE AXIOS INSTANCE

const words = ["Faster", "Smarter", "Better"];

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [index, setIndex] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % words.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required");
      return;
    }

    if (activeTab === "register") {
      if (!trimmedName) {
        setError("Name is required");
        return;
      }
      if (trimmedPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);
    setError(null);

    const body =
      activeTab === "login"
        ? { email: trimmedEmail, password: trimmedPassword }
        : {
            name: trimmedName,
            email: trimmedEmail,
            password: trimmedPassword,
          };

    try {
      const response =
        activeTab === "login"
          ? await api.post("/auth/login", body)
          : await api.post("/auth/register", body);

      // ✅ IMPORTANT: token field
      login(response.data.user as User, response.data.token);

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Authentication failed"
      );
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl w-full">
        <div>
          <h1 className="text-6xl font-bold text-white">
            Find Your Dream Job{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={words[index]}
                className="text-purple-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>{" "}
            with AI
          </h1>
        </div>

        <div className="bg-gray-800 p-8 rounded-xl">
          <div className="flex mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`w-1/2 ${
                activeTab === "login" ? "text-white" : "text-gray-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`w-1/2 ${
                activeTab === "register" ? "text-white" : "text-gray-400"
              }`}
            >
              Register
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "register" && (
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 py-3 rounded disabled:bg-gray-500"
            >
              {loading
                ? "Processing..."
                : activeTab === "login"
                ? "Login"
                : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;