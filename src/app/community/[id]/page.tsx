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
  Check,
  X,
  CornerDownRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getPostById,
  createComment,
  toggleLike,
  checkLiked,
  deletePost,
  updateComment,
  deleteComment,
} from "@/api/community";
import { Post, Comment, PostCategory } from "@/types/community";
import { supabase } from "@/lib/supabase";
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
  const trackedViewRef = useRef(false); // 조회수 중복 방지

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

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

  // post_views 기반 조회수 처리 — useRef로 setState 없이 1회만 실행
  useEffect(() => {
    if (trackedViewRef.current) return;
    if (isLoading) return;
    trackedViewRef.current = true;
    supabase.rpc("increment_views", { post_id: id });
  }, [id, isLoading]);

  useEffect(() => {
    if (user && id) checkLiked(id, user.id).then(setLiked);
  }, [user, id]);

  if (isLoading || !post)
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        불러오는 중...
      </div>
    );

  const isAuthor = user?.id === post.authorId;

  // 댓글 작성 (Ctrl+Enter 또는 버튼)
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

  const handleCommentKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    // Enter 단독: 작성 / Shift+Enter: 줄바꿈
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // 대댓글 작성 (Ctrl+Enter 또는 버튼)
  const handleAddReply = async (parentId: string) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    if (!replyContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    const newReply = await createComment(
      post.id,
      replyContent,
      user.id,
      user.name,
      parentId,
    );
    setPost({
      ...post,
      comments: post.comments.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies ?? []), newReply] }
          : c,
      ),
    });
    setReplyContent("");
    setReplyingToId(null);
  };

  const handleReplyKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    parentId: string,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddReply(parentId);
    }
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

  const handleStartEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    setReplyingToId(null);
  };

  // 댓글 수정 확인 (Ctrl+Enter 지원)
  const handleConfirmEdit = async (
    commentId: string,
    isReply: boolean,
    parentId?: string,
  ) => {
    if (!editingContent.trim()) return;
    await updateComment(commentId, editingContent);

    const newContent = editingContent;

    if (isReply && parentId) {
      setPost({
        ...post,
        comments: post.comments.map((c) =>
          c.id === parentId
            ? {
                ...c,
                replies: (c.replies ?? []).map((r: Comment) =>
                  r.id === commentId ? { ...r, content: newContent } : r,
                ),
              }
            : c,
        ),
      });
    } else {
      setPost({
        ...post,
        comments: post.comments.map((c) =>
          c.id === commentId ? { ...c, content: newContent } : c,
        ),
      });
    }
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    commentId: string,
    isReply: boolean,
    parentId?: string,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConfirmEdit(commentId, isReply, parentId);
    }
    if (e.key === "Escape") {
      setEditingCommentId(null);
      setEditingContent("");
    }
  };

  const handleConfirmDelete = async (
    commentId: string,
    isReply: boolean,
    parentId?: string,
  ) => {
    await deleteComment(commentId);
    if (isReply && parentId) {
      setPost({
        ...post,
        comments: post.comments.map((c) =>
          c.id === parentId
            ? {
                ...c,
                replies: (c.replies ?? []).filter(
                  (r: Comment) => r.id !== commentId,
                ),
              }
            : c,
        ),
      });
    } else {
      setPost({
        ...post,
        comments: post.comments.filter((c) => c.id !== commentId),
      });
    }
    setDeletingCommentId(null);
  };

  const totalCommentCount = post.comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length ?? 0),
    0,
  );

  const renderComment = (
    comment: Comment,
    isReply = false,
    parentId?: string,
  ) => (
    <div
      key={comment.id}
      className={`flex gap-3 p-4 rounded-lg ${isReply ? "bg-blue-50/50 border border-blue-100" : "bg-gray-50"}`}
    >
      {isReply && (
        <CornerDownRight className="w-4 h-4 text-blue-400 mt-3 shrink-0" />
      )}
      <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm">
        {comment.authorName[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">
              {comment.authorName}
            </span>
            <span className="text-xs text-gray-400">{comment.createdAt}</span>
          </div>
          <div className="flex items-center gap-1">
            {user?.id === comment.authorId &&
              (editingCommentId === comment.id ? (
                <>
                  <button
                    onClick={() =>
                      handleConfirmEdit(comment.id, isReply, parentId)
                    }
                    className="p-1.5 hover:bg-green-100 text-green-600 rounded transition-colors cursor-pointer"
                    title="수정 완료 (Ctrl+Enter)"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingContent("");
                    }}
                    className="p-1.5 hover:bg-gray-200 text-gray-500 rounded transition-colors cursor-pointer"
                    title="취소 (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleStartEdit(comment.id, comment.content)}
                    className="p-1.5 hover:bg-blue-100 text-blue-500 rounded transition-colors cursor-pointer"
                    title="수정"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingCommentId(comment.id)}
                    className="p-1.5 hover:bg-red-100 text-red-500 rounded transition-colors cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ))}
            {!isReply && user && (
              <button
                onClick={() => {
                  setReplyingToId(
                    replyingToId === comment.id ? null : comment.id,
                  );
                  setReplyContent("");
                }}
                className="p-1.5 hover:bg-purple-100 text-purple-500 rounded transition-colors cursor-pointer flex items-center gap-1"
                title="답글"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                <span className="text-xs">답글</span>
              </button>
            )}
          </div>
        </div>

        {/* 수정 중 / 일반 텍스트 */}
        {editingCommentId === comment.id ? (
          <>
            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              onKeyDown={(e) =>
                handleEditKeyDown(e, comment.id, isReply, parentId)
              }
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
              rows={3}
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter로 저장 · Shift+Enter 줄바꿈 · Esc 취소
            </p>
          </>
        ) : (
          <p className="text-gray-700 text-sm">{comment.content}</p>
        )}

        {/* 삭제 확인 인라인 */}
        {deletingCommentId === comment.id && (
          <div className="mt-2 flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
            <span className="text-sm text-red-700 flex-1">
              댓글을 삭제할까요?
            </span>
            <button
              onClick={() => handleConfirmDelete(comment.id, isReply, parentId)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              삭제
            </button>
            <button
              onClick={() => setDeletingCommentId(null)}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded font-medium hover:bg-gray-300 transition-colors cursor-pointer"
            >
              취소
            </button>
          </div>
        )}

        {/* 대댓글 작성 폼 */}
        {!isReply && replyingToId === comment.id && (
          <div className="mt-3 flex gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-xs">
              {user?.name[0]}
            </div>
            <div className="flex-1">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => handleReplyKeyDown(e, comment.id)}
                placeholder={`${comment.authorName}님에게 답글 작성...`}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-sm"
                rows={2}
                autoFocus
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-gray-400">
                  Enter로 작성 · Shift+Enter 줄바꿈
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    className="px-4 py-1.5 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-bold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    답글 작성
                  </button>
                  <button
                    onClick={() => {
                      setReplyingToId(null);
                      setReplyContent("");
                    }}
                    className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 대댓글 목록 */}
        {!isReply && (comment.replies ?? []).length > 0 && (
          <div className="mt-3 space-y-3 pl-2 border-l-2 border-blue-100">
            {(comment.replies ?? []).map((reply: Comment) =>
              renderComment(reply, true, comment.id),
            )}
          </div>
        )}
      </div>
    </div>
  );

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
                    <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
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
                        : "bg-linear-to-r from-pink-50 to-red-50 text-red-600 border-red-200 hover:from-pink-100 hover:to-red-100"
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                    좋아요 {post.likes}
                  </button>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageSquare className="w-5 h-5" />
                    <span>댓글 {totalCommentCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                댓글 {totalCommentCount}
              </h2>

              {user ? (
                <div className="flex gap-3 mb-6">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      onKeyDown={handleCommentKeyDown}
                      placeholder="댓글을 작성해보세요..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">
                        Enter로 작성 · Shift+Enter 줄바꿈
                      </p>
                      <button
                        onClick={handleAddComment}
                        className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        댓글 작성
                      </button>
                    </div>
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
                  post.comments.map((comment) => renderComment(comment))
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>

      {/* 게시글 삭제 모달 */}
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
