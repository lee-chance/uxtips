"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, Hint, Scrim, Tap, cx, useFocusTrap } from "@/components/demo/kit";

const SCRIPT = [800, 300, 2000, 700] as const;

const GOOD = [
  { label: "공유하기" },
  { label: "앨범에 추가" },
  { label: "사진 삭제", danger: true },
];
const BAD = [{ label: "사진 삭제" }, { label: "공유하기" }, { label: "앨범에 추가" }];

export default function ActionSheetDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const open = step === null ? userOpen : step === 2;
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = () => setUserOpen(false);
  useFocusTrap(ref, open, bad ? undefined : close);
  const items = bad ? BAD : GOOD;

  return (
    <div className="flex h-full flex-col">
      <AppBar
        title="사진"
        right={
          <button
            type="button"
            aria-label="더 보기"
            aria-haspopup="dialog"
            onClick={() => setUserOpen(true)}
            className="grid size-8 place-items-center rounded-md hover:bg-surface-2"
          >
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
              <circle cx="3" cy="8" r="1.4" fill="currentColor" />
              <circle cx="8" cy="8" r="1.4" fill="currentColor" />
              <circle cx="13" cy="8" r="1.4" fill="currentColor" />
            </svg>
          </button>
        }
      />
      <div className="flex-1 p-3">
        <div aria-hidden className="h-full max-h-56 rounded-xl bg-gradient-to-br from-accent-soft to-surface-3" />
      </div>
      <p className="h-8 text-center text-xs text-muted" aria-live="polite">
        {last ? `선택: ${last}` : ""}
      </p>
      <Tap show={step === 1} x="calc(100% - 28px)" y="20px" />
      <Hint>오른쪽 위 ··· 버튼을 눌러 보세요</Hint>

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
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              exit={{ y: "110%" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="absolute inset-x-0 bottom-0 z-20 mx-auto max-w-sm space-y-2 p-2"
            >
              <div className="overflow-hidden rounded-2xl bg-surface shadow-xl">
                <p id={titleId} className="border-b border-line py-2 text-center text-xs text-muted">
                  이 사진으로 할 일
                </p>
                {items.map((it) => (
                  <button
                    key={it.label}
                    type="button"
                    onClick={() => {
                      setLast(it.label);
                      close();
                    }}
                    className={cx(
                      "block h-11 w-full border-b border-line text-[15px] last:border-0 hover:bg-surface-2",
                      "danger" in it && it.danger ? "text-danger" : bad ? "text-fg" : "text-accent",
                    )}
                  >
                    {it.label}
                  </button>
                ))}
              </div>
              {!bad && (
                <button
                  type="button"
                  data-autofocus
                  onClick={close}
                  className="block h-11 w-full rounded-2xl bg-surface text-[15px] font-semibold text-accent shadow-xl hover:bg-surface-2"
                >
                  취소
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
