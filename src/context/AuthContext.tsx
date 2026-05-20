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
  name: string; // 닉네임
  email: string;
  profileImage?: string;
  provider?: "email" | SocialProvider;
  favorites: string[];
  nicknameUpdatedAt?: string | null;
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
  updateNickname: (nickname: string) => Promise<void>;
  canChangeNickname: () => boolean;
  daysUntilNicknameChange: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = async (userId: string): Promise<string[]> => {
    const { data } = await supabase
      .from("user_favorites")
      .select("marathon_id")
      .eq("user_id", userId);
    return data?.map((row) => row.marathon_id) ?? [];
  };

  // profiles 테이블에서 닉네임 로드 (없으면 자동 생성)
  const loadOrCreateProfile = async (
    userId: string,
    fallbackName: string,
  ): Promise<{ nickname: string; nicknameUpdatedAt: string | null }> => {
    const { data } = await supabase
      .from("profiles")
      .select("nickname, nickname_updated_at")
      .eq("id", userId)
      .single();

    if (data) {
      return {
        nickname: data.nickname,
        nicknameUpdatedAt: data.nickname_updated_at,
      };
    }

    // 프로필 없으면 생성
    await supabase.from("profiles").insert({
      id: userId,
      nickname: fallbackName,
    });
    return { nickname: fallbackName, nicknameUpdatedAt: null };
  };

  const formatUser = async (supabaseSession: Session): Promise<User> => {
    const fallbackName =
      supabaseSession.user.user_metadata?.full_name ||
      supabaseSession.user.user_metadata?.name ||
      supabaseSession.user.email?.split("@")[0] ||
      "러너";

    const [favorites, profile] = await Promise.all([
      loadFavorites(supabaseSession.user.id),
      loadOrCreateProfile(supabaseSession.user.id, fallbackName),
    ]);

    return {
      id: supabaseSession.user.id,
      name: profile.nickname,
      email: supabaseSession.user.email ?? "",
      profileImage: supabaseSession.user.user_metadata?.avatar_url,
      provider:
        (supabaseSession.user.app_metadata?.provider as User["provider"]) ||
        "email",
      favorites,
      nicknameUpdatedAt: profile.nicknameUpdatedAt,
    };
  };

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      if (currentSession) {
        setSession(currentSession);
        setUser(await formatUser(currentSession));
      }
      setIsLoading(false);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  };

  const loginWithProvider = async (provider: SocialProvider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
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
      setUser({
        ...user,
        favorites: user.favorites.filter((id) => id !== marathonId),
      });
    } else {
      await supabase
        .from("user_favorites")
        .insert({ user_id: user.id, marathon_id: marathonId });
      setUser({ ...user, favorites: [...user.favorites, marathonId] });
    }
  };

  const isFavorite = (marathonId: string) =>
    user?.favorites.includes(marathonId) ?? false;

  // 닉네임 변경 가능 여부 (30일 제한)
  const canChangeNickname = (): boolean => {
    if (!user?.nicknameUpdatedAt) return true;
    const lastChanged = new Date(user.nicknameUpdatedAt);
    const daysSince =
      (Date.now() - lastChanged.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 30;
  };

  // 다음 변경까지 남은 일수
  const daysUntilNicknameChange = (): number => {
    if (!user?.nicknameUpdatedAt) return 0;
    const lastChanged = new Date(user.nicknameUpdatedAt);
    const daysSince =
      (Date.now() - lastChanged.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(30 - daysSince));
  };

  // 닉네임 변경
  const updateNickname = async (nickname: string) => {
    if (!user) return;
    if (!canChangeNickname())
      throw new Error("닉네임은 30일에 한 번만 변경할 수 있습니다.");

    const now = new Date().toISOString();
    const { error } = await supabase
      .from("profiles")
      .update({ nickname, nickname_updated_at: now })
      .eq("id", user.id);

    if (error) throw new Error(error.message);
    setUser({ ...user, name: nickname, nicknameUpdatedAt: now });
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
        updateNickname,
        canChangeNickname,
        daysUntilNicknameChange,
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
