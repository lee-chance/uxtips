"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, Hint, Scrim, Tap, useFocusTrap } from "@/components/demo/kit";

const SCRIPT = [900, 300, 1900, 600] as const;

export default function AlertDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const open = step === null ? userOpen : step === 2;
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const close = () => setUserOpen(false);
  useFocusTrap(ref, open, close);

  return (
    <div className="flex h-full flex-col">
      <AppBar title="메모" />
      <div className="p-3">
        <div className="flex items-center justify-between rounded-xl border border-line p-3">
          <div className="min-w-0">
            <p className={deleted ? "text-sm text-muted line-through" : "text-sm font-medium"}>
              여행 준비물 목록
            </p>
            <p className="text-xs text-muted">{deleted ? "삭제됨" : "어제 수정"}</p>
          </div>
          <DemoButton
            data-tap
            tone="secondary"
            size="sm"
            disabled={deleted}
            onClick={() => setUserOpen(true)}
          >
            삭제
          </DemoButton>
        </div>
        {deleted && (
          <button type="button" className="mt-2 text-xs text-accent underline" onClick={() => setDeleted(false)}>
            데모 되돌리기
          </button>
        )}
      </div>
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>삭제를 눌러 보세요</Hint>

      <AnimatePresence>
        {open && (
          <>
            {/* 알럿은 반드시 답해야 하므로 바깥 클릭으로 닫지 않는다 */}
            <Scrim />
            <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center p-4">
              <motion.div
                ref={ref}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                tabIndex={-1}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto w-full max-w-[260px] overflow-hidden rounded-2xl bg-surface text-center shadow-2xl"
              >
                <div className="px-4 pb-3 pt-4">
                  <h2 id={titleId} className="text-[15px] font-bold">
                    {bad ? "알림" : "메모를 삭제할까요?"}
                  </h2>
                  <p id={descId} className="mt-1 text-[13px] text-muted">
                    {bad
                      ? "작업을 진행하시겠습니까?"
                      : "‘여행 준비물 목록’이 삭제되며 되돌릴 수 없어요."}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-t border-line text-[15px]">
                  <button
                    type="button"
                    data-autofocus
                    onClick={close}
                    className="h-11 border-r border-line hover:bg-surface-2"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleted(true);
                      close();
                    }}
                    className={bad ? "h-11 hover:bg-surface-2" : "h-11 font-semibold text-danger hover:bg-danger-soft"}
                  >
                    {bad ? "확인" : "삭제"}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
