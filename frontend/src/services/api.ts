import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

const ProfilePage: React.FC = () => {
  const { user, setUser, loading: authLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await api.put('/users/profile', { name, email });
      if (response.status === 200) {
        setUser(response.data); // Update global user state
        setSuccessMessage('Profile updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update profile.');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center p-8 text-red-500">Could not load user profile. Please log in again.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4 md:p-8"
    >
      <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>
      
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}
          {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white font-bold py-3 rounded-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
