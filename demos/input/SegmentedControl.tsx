"use client";

import { motion } from "motion/react";
import { useId, useState, type KeyboardEvent } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 일 → (누름) 주 → (누름) 월 → (누름) 일
const SCRIPT = [900, 250, 1000, 250, 1000, 250] as const;

const GOOD = ["일", "주", "월"] as const;
const BAD = ["오늘", "이번 주", "이번 달", "올해", "전체 기간", "직접 설정"] as const;

// 보기마다 다른 막대 높이(%)
const BARS: Record<string, number[]> = {
  일: [30, 55, 40, 70, 50, 35, 60],
  주: [60, 45, 80, 65, 90, 70, 75],
  월: [85, 70, 95, 60, 75, 90, 80],
};

export default function SegmentedControlDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const options: readonly string[] = bad ? BAD : GOOD;
  const [sel, setSel] = useState(0);
  const groupId = useId();

  // 자동 재생 단계 → 선택 칸
  const autoSel = step === null ? null : [0, 0, 1, 1, 2, 2][step];
  const current = autoSel ?? sel;
  const tapIndex = step === 1 ? 1 : step === 3 ? 2 : step === 5 ? 0 : -1;

  const onKey = (e: KeyboardEvent) => {
    const n = options.length;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (current + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (current - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setSel(next);
    (e.currentTarget.querySelector(`[data-i="${next}"]`) as HTMLElement | null)?.focus();
  };

  const key = bad ? "주" : GOOD[current];

  return (
    <div className={cx("flex h-full flex-col gap-3 px-4 pt-4", step === null ? "pb-8" : "pb-3")}>
      <p id={groupId} className="text-xs font-semibold text-muted">
        걸음 수
      </p>
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        onKeyDown={onKey}
        className={cx(
          "relative flex rounded-lg bg-surface-2 p-0.5",
          bad && "overflow-hidden",
        )}
      >
        {options.map((o, i) => {
          const on = i === current;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              data-i={i}
              data-tap={i === tapIndex ? "" : undefined}
              onClick={() => setSel(i)}
              className={cx(
                "relative z-10 min-w-0 flex-1 truncate rounded-md py-1.5 text-xs font-medium",
                // 나쁜 예: 선택된 칸이 거의 구분되지 않는다
                bad ? (on ? "text-fg/80" : "text-muted") : on ? "text-fg" : "text-muted hover:text-fg",
                bad ? "px-1" : "px-2",
              )}
            >
              {!bad && on && (
                <motion.span
                  layoutId={`seg-${groupId}`}
                  className="absolute inset-0 -z-10 rounded-md bg-surface shadow-sm"
                  transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                />
              )}
              {o}
            </button>
          );
        })}
      </div>

      <div className="flex min-h-0 flex-1 items-end gap-1.5" aria-hidden>
        {BARS[key].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t bg-accent/80"
            initial={false}
            animate={{ height: `${h}%` }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {options[current]} 보기
      </p>

      <Tap show={tapIndex >= 0} target="[data-tap]" />
      <Hint>
        {bad ? "칸이 너무 많아 글자가 잘리고, 무엇이 선택됐는지 잘 안 보여요" : "누르거나 화살표 키로 보기를 바꿔 보세요"}
      </Hint>
    </div>
  );
}
