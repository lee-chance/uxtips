"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { DemoButton, Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 0 → 1 → 2 → 3 → 열어 봄(사라짐)
const SCRIPT = [600, 600, 600, 900, 300, 700] as const;
const AUTO_COUNT = [0, 1, 2, 3, 3, 0];

function Bell() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path
        d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zM10 20a2 2 0 0 0 4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Count({ n, max = 99 }: { n: number; max?: number }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          aria-hidden
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.5 }}
          className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white ring-2 ring-surface dark:text-black"
        >
          {n > max ? `${max}+` : n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function BadgeDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 3);
  const bad = variant === "bad";
  const [count, setCount] = useState(3);
  const n = step === null ? count : AUTO_COUNT[step];

  if (bad) {
    // 나쁜 예: 모든 곳에 배지, 의미 없는 큰 숫자, 눌러도 줄지 않음
    const tabs = [
      ["홈", 999 + 1],
      ["쇼핑", 87],
      ["혜택", 12],
      ["내 정보", 5],
    ] as const;
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <div className="flex gap-6">
          {tabs.map(([label, c]) => (
            <button key={label} type="button" className="relative flex flex-col items-center gap-1 text-xs">
              <span className="relative grid size-10 place-items-center rounded-xl bg-surface-2">
                <Bell />
                <Count n={c} max={999} />
              </span>
              {label}
              <span className="sr-only">, 알림 {c}개</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">눌러도 숫자가 줄지 않아요</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <button
        type="button"
        onClick={() => setCount(0)}
        className="relative grid size-14 place-items-center rounded-2xl bg-surface-2 hover:bg-surface-3"
      >
        <Bell />
        <Count n={n} />
        <span className="sr-only">{n > 0 ? `알림, 읽지 않은 알림 ${n}개` : "알림, 새 알림 없음"}</span>
      </button>
      <Tap show={step === 4} x="50%" y="50%" />
      {step === null && (
        <div className="flex items-center gap-2">
          <DemoButton tone="secondary" size="sm" onClick={() => setCount((c) => c + 1)}>
            새 알림 받기
          </DemoButton>
          <span className={cx("text-xs text-muted", n === 0 && "text-success")} aria-live="polite">
            {n === 0 ? "모두 읽었어요" : `읽지 않음 ${n}`}
          </span>
        </div>
      )}
      <Hint>종을 누르면 읽음 처리돼 배지가 사라져요</Hint>
    </div>
  );
}
