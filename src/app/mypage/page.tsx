"use client";
import {
  User,
  Mail,
  Heart,
  MessageSquare,
  LogOut,
  Settings,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function MyPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [postLikesCount, setPostLikesCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // 글 좋아요 수 + 작성 글 수 조회
  useEffect(() => {
    if (!user) return;
    supabase
      .from("post_likes")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .then(({ count }) => setPostLikesCount(count ?? 0));

    supabase
      .from("posts")
      .select("id", { count: "exact" })
      .eq("author_id", user.id)
      .then(({ count }) => setPostCount(count ?? 0));
  }, [user]);

  if (isLoading || !user) return null;

  const getProviderName = (provider?: string) => {
    switch (provider) {
      case "kakao":
        return "카카오";
      case "github":
        return "GitHub";
      case "google":
        return "구글";
      default:
        return "이메일";
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="px-8 pb-8">
            <div className="flex items-end mt-4 mb-4">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="ml-6 pb-2">
                <h1 className="text-3xl font-black text-gray-900">
                  {user.name}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>

            {/* 로그인 방식 */}
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                {getProviderName(user.provider)} 로그인
              </span>
            </div>

            {/* 통계 - 즐겨찾기 / 글 좋아요 / 작성 글 */}
            <div className="grid grid-cols-3 gap-4">
              <Link
                href="/favorites"
                className="bg-gradient-to-br from-pink-50 to-red-100 rounded-xl p-4 text-center border border-red-200 hover:shadow-md transition-all"
              >
                <Heart
                  className="w-6 h-6 text-red-500 mx-auto mb-1"
                  fill="currentColor"
                />
                <div className="text-3xl font-black text-red-500 mb-1">
                  {user.favorites.length}
                </div>
                <div className="text-sm text-gray-600">즐겨찾기</div>
              </Link>
              <Link
                href="/liked-posts"
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200 hover:shadow-md transition-all"
              >
                <ThumbsUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div className="text-3xl font-black text-blue-600 mb-1">
                  {postLikesCount}
                </div>
                <div className="text-sm text-gray-600">글 좋아요</div>
              </Link>
              <Link
                href="/community"
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200 hover:shadow-md transition-all"
              >
                <MessageSquare className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div className="text-3xl font-black text-green-600 mb-1">
                  {postCount}
                </div>
                <div className="text-sm text-gray-600">작성 글</div>
              </Link>
            </div>
          </div>
        </div>

        {/* 설정 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">설정</h2>
            <div className="space-y-2">
              <Link
                href="/mypage/edit"
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">계정 설정</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-red-50 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-600">로그아웃</span>
              </button>
            </div>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">최근 활동</h2>
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">아직 활동 내역이 없습니다.</p>
              <Link
                href="/community"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                커뮤니티 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
