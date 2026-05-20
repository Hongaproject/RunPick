"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createPost } from "@/api/community";
import { PostCategory } from "@/types/community";

const categories: PostCategory[] = ["자유", "후기", "질문", "정보"];

export default function PostWritePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>("자유");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "제목을 입력해주세요.";
    else if (title.length < 2)
      newErrors.title = "제목은 2자 이상이어야 합니다.";
    if (!content.trim()) newErrors.content = "내용을 입력해주세요.";
    else if (content.length < 10)
      newErrors.content = "내용은 10자 이상이어야 합니다.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const post = await createPost(
        title,
        content,
        category,
        user.id,
        user.name,
      );
      router.push(`/community/${post.id}`);
    } catch {
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">글쓰기</h1>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? "작성 중..." : "작성 완료"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* 카테고리 */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  카테고리
                </label>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                        category === cat
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* 제목 */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg font-medium ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* 내용 */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  내용
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  }`}
                  rows={15}
                />
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600">{errors.content}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">{content.length}자</p>
              </div>

              {/* 작성 팁 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">작성 팁</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 제목은 간결하고 명확하게 작성해주세요.</li>
                  <li>
                    • 다른 사람에게 도움이 되는 유익한 정보를 공유해주세요.
                  </li>
                  <li>• 존중하는 언어를 사용해주세요.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
