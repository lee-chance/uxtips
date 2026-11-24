"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, FakeList, Hint, Scrim, Tap, cx, useFocusTrap } from "@/components/demo/kit";

const SCRIPT = [800, 300, 2000, 700] as const;
const OPTIONS = ["추천순", "최신순", "가격 낮은순", "리뷰 많은순"];

export default function BottomSheetDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState(false);
  const [sort, setSort] = useState(OPTIONS[0]);
  const open = step === null ? userOpen : step === 2;
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = () => setUserOpen(false);
  useFocusTrap(ref, open, bad ? undefined : close);

  return (
    <div className="flex h-full flex-col">
      <AppBar
        title="상품 목록"
        right={
          <DemoButton tone="secondary" size="sm" onClick={() => setUserOpen(true)}>
            {sort}
          </DemoButton>
        }
      />
      <FakeList rows={4} />
      <Tap show={step === 1} x="calc(100% - 40px)" y="20px" />
      <Hint>정렬 버튼을 눌러 보세요 · 시트를 아래로 끌어 닫기</Hint>

      <AnimatePresence>
        {open && (
          <>
            <Scrim onClick={bad ? undefined : close} />
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
              drag={bad ? false : "y"}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 1 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80 || info.velocity.y > 500) close();
              }}
              className={cx(
                "absolute inset-x-0 bottom-0 z-20 mx-auto max-w-md rounded-t-2xl bg-surface px-4 pb-4 shadow-2xl",
                bad ? "top-0 rounded-none pt-4" : "pt-2",
              )}
            >
              {!bad && (
                <div aria-hidden className="mx-auto mb-2 h-1 w-9 cursor-grab rounded-full bg-surface-3" />
              )}
              <div className="flex items-center justify-between">
                <h2 id={titleId} className="text-[15px] font-bold">
                  정렬
                </h2>
                {!bad && (
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-md px-2 py-1 text-xs text-muted hover:bg-surface-2"
                  >
                    완료
                  </button>
                )}
              </div>
              <fieldset className="mt-2">
                <legend className="sr-only">정렬 기준</legend>
                {OPTIONS.map((o) => (
                  <label
                    key={o}
                    className="flex cursor-pointer items-center justify-between border-b border-line py-2 text-sm last:border-0"
                  >
                    {o}
                    <input
                      type="radio"
                      name={`sort-${titleId}`}
                      checked={sort === o}
                      onChange={() => setSort(o)}
                      className="accent-[var(--accent)]"
                    />
                  </label>
                ))}
              </fieldset>
              {bad && (
                <DemoButton className="absolute inset-x-4 bottom-4" onClick={close}>
                  적용
                </DemoButton>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
