"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { Hint } from "@/components/demo/kit";
import { SpinnerIcon } from "../loading/shared";

// 자동 재생: 위 → 아래로 스크롤 → 바닥에서 불러오는 중 → 새 글이 붙어 계속 내려감
const SCRIPT = [700, 900, 800, 1000] as const;
const BATCH = 6;
const MAX_GOOD = BATCH * 4;
const ROW = 40; // 한 줄 높이(px)

function Row({ n }: { n: number }) {
  return (
    <li className="flex h-10 items-center gap-2.5 border-b border-line px-3 text-xs">
      <span aria-hidden className="size-6 shrink-0 rounded-full bg-surface-3" />
      <span>게시글 {n}</span>
    </li>
  );
}

export default function InfiniteScrollDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const [count, setCount] = useState(BATCH * 2);
  const [loading, setLoading] = useState(false);
  const [announce, setAnnounce] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const done = !bad && count >= MAX_GOOD;

  // 바닥 표시(sentinel)가 스크롤 영역 안에 들어오면 다음 묶음을 불러온다
  useEffect(() => {
    if (step !== null || done) return;
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !loading) setLoading(true);
      },
      { root, rootMargin: "0px 0px 40px 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [step, done, loading]);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      setCount((c) => c + BATCH);
      setLoading(false);
      setAnnounce(`글 ${BATCH}개를 더 불러왔어요`);
    }, 700);
    return () => clearTimeout(t);
  }, [loading]);

  if (step !== null) {
    // 자동 재생: 실제 스크롤 대신 목록을 위로 밀어 보여 준다
    const shown = step >= 3 ? 14 : 8;
    const offset = [0, 3.2, 4, 6.5][step] * ROW;
    return (
      <div className="relative h-full overflow-hidden">
        <motion.ul animate={{ y: -offset }} transition={{ duration: step === 0 ? 0 : 0.7, ease: "easeInOut" }}>
          {Array.from({ length: shown }, (_, i) => (
            <Row key={i} n={i + 1} />
          ))}
          {step === 2 && (
            <li className="flex h-10 items-center justify-center text-muted">
              <SpinnerIcon className="size-4" />
            </li>
          )}
        </motion.ul>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col pb-7">
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label="게시글 목록, 스크롤하면 더 불러옵니다"
        aria-busy={loading}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        <ul>
          {Array.from({ length: count }, (_, i) => (
            <Row key={i} n={i + 1} />
          ))}
        </ul>
        <div ref={sentinelRef} className="flex h-12 items-center justify-center text-xs text-muted">
          {loading ? (
            <SpinnerIcon className="size-4" />
          ) : done ? (
            "모든 글을 봤어요"
          ) : null}
        </div>
        {/* 나쁜 예: 바닥글이 있지만 다가갈 때마다 새 글이 붙어 영영 닿을 수 없다 */}
        <footer className="border-t border-line bg-surface-2 px-3 py-3 text-[11px] text-muted">
          고객센터 · 이용약관 · 회사 정보
        </footer>
      </div>
      <p role="status" className="sr-only">
        {announce}
      </p>
      <Hint>
        {bad ? "아래 '고객센터'에 닿으려 해도 글이 계속 붙어요" : `스크롤하면 더 불러와요 · ${count}개`}
      </Hint>
    </div>
  );
}
