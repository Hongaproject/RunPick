"use client";

import { useState, useEffect, useRef, use } from "react";
import {
  ArrowLeft,
  Heart,
  Eye,
  MessageSquare,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getPostById,
  createComment,
  toggleLike,
  checkLiked,
  deletePost,
} from "@/api/community";
import { Post, PostCategory } from "@/types/community";
import { Footer } from "@/components/common/Footer";

const categoryColors: Record<PostCategory, string> = {
  자유: "bg-blue-50 text-blue-700 border-blue-200",
  후기: "bg-green-50 text-green-700 border-green-200",
  질문: "bg-purple-50 text-purple-700 border-purple-200",
  정보: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const viewedRef = useRef(false);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    getPostById(id).then((data) => {
      if (!data) {
        router.push("/community");
        return;
      }
      setPost(data);
      setIsLoading(false);
    });
  }, [id, router]);

  useEffect(() => {
    if (user && id) {
      checkLiked(id, user.id).then(setLiked);
    }
  }, [user, id]);

  if (isLoading || !post)
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        불러오는 중...
      </div>
    );

  const isAuthor = user?.id === post.authorId;

  const handleAddComment = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    const newComment = await createComment(
      post.id,
      commentContent,
      user.id,
      user.name,
    );
    setPost({ ...post, comments: [...post.comments, newComment] });
    setCommentContent("");
  };

  const handleDelete = async () => {
    await deletePost(post.id);
    router.push("/community");
  };

  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    const newLikes = await toggleLike(post.id, user.id);
    setLiked(!liked);
    setPost({ ...post, likes: newLikes });
  };

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/community")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold flex-1">게시글</h1>
              {isAuthor && (
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/community/${post.id}/edit`)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 게시글 본문 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-8">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[post.category]} mb-4`}
                >
                  {post.category}
                </span>
                <h1 className="text-3xl font-black text-gray-900 mb-4">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {post.authorName[0]}
                    </div>
                    <span className="font-medium">{post.authorName}</span>
                  </div>
                  <span>•</span>
                  <span>{post.createdAt}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views}</span>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-8">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all border cursor-pointer ${
                      liked
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-gradient-to-r from-pink-50 to-red-50 text-red-600 border-red-200 hover:from-pink-100 hover:to-red-100"
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                    좋아요 {post.likes}
                  </button>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageSquare className="w-5 h-5" />
                    <span>댓글 {post.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 댓글 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                댓글 {post.comments.length}
              </h2>
              {user ? (
                <div className="flex gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="댓글을 작성해보세요..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleAddComment}
                      className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      댓글 작성
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
                  <p className="text-gray-600 mb-4">
                    로그인 후 댓글을 작성할 수 있습니다.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    로그인
                  </button>
                </div>
              )}
              <div className="space-y-4">
                {post.comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    첫 댓글을 작성해보세요!
                  </div>
                ) : (
                  post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {comment.authorName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-900">
                            {comment.authorName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {comment.createdAt}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              게시글 삭제
            </h3>
            <p className="text-gray-600 mb-6">
              정말로 이 게시글을 삭제하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
