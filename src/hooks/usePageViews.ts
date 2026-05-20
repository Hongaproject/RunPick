"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface PageViewStats {
  total: number;
  today: number;
  yesterday: number;
}

export function usePageViews() {
  const [stats, setStats] = useState<PageViewStats>({
    total: 0,
    today: 0,
    yesterday: 0,
  });

  useEffect(() => {
    const recordAndFetch = async () => {
      // 오늘 날짜 키 (예: "pv_2026-05-21")
      const todayKey = `pv_${new Date().toISOString().split("T")[0]}`;
      const alreadyVisited = localStorage.getItem(todayKey);

      // 오늘 처음 방문일 때만 기록
      if (!alreadyVisited) {
        await supabase.from("page_views").insert({});
        localStorage.setItem(todayKey, "1");

        // 어제 키 삭제 (localStorage 정리)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = `pv_${yesterday.toISOString().split("T")[0]}`;
        localStorage.removeItem(yesterdayKey);
      }

      // 날짜 계산
      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(todayStart.getDate() - 1);

      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayStart.getDate() + 1);

      // 전체 카운트
      const { count: total } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true });

      // 오늘 카운트
      const { count: today } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("visited_at", todayStart.toISOString())
        .lt("visited_at", todayEnd.toISOString());

      // 어제 카운트
      const { count: yesterday } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("visited_at", yesterdayStart.toISOString())
        .lt("visited_at", todayStart.toISOString());

      setStats({
        total: total ?? 0,
        today: today ?? 0,
        yesterday: yesterday ?? 0,
      });
    };

    recordAndFetch();
  }, []);

  return stats;
}
