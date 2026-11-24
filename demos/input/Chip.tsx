"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 없음 → 누름 → '영업 중' → 누름 → '+주차' → 누름 → 둘 다 해제
const SCRIPT = [800, 250, 900, 250, 1100, 250] as const;

const CHIPS = ["영업 중", "주차 가능", "예약 가능", "반려동물"] as const;
const PLACES = [
  { name: "바다 앞 국숫집", tags: ["영업 중", "주차 가능"] },
  { name: "골목 카페", tags: ["영업 중", "반려동물"] },
  { name: "한옥 식당", tags: ["예약 가능", "주차 가능"] },
  { name: "시장 떡볶이", tags: ["영업 중"] },
];

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3">
      <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ChipDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 4);
  const bad = variant === "bad";
  const [sel, setSel] = useState<string[]>([]);

  const autoSel =
    step === null ? null : step >= 2 && step <= 3 ? ["영업 중"] : step >= 4 && step <= 5 ? ["영업 중", "주차 가능"] : [];
  const selected = autoSel ?? sel;
  const tapChip = step === 1 || step === 5 ? "영업 중" : step === 3 ? "주차 가능" : null;

  const toggle = (c: string) =>
    // 나쁜 예: 하나를 고르면 다른 선택이 말없이 풀린다
    setSel((s) => (bad ? (s.includes(c) ? [] : [c]) : s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const results = PLACES.filter((p) => selected.every((t) => p.tags.includes(t)));

  return (
    <div className={cx("flex h-full flex-col gap-3 px-4 pt-4", step === null ? "pb-8" : "pb-3")}>
      <div role="group" aria-label="필터" className="flex flex-wrap gap-1.5">
        {CHIPS.map((c) => {
          const on = selected.includes(c);
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              data-tap={c === tapChip ? "" : undefined}
              onClick={() => toggle(c)}
              className={cx(
                "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium transition-colors",
                bad
                  ? on
                    ? "border-transparent bg-surface-3 text-fg"
                    : "border-transparent bg-surface-2 text-muted"
                  : on
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line bg-surface text-fg hover:bg-surface-2",
              )}
            >
              {!bad && on && <Check />}
              {c}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted" aria-live="polite">
        {bad ? `${results.length}곳` : `${selected.length ? `필터 ${selected.length}개 · ` : ""}${results.length}곳`}
      </p>
      <ul className="min-h-0 flex-1 space-y-1.5 overflow-hidden">
        <AnimatePresence initial={false}>
          {/* 카드 미리보기는 높이가 낮아 한 줄만 보여 준다 */}
          {(step === null ? results : results.slice(0, 1)).map((p) => (
            <motion.li
              key={p.name}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg bg-surface-2 px-3 py-1.5 text-sm"
            >
              {p.name}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <Tap show={tapChip !== null} target="[data-tap]" />
      <Hint>
        {bad ? "고른 칩이 잘 안 보이고, 하나를 고르면 다른 선택이 풀려요" : "칩을 여러 개 골라 결과를 좁혀 보세요"}
      </Hint>
    </div>
  );
}
