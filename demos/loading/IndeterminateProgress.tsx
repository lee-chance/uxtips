"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, FakeList, Hint, Tap } from "@/components/demo/kit";
import { useInterval } from "./shared";

// 자동 재생: 대기 → 누름 → 비결정형 바 → 결과
const SCRIPT = [600, 250, 1700, 1100] as const;

function LoopBar() {
  return (
    <div role="progressbar" aria-label="불러오는 중" className="relative h-1 overflow-hidden bg-accent-soft">
      <div className="absolute inset-y-0 left-0 w-full origin-left animate-[indeterminate_1.3s_ease-in-out_infinite] bg-accent motion-reduce:w-2/5 motion-reduce:animate-none" />
    </div>
  );
}

export default function IndeterminateProgressDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);
  const bad = variant === "bad";

  // 좋은 예: 2.5초짜리 검색. 나쁜 예: 끝을 모르는 긴 내보내기에 같은 바를 씀
  useEffect(() => {
    if (phase !== "loading" || bad) return;
    const t = setTimeout(() => setPhase("done"), 2500);
    return () => clearTimeout(t);
  }, [phase, bad]);

  useInterval(() => setElapsed((s) => s + 1), phase === "loading" && bad ? 1000 : null);

  const current = step === null ? phase : step === 2 ? "loading" : step === 3 ? "done" : "idle";
  const loading = current === "loading";

  return (
    <div className="flex h-full flex-col">
      <AppBar title={bad ? "보고서" : "검색"} />
      <div className="h-1">{loading && <LoopBar />}</div>
      <div className="flex items-center gap-2 px-3 pt-3">
        <div className="flex h-8 flex-1 items-center rounded-lg border border-line px-2.5 text-xs text-muted">
          {bad ? "2024년 전체 거래 내역" : "제주 숙소"}
        </div>
        <DemoButton
          size="sm"
          disabled={loading}
          onClick={() => {
            setElapsed(0);
            setPhase("loading");
          }}
        >
          {bad ? "내보내기" : "검색"}
        </DemoButton>
      </div>
      <Tap show={step === 1} x="calc(100% - 36px)" y="68px" />

      <div aria-busy={loading} className="flex-1 overflow-hidden">
        <span role="status" className="sr-only">
          {loading ? "불러오는 중" : current === "done" ? "결과를 불러왔어요" : ""}
        </span>
        {current === "done" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FakeList rows={3} />
          </motion.div>
        )}
        {bad && loading && (
          <div className="space-y-2 p-4 text-center text-xs text-muted">
            <p>처리 중… ({elapsed}초 지남)</p>
            <p className="text-[11px]">얼마나 남았는지 알 수 없어요</p>
            <DemoButton size="sm" tone="secondary" onClick={() => setPhase("idle")}>
              그만 기다리기
            </DemoButton>
          </div>
        )}
      </div>
      <Hint>{bad ? "끝을 알 수 없는 긴 작업에 무한 바를 쓴 예" : "짧은 검색이라 끝을 몰라도 괜찮아요"}</Hint>
    </div>
  );
}
