import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axiosInstance, { TOKEN_KEY, setOnAuthFailure } from '../utils/axiosInstance';
import storage from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    await storage.remove(TOKEN_KEY);
    setUser(null);
  }, []);

  // On launch: restore the stored token and validate it against /me/.
  // A 401 here goes through the axios refresh flow automatically; if the
  // refresh also fails, the interceptor clears the token and calls logout.
  useEffect(() => {
    setOnAuthFailure(() => setUser(null));

    (async () => {
      try {
        const token = await storage.get(TOKEN_KEY);
        if (token?.access) {
          const { data } = await axiosInstance.get('/me/');
          setUser(data);
        }
      } catch (error) {
        console.warn('Session restore failed', error?.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data: token } = await axiosInstance.post('/login/', credentials);
    await storage.set(TOKEN_KEY, token);
    const { data: profile } = await axiosInstance.get('/me/');
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback(async (details) => {
    const { data } = await axiosInstance.post('/register/', details);
    return data;
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}
