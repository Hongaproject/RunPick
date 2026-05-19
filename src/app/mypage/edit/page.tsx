"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, User, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function EditProfilePage() {
  const {
    user,
    isLoading,
    updateNickname,
    canChangeNickname,
    daysUntilNicknameChange,
  } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState(() => user?.name ?? "");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  // user 로드 후 nickname이 비어있으면 user.name 사용
  const displayNickname = nickname || user?.name || "";

  if (isLoading || !user) return null;

  const canChange = canChangeNickname();
  const daysLeft = daysUntilNicknameChange();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!nickname.trim()) {
      setErrorMsg("닉네임을 입력해주세요.");
      return;
    }
    if (nickname.length < 2) {
      setErrorMsg("닉네임은 2자 이상이어야 합니다.");
      return;
    }
    if (nickname.length > 15) {
      setErrorMsg("닉네임은 15자 이하여야 합니다.");
      return;
    }
    if (nickname === user.name) {
      setErrorMsg("현재 닉네임과 동일합니다.");
      return;
    }
    if (!canChange) {
      setErrorMsg(
        `닉네임은 30일에 한 번만 변경할 수 있습니다. (${daysLeft}일 후 가능)`,
      );
      return;
    }

    setStatus("loading");
    try {
      await updateNickname(nickname);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "변경에 실패했습니다.");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black text-gray-900">계정 설정</h1>
      </div>

      {/* 성공 메시지 */}
      {status === "success" && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 mb-6">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">닉네임이 변경되었습니다!</p>
            <p className="text-sm text-green-600">
              다음 변경은 30일 후에 가능합니다.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* 현재 프로필 */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* 닉네임 변경 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={displayNickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={!canChange}
              placeholder="닉네임 입력"
              maxLength={15}
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !canChange
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
                  : "border-gray-300"
              }`}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400">
                2~15자, 한 달에 1번 변경 가능
              </p>
              <p className="text-xs text-gray-400">
                {displayNickname.length}/15
              </p>
            </div>

            {/* 변경 불가 안내 */}
            {!canChange && (
              <div className="flex items-center gap-2 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-700">
                  닉네임 변경까지{" "}
                  <span className="font-bold">{daysLeft}일</span> 남았습니다.
                </p>
              </div>
            )}

            {/* 에러 메시지 */}
            {errorMsg && (
              <div className="flex items-center gap-2 mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!canChange || status === "loading"}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "변경 중..." : "닉네임 변경"}
          </button>
        </form>
      </div>
    </div>
  );
}
