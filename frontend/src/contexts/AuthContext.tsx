import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // 🔥 IMPORTANT

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= RESTORE SESSION USING COOKIE ================= */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.get('/users/me'); // 🔥 correct backend call
        setUser(response.data);
      } catch (error) {
        console.error('Failed to restore session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /* ================= LOGIN ================= */
  const login = useCallback((userData: User) => {
    setUser(userData);
    navigate('/dashboard');
  }, [navigate]);

  /* ================= LOGOUT ================= */
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout'); // 🔥 correct backend logout
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      navigate('/');
    }
  }, [navigate]);

  const isAuthenticated = !!user;

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};