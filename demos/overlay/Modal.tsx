"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, FakeList, Hint, Scrim, Tap, useFocusTrap } from "@/components/demo/kit";

// 대기 → 누름 → 열림 → 닫힘
const SCRIPT = [900, 300, 1900, 600] as const;

export default function ModalDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  // 나쁜 예: 들어오자마자 사소한 안내로 화면을 막는다
  const [userOpen, setUserOpen] = useState(bad);
  const open = step === null ? userOpen : step === 2;
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const close = () => setUserOpen(false);

  // 좋은 예만 Esc로 닫힌다. 나쁜 예도 포커스는 가두지만 Esc는 무시
  useFocusTrap(panelRef, open, bad ? () => {} : close);

  return (
    <div className="flex h-full flex-col">
      <AppBar title="문서 편집" />
      <FakeList rows={3} />
      <div className="mt-auto flex justify-center pb-14">
        <DemoButton onClick={() => setUserOpen(true)}>
          {bad ? "공지 다시 보기" : "편집 끝내기"}
        </DemoButton>
      </div>
      <Tap show={step === 1} x="50%" y="calc(100% - 74px)" />
      <Hint>버튼을 눌러 보세요 · Esc 또는 바깥을 눌러 닫기</Hint>

      <AnimatePresence>
        {open && (
          <>
            <Scrim onClick={bad ? undefined : close} />
            <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center p-4">
              <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                className="pointer-events-auto w-full max-w-[300px] rounded-2xl bg-surface p-4 shadow-2xl"
              >
                {bad ? (
                  <>
                    <h2 id={titleId} className="text-base font-bold">
                      새로운 기능이 추가됐어요!
                    </h2>
                    <p id={descId} className="mt-1 text-sm text-muted">
                      이제 글자 색을 바꿀 수 있어요. 앞으로도 많은 기대 부탁드려요. 닫기 버튼도, 바깥 클릭도, Esc도 통하지 않아요.
                    </p>
                    <div className="mt-4 text-right">
                      <button
                        type="button"
                        onClick={close}
                        className="text-[10px] text-muted/70 underline"
                      >
                        오늘 하루 보지 않기
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <h2 id={titleId} className="text-base font-bold">
                        변경 사항을 저장할까요?
                      </h2>
                      <button
                        type="button"
                        aria-label="닫기"
                        onClick={close}
                        className="-m-1 grid size-7 place-items-center rounded-md text-muted hover:bg-surface-2"
                      >
                        <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <p id={descId} className="mt-1 text-sm text-muted">
                      저장하지 않으면 마지막 수정 내용이 사라져요.
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                      <DemoButton tone="secondary" size="sm" onClick={close}>
                        저장 안 함
                      </DemoButton>
                      <DemoButton size="sm" data-autofocus onClick={close}>
                        저장
                      </DemoButton>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
