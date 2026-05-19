"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Mail,
  User,
  MessageSquare,
  Tag,
} from "lucide-react";
import Link from "next/link";

const categories = [
  { value: "general", label: "일반 문의" },
  { value: "bug", label: "버그 신고" },
  { value: "feature", label: "기능 제안" },
  { value: "other", label: "기타" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "general",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "이름을 입력해주세요.";
    if (!form.email.trim()) newErrors.email = "이메일을 입력해주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    if (!form.message.trim()) newErrors.message = "문의 내용을 입력해주세요.";
    else if (form.message.length < 10)
      newErrors.message = "문의 내용을 10자 이상 입력해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", category: "general", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-full bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">문의하기</h1>
          <p className="text-gray-600">
            RunPick에 대한 문의사항을 남겨주세요. <br />
            빠른 시일 내에 답변 드리겠습니다.
          </p>
        </div>

        {/* 성공 메시지 */}
        {status === "success" && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 mb-6">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">문의가 접수되었습니다!</p>
              <p className="text-sm text-green-600">
                입력하신 이메일로 답변 드리겠습니다.
              </p>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {status === "error" && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>전송에 실패했습니다. 잠시 후 다시 시도해주세요.</p>
          </div>
        )}

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
        >
          {/* 이름 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <User className="w-4 h-4 text-blue-600" />
              이름
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="홍길동"
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Mail className="w-4 h-4 text-blue-600" />
              이메일
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* 문의 유형 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Tag className="w-4 h-4 text-blue-600" />
              문의 유형
            </label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    form.category === cat.value
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 문의 내용 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              문의 내용
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="문의하실 내용을 자세히 작성해주세요."
              rows={6}
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.message ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.message ? (
                <p className="text-sm text-red-600">{errors.message}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">
                {form.message.length}자
              </span>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            <Send className="w-5 h-5" />
            {status === "loading" ? "전송 중..." : "문의 보내기"}
          </button>
        </form>

        {/* 하단 링크 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          커뮤니티에서 다른 사용자와 이야기하고 싶으신가요?{" "}
          <Link
            href="/community"
            className="text-blue-600 font-medium hover:underline"
          >
            커뮤니티 바로가기
          </Link>
        </p>
      </div>
    </div>
  );
}
