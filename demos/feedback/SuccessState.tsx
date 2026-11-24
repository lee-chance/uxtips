"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { DemoButton, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 폼 → 누름 → 보내는 중 → 완료 화면
const SCRIPT = [800, 300, 600, 1800] as const;
type Phase = "form" | "sending" | "done";
const AUTO_PHASE: Phase[] = ["form", "form", "sending", "done"];

export default function SuccessStateDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 3);
  const bad = variant === "bad";
  const [phase, setPhase] = useState<Phase>("form");
  const [flash, setFlash] = useState(false);
  const [cleared, setCleared] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const p = step === null ? phase : AUTO_PHASE[step];

  useEffect(() => {
    if (phase !== "sending") return;
    const t = setTimeout(() => {
      if (bad) {
        // 나쁜 예: 아무 정보 없이 폼만 비우고 "완료" 한 마디
        setPhase("form");
        setFlash(true);
        setCleared(true);
      } else setPhase("done");
    }, 700);
    return () => clearTimeout(t);
  }, [phase, bad]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 900);
    return () => clearTimeout(t);
  }, [flash]);

  useEffect(() => {
    if (step === null && phase === "done") headingRef.current?.focus();
  }, [phase, step]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-5">
      <AnimatePresence mode="wait">
        {p === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex w-full max-w-xs flex-col items-center text-center"
          >
            <motion.span
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="grid size-12 place-items-center rounded-full bg-success-soft text-success"
            >
              <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                <motion.path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                />
              </svg>
            </motion.span>
            <h3 ref={headingRef} tabIndex={-1} className="mt-3 text-base font-semibold">
              30,000원을 보냈어요
            </h3>
            <p className="mt-1 text-xs text-muted">김하늘님 · 국민 123-45 · 거래번호 8841</p>
            <div className="mt-4 flex gap-2">
              <DemoButton tone="secondary" size="sm" onClick={() => setPhase("form")}>
                한 번 더 보내기
              </DemoButton>
              <DemoButton size="sm">영수증 보기</DemoButton>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              setPhase("sending");
            }}
            className="flex w-full max-w-xs flex-col gap-2"
          >
            <label className="text-sm font-medium" htmlFor="ss-amount">
              보낼 금액
            </label>
            <input
              id="ss-amount"
              defaultValue={cleared ? "" : "30,000"}
              key={String(cleared)}
              className="h-10 rounded-lg border border-line bg-surface px-3 text-sm"
            />
            <DemoButton type="submit" disabled={p === "sending"}>
              {p === "sending" ? "보내는 중…" : "보내기"}
            </DemoButton>
          </motion.form>
        )}
      </AnimatePresence>
      <div role="status" aria-live="polite" className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
        {flash && <span className="rounded bg-surface-3 px-2 py-0.5 text-[11px] text-muted">완료</span>}
        {step === null && phase === "done" && <span className="sr-only">송금 완료: 30,000원을 보냈어요</span>}
      </div>
      <Tap show={step === 1} x="50%" y="calc(50% + 34px)" />
      <Hint>{bad ? "보내기 후 무엇이 됐는지 남지 않아요" : "보내기를 눌러 보세요"}</Hint>
    </div>
  );
}
