"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, FakeList, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 배너 없음 → 내려옴 → 머묾 → 닫기 누름
const SCRIPT = [700, 1900, 350, 500] as const;

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function BannerDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 1);
  const bad = variant === "bad";
  const [open, setOpen] = useState(true);
  const visible = step === null ? open : step === 1 || step === 2;

  if (bad) {
    // 나쁜 예: 사소한 소식을 닫을 수 없는 배너로 여러 개 쌓기
    return (
      <div className="flex h-full flex-col">
        <AppBar title="홈" />
        {["프로필 사진이 업데이트되었습니다!", "새 테마가 추가되었어요!", "오늘도 좋은 하루 보내세요!"].map((m) => (
          <div key={m} className="border-b border-accent/30 bg-accent-soft px-3 py-2.5 text-sm font-medium text-accent">
            {m}
          </div>
        ))}
        <FakeList rows={2} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <AppBar title="홈" />
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            role="region"
            aria-label="연결 상태 알림"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-line bg-accent-soft"
          >
            <div className="flex items-start gap-2 px-3 py-2.5 text-sm">
              <p className="flex-1">
                <strong className="font-semibold">오프라인이에요.</strong>{" "}
                <span className="text-muted">연결되면 작성한 글을 자동으로 보내요.</span>
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="알림 닫기"
                className="grid size-7 shrink-0 place-items-center rounded-md text-muted hover:bg-surface hover:text-fg"
              >
                <CloseIcon />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <FakeList rows={3} />
      {step === null && !open && (
        <div className="mt-auto flex justify-center pb-10">
          <DemoButton tone="secondary" onClick={() => setOpen(true)}>
            배너 다시 보기
          </DemoButton>
        </div>
      )}
      <Tap show={step === 2} x="calc(100% - 24px)" y="62px" />
      <Hint>배너는 닫을 때까지 머물러요</Hint>
    </div>
  );
}
