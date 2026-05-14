import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  provider?: 'email' | 'kakao' | 'naver' | 'github' | 'google';
  favorites: string[]; // Marathon IDs
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: 'kakao' | 'naver' | 'github' | 'google') => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleFavorite: (marathonId: string) => void;
  isFavorite: (marathonId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login - 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '1',
      name: '홍길동',
      email,
      provider: 'email',
      favorites: [],
    });
  };

  const loginWithProvider = async (provider: 'kakao' | 'naver' | 'github' | 'google') => {
    // Mock social login - 실제로는 OAuth 처리
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '1',
      name: '홍길동',
      email: `user@${provider}.com`,
      provider,
      favorites: [],
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup - 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '1',
      name,
      email,
      provider: 'email',
      favorites: [],
    });
  };

  const logout = () => {
    setUser(null);
  };

  const toggleFavorite = (marathonId: string) => {
    if (!user) return;

    setUser({
      ...user,
      favorites: user.favorites.includes(marathonId)
        ? user.favorites.filter(id => id !== marathonId)
        : [...user.favorites, marathonId],
    });
  };

  const isFavorite = (marathonId: string) => {
    return user?.favorites.includes(marathonId) ?? false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithProvider,
      signup,
      logout,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
