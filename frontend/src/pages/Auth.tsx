import React, { useState } from "react";
import { useAuth, User } from "../contexts/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint =
        activeTab === "login" ? "/auth/login" : "/auth/register";

      const body =
        activeTab === "login"
          ? { email, password }
          : { name, email, password };

      const res = await api.post(endpoint, body);

      login(res.data.user as User, res.data.token);

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
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
            {loading ? "Processing..." : activeTab === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;