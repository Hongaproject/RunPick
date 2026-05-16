"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { Session, Provider } from "@supabase/supabase-js";

// Supabase 공식 지원 소셜 로그인만 포함 (naver는 공식 미지원이라 제외)
export type SocialProvider = Extract<Provider, "google" | "github" | "kakao">;

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  provider?: "email" | SocialProvider;
  favorites: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: SocialProvider) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (marathonId: string) => void;
  isFavorite: (marathonId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatUser = (supabaseSession: Session): User => ({
    id: supabaseSession.user.id,
    name:
      supabaseSession.user.user_metadata?.full_name ||
      supabaseSession.user.user_metadata?.name ||
      supabaseSession.user.email?.split("@")[0] ||
      "사용자",
    email: supabaseSession.user.email ?? "",
    profileImage: supabaseSession.user.user_metadata?.avatar_url,
    provider:
      (supabaseSession.user.app_metadata?.provider as User["provider"]) ||
      "email",
    favorites: [],
  });

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      if (currentSession) {
        setSession(currentSession);
        setUser(formatUser(currentSession));
      }
      setIsLoading(false);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession) {
        setSession(newSession);
        setUser(formatUser(newSession));
      } else {
        setSession(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  };

  const loginWithProvider = async (provider: SocialProvider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw new Error(error.message);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  };

  const toggleFavorite = (marathonId: string) => {
    if (!user) return;
    setUser({
      ...user,
      favorites: user.favorites.includes(marathonId)
        ? user.favorites.filter((id) => id !== marathonId)
        : [...user.favorites, marathonId],
    });
  };

  const isFavorite = (marathonId: string) => {
    return user?.favorites.includes(marathonId) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        login,
        loginWithProvider,
        signup,
        logout,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
