import { useState, useEffect } from 'react';
import { authStorage } from '@/lib/auth';
import { api } from '@/lib/api';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(authStorage.getUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    if (token && !user) {
      validateToken();
    }
  }, []);

  const validateToken = async () => {
    try {
      setIsLoading(true);
      const response = await api.auth.me();
      setUser(response.user);
      authStorage.setUser(response.user);
    } catch (error) {
      authStorage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { username: string; password: string; rememberMe?: boolean }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.auth.login(credentials);
      
      authStorage.setToken(response.token);
      authStorage.setUser(response.user);
      setUser(response.user);
      
      return response;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.auth.register(data);
      
      authStorage.setToken(response.token);
      authStorage.setUser(response.user);
      setUser(response.user);
      
      return response;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authStorage.clear();
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      authStorage.setUser(updatedUser);
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };
}
