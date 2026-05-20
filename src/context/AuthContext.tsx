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
  nicknameUpdatedAt?: string;
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
  updateNickname: (newNickname: string) => Promise<void>;
  canChangeNickname: () => boolean;
  daysUntilNicknameChange: () => number;
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
    nicknameUpdatedAt: supabaseSession.user.user_metadata?.nickname_updated_at,
  });

  useEffect(() => {
    // 앱 시작 시 세션 복원
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

    // 로그인/로그아웃/토큰갱신 실시간 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === "SIGNED_IN" && newSession) {
        setSession(newSession);
        setUser(formatUser(newSession));
        setIsLoading(false);

        // OAuth 로그인 후 URL 해시 제거
        if (window.location.hash.includes("access_token")) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
      } else if (event === "TOKEN_REFRESHED" && newSession) {
        setSession(newSession);
        setUser(formatUser(newSession));
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
        scopes: provider === "kakao" ? "profile_nickname" : undefined,
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

  // 💡 [추가] 닉네임 업데이트 함수 구현 (Supabase Auth Metadata 활용)
  const updateNickname = async (newNickname: string) => {
    if (!user) throw new Error("로그인이 필요합니다.");

    const now = new Date().toISOString();

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: newNickname,
        nickname_updated_at: now,
      },
    });

    if (error) throw new Error(error.message);

    // Context 상태 앱에 즉시 반영
    if (data?.user) {
      setUser({
        ...user,
        name: newNickname,
        nicknameUpdatedAt: now,
      });
    }
  };

  // 💡 [추가] 변경 가능 여부 체크 (30일 제한 익스파이어 계산)
  const canChangeNickname = () => {
    if (!user?.nicknameUpdatedAt) return true;

    const lastUpdate = new Date(user.nicknameUpdatedAt).getTime();
    const now = new Date().getTime();
    const daysDiff = (now - lastUpdate) / (1000 * 60 * 60 * 24);

    return daysDiff >= 30;
  };

  // 💡 [추가] 남은 일수 계산 함수
  const daysUntilNicknameChange = () => {
    if (!user?.nicknameUpdatedAt) return 0;

    const lastUpdate = new Date(user.nicknameUpdatedAt).getTime();
    const now = new Date().getTime();
    const daysDiff = (now - lastUpdate) / (1000 * 60 * 60 * 24);
    const remaining = Math.ceil(30 - daysDiff);

    return remaining > 0 ? remaining : 0;
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
