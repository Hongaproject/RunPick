"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, MessageSquare, Eye, Clock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Post, PostCategory } from "@/types/community";
import { Footer } from "@/components/common/Footer";

const categoryColors: Record<PostCategory, string> = {
  자유: "bg-blue-50 text-blue-700 border-blue-200",
  후기: "bg-green-50 text-green-700 border-green-200",
  질문: "bg-purple-50 text-purple-700 border-purple-200",
  정보: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function LikedPostsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;

    // 내가 좋아요 누른 post_id 목록 → 해당 게시글 조회
    supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .then(async ({ data: likes }) => {
        if (!likes || likes.length === 0) {
          setIsFetching(false);
          return;
        }

        const postIds = likes.map((l) => l.post_id);

        const { data } = await supabase
          .from("posts")
          .select("*, comments(*)")
          .in("id", postIds)
          .order("created_at", { ascending: false });

        if (data) {
          setPosts(
            data.map((row) => ({
              id: row.id,
              title: row.title,
              content: row.content,
              category: row.category as PostCategory,
              authorId: row.author_id,
              authorName: row.author_name,
              views: row.views,
              likes: row.likes,
              createdAt: new Date(row.created_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              updatedAt: row.updated_at,
              comments: row.comments ?? [],
            })),
          );
        }
        setIsFetching(false);
      });
  }, [user]);

  if (isLoading || !user) return null;

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <ThumbsUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  좋아요한 글
                </h1>
                <p className="text-gray-600 mt-1">
                  내가 좋아요 누른 게시글 {posts.length}개
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 목록 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isFetching ? (
              <div className="text-center py-20 text-gray-400">
                불러오는 중...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <ThumbsUp className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  좋아요한 글이 없습니다
                </h3>
                <p className="text-gray-600 mb-6">
                  커뮤니티에서 마음에 드는 글에 좋아요를 눌러보세요!
                </p>
                <Link
                  href="/community"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  커뮤니티 둘러보기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link key={post.id} href={`/community/${post.id}`}>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[post.category]}`}
                            >
                              {post.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{post.authorName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600 font-medium">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
