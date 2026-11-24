"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, FakeList, Hint, Tap } from "@/components/demo/kit";

const SCRIPT = [800, 300, 2000, 600] as const;

export default function PopoverDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const open = step === null ? userOpen : step === 2;
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 비모달: 바깥을 누르거나 Esc를 누르면 닫히고, 포커스는 트리거로 돌아간다
  useEffect(() => {
    if (!userOpen) return;
    panelRef.current?.querySelector<HTMLElement>("button, input, a")?.focus();
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) setUserOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [userOpen]);

  return (
    <div className="flex h-full flex-col">
      <AppBar title="여행 계획" />
      <div className="relative flex justify-end px-3 pt-3">
        <button
          ref={triggerRef}
          type="button"
          className="inline-flex h-7 items-center rounded-lg border border-line bg-surface px-2.5 text-xs font-medium hover:bg-surface-2"
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="dialog"
          onClick={() => setUserOpen((o) => !o)}
        >
          {bad ? "주소 입력" : "공유"}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-label={bad ? "배송지 입력" : "공유 옵션"}
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{ transformOrigin: "top right" }}
              className="absolute right-3 top-full z-20 mt-2 w-56 rounded-xl border border-line bg-surface p-2 shadow-xl"
            >
              <span aria-hidden className="absolute -top-1.5 right-5 size-3 rotate-45 border-l border-t border-line bg-surface" />
              {bad ? (
                <form className="max-h-40 space-y-1.5 overflow-auto p-1 text-xs" onSubmit={(e) => e.preventDefault()}>
                  {["받는 분", "연락처", "우편번호", "주소", "상세 주소", "배송 메모", "공동현관 비밀번호"].map((f) => (
                    <label key={f} className="block">
                      {f}
                      <input className="mt-0.5 block h-7 w-full rounded border border-line bg-surface-2 px-2" />
                    </label>
                  ))}
                </form>
              ) : (
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setCopied(true)}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-surface-2"
                  >
                    {copied ? "링크를 복사했어요" : "링크 복사"}
                  </button>
                  <button type="button" className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-surface-2">
                    메일로 보내기
                  </button>
                  <button type="button" className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-surface-2">
                    QR 코드 보기
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <FakeList rows={3} />
      <Tap show={step === 1} target="[aria-haspopup]" />
      <Hint>{bad ? "입력하다가 바깥을 누르면 모두 사라져요" : "공유를 눌러 보세요 · Esc나 바깥 클릭으로 닫기"}</Hint>
    </div>
  );
}
