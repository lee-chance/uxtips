"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 대기 → 삭제 누름 → 스낵바 → 실행 취소 누름 → 복구됨
const SCRIPT = [800, 300, 1300, 300, 900] as const;

const ITEMS = ["장보기 목록", "회의 메모", "여행 준비물"];

export default function SnackbarDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const [deleted, setDeleted] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);

  // 좋은 예: 6초 머묾(누를 시간이 있음). 나쁜 예: 1.2초 만에 사라짐
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), bad ? 1200 : 6000);
    return () => clearTimeout(t);
  }, [open, key, bad]);

  const removed = step === null ? deleted : step >= 2 && step <= 3 ? ITEMS[1] : null;
  const visible = step === null ? open : step === 2 || step === 3;

  const remove = (name: string) => {
    setDeleted(name);
    setOpen(true);
    setKey((k) => k + 1);
  };
  const undo = () => {
    setDeleted(null);
    setOpen(false);
  };

  return (
    <div className="flex h-full flex-col">
      <AppBar title="메모" />
      <ul className="divide-y divide-line">
        {ITEMS.filter((i) => i !== removed).map((name) => (
          <li key={name} className="flex items-center justify-between px-3 py-2.5 text-sm">
            <span>{name}</span>
            <DemoButton
              tone="secondary"
              size="sm"
              onClick={() => remove(name)}
              aria-label={`${name} 삭제`}
            >
              삭제
            </DemoButton>
          </li>
        ))}
      </ul>
      {step === null && deleted && !open && (
        <p className="px-3 pt-3 text-xs text-muted">
          {bad ? "스낵바가 사라져서 되돌릴 방법이 없어요." : null}
        </p>
      )}
      <Tap show={step === 1} target="li:first-child button" />
      <Tap show={step === 3} x="calc(100% - 62px)" y="calc(100% - 38px)" />

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-3"
      >
        <AnimatePresence>
          {visible && (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-lg bg-fg py-2 pl-4 pr-2 text-sm text-bg shadow-lg"
            >
              <span className="flex-1">메모를 삭제했어요</span>
              {bad && (
                <button type="button" className="rounded px-2 py-1 text-xs font-semibold text-bg/80 hover:bg-bg/10">
                  공유
                </button>
              )}
              <button
                type="button"
                onClick={undo}
                className={cx(
                  "rounded px-2 py-1 font-semibold hover:bg-bg/10",
                  bad ? "text-xs text-bg/80" : "text-accent-soft",
                )}
              >
                실행 취소
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Hint>삭제한 뒤 실행 취소를 눌러 보세요</Hint>
    </div>
  );
}
