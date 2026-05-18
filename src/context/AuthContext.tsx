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
  toggleFavorite: (marathonId: string) => Promise<void>;
  isFavorite: (marathonId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 즐겨찾기 목록 Supabase에서 로드
  const loadFavorites = async (userId: string): Promise<string[]> => {
    const { data } = await supabase
      .from("user_favorites")
      .select("marathon_id")
      .eq("user_id", userId);
    return data?.map((row) => row.marathon_id) ?? [];
  };

  const formatUser = async (supabaseSession: Session): Promise<User> => {
    const favorites = await loadFavorites(supabaseSession.user.id);
    return {
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
      favorites,
    };
  };

  useEffect(() => {
    const initSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        setSession(currentSession);
        setUser(await formatUser(currentSession));
      }
      setIsLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession) {
        setSession(newSession);
        setUser(await formatUser(newSession));
      } else {
        setSession(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const loginWithProvider = async (provider: SocialProvider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(error.message);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  };

  const toggleFavorite = async (marathonId: string) => {
    if (!user) return;

    const isFav = user.favorites.includes(marathonId);

    if (isFav) {
      await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("marathon_id", marathonId);
      setUser({ ...user, favorites: user.favorites.filter((id) => id !== marathonId) });
    } else {
      await supabase
        .from("user_favorites")
        .insert({ user_id: user.id, marathon_id: marathonId });
      setUser({ ...user, favorites: [...user.favorites, marathonId] });
    }
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
