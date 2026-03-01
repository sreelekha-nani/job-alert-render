import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const ProfilePage: React.FC = () => {
  const { user, setUser, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.put("/users/profile", { name, email });
      setUser(res.data);
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setMessage(
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <div>Please login again.</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl text-white mb-6">My Profile</h1>

      <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 px-6 py-2 rounded text-white"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="text-green-400">{message}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;