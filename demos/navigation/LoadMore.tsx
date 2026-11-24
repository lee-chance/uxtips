"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, DemoButton, Hint, Tap } from "@/components/demo/kit";
import { SpinnerIcon } from "../loading/shared";

// 자동 재생: 3개 → (탭) 더 보기 → 불러오는 중 → 3개가 붙음
const SCRIPT = [900, 250, 600, 1400] as const;
const BATCH = 3;
const TOTAL = 12;
const NAMES = ["성수 카페", "연남 빵집", "을지로 식당", "망원 서점", "익선 공방", "서촌 갤러리", "합정 레코드", "한남 꽃집", "문래 바", "해방촌 펍", "삼청 찻집", "북촌 한옥"];

export default function LoadMoreDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 3);
  const bad = variant === "bad";
  const [count, setCount] = useState(BATCH);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstNewRef = useRef<HTMLLIElement>(null);
  const [firstNew, setFirstNew] = useState<number | null>(null);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      setFirstNew(count);
      setCount((c) => Math.min(TOTAL, c + BATCH));
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [loading, count]);

  // 좋은 예: 새로 붙은 첫 항목으로 포커스. 나쁜 예: 목록 맨 위로 튕겨 올라간다
  useEffect(() => {
    if (step !== null || count === BATCH) return;
    if (bad) {
      scrollRef.current?.scrollTo({ top: 0 });
      scrollRef.current?.focus();
    } else {
      firstNewRef.current?.focus();
    }
  }, [count, bad, step]);

  const shown = step === null ? count : step === 3 ? BATCH * 2 : BATCH;
  const isLoading = step === null ? loading : step === 2;
  const rest = TOTAL - shown;

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        tabIndex={-1}
        className={cx("min-h-0 flex-1 overflow-y-auto p-3", step === null ? "pb-8" : "pb-2")}
      >
        <ul className="space-y-1.5" aria-label="가게 목록">
          <AnimatePresence initial={false}>
            {NAMES.slice(0, shown).map((n, i) => (
              <motion.li
                key={n}
                ref={i === firstNew && step === null ? firstNewRef : undefined}
                tabIndex={-1}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 rounded-lg bg-surface-2 px-3 py-2 text-xs"
              >
                <span aria-hidden className="size-6 shrink-0 rounded-md bg-surface-3" />
                {n}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <div className="mt-2 flex flex-col items-center gap-1">
          {rest > 0 ? (
            <DemoButton
              data-tap
              tone="secondary"
              size="sm"
              aria-busy={isLoading}
              onClick={() => !loading && setLoading(true)}
              className="w-full"
            >
              {isLoading ? <SpinnerIcon className="size-3.5" /> : null}
              {isLoading ? "불러오는 중" : bad ? "더 보기" : `더 보기 (${shown}/${TOTAL})`}
            </DemoButton>
          ) : (
            <p className="text-xs text-muted">모두 봤어요</p>
          )}
        </div>
      </div>
      <p role="status" className="sr-only">
        {step === null && count > BATCH ? `${TOTAL}개 중 ${count}개 표시` : ""}
      </p>
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>{bad ? "누를 때마다 목록 맨 위로 튕겨 올라가요" : "더 보기를 누르면 새 항목으로 포커스가 옮겨 가요"}</Hint>
    </div>
  );
}
