"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, FakeList, Hint, Tap } from "@/components/demo/kit";
import { CheckIcon, SpinnerIcon } from "./shared";

// 자동 재생: 대기 → 누름 → 스피너(짧은 작업) → 완료
const SCRIPT = [700, 250, 1500, 1000] as const;

type Phase = "idle" | "loading" | "done";

export default function SpinnerDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const [phase, setPhase] = useState<Phase>("idle");
  const bad = variant === "bad";

  // 좋은 예: 2초 남짓 걸리는 전송. 나쁜 예: 20초 걸리는 업로드를 스피너 하나로 버티게 함
  useEffect(() => {
    if (phase === "idle") return;
    const t = setTimeout(
      () => setPhase(phase === "loading" ? "done" : "idle"),
      phase === "loading" ? (bad ? 20000 : 1800) : 2000,
    );
    return () => clearTimeout(t);
  }, [phase, bad]);

  const current: Phase =
    step === null ? phase : step === 2 ? "loading" : step === 3 ? "done" : "idle";
  const loading = current === "loading";

  return (
    <div className="flex h-full flex-col">
      <AppBar title="새 메시지" />
      <FakeList rows={2} />
      <div className="mt-auto flex flex-col items-center gap-2 pb-12">
        <DemoButton
          onClick={() => setPhase("loading")}
          disabled={loading}
          aria-busy={loading}
          className="min-w-28"
        >
          {loading && !bad ? (
            <>
              <SpinnerIcon className="size-4" />
              보내는 중
            </>
          ) : current === "done" ? (
            <>
              <CheckIcon className="size-4" />
              {bad ? "올렸어요" : "보냈어요"}
            </>
          ) : bad ? (
            "동영상 올리기"
          ) : (
            "보내기"
          )}
        </DemoButton>
        <span role="status" className="sr-only">
          {loading ? "처리 중" : current === "done" ? "완료" : ""}
        </span>
      </div>
      <Tap show={step === 1} x="50%" y="calc(100% - 66px)" />

      {/* 나쁜 예: 화면 전체를 막는 스피너. 진행률도, 남은 시간도, 취소도 없다 */}
      <AnimatePresence>
        {bad && loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 grid place-items-center bg-scrim"
          >
            <div className="flex flex-col items-center gap-3 text-white">
              <SpinnerIcon className="size-12" />
              <span className="text-sm">잠시만 기다려 주세요…</span>
            </div>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="absolute right-2 top-2 rounded px-2 py-1 text-[11px] text-white/80 underline"
            >
              데모 멈추기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Hint>{bad ? "20초 동안 스피너만 돌아요" : "버튼을 눌러 보세요"}</Hint>
    </div>
  );
}
