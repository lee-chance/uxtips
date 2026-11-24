"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 대기 → FAB 누름 → 새 메모가 맨 위에 생김 → 잠시 뒤 원래대로
const SCRIPT = [900, 300, 1600, 400] as const;

const NOTES = ["장보기 목록", "회의 메모", "읽을 책", "운동 기록", "여행 준비물", "선물 아이디어"];

export default function FabDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [extra, setExtra] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const added = step === null ? extra : step === 2 ? 1 : 0;
  const notes = [
    ...Array.from({ length: added }, (_, i) => `새 메모 ${added - i}`),
    ...NOTES,
  ];

  return (
    <div className="flex h-full flex-col">
      <AppBar title="메모" />
      <ul
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)}
        // 좋은 예: 마지막 항목이 FAB에 가리지 않도록 아래 여백을 둔다
        className={cx("flex-1 divide-y divide-line overflow-y-auto", bad ? "pb-0" : "pb-20")}
        aria-label="메모 목록"
        tabIndex={step === null ? 0 : undefined}
      >
        <AnimatePresence initial={false}>
          {notes.map((n) => (
            <motion.li
              key={n}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cx(
                "flex items-center justify-between px-3 py-2.5 text-sm",
                n.startsWith("새 메모") && "bg-accent-soft/50",
              )}
            >
              <span>{n}</span>
              <span className="text-[11px] text-muted">방금</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* 나쁜 예: 두 번째 FAB까지 겹쳐 쌓여 무엇이 주요 동작인지 흐려진다 */}
      {bad && (
        <button
          type="button"
          aria-label="공유"
          className="absolute bottom-[4.25rem] right-3 z-10 grid size-11 place-items-center rounded-2xl bg-surface-3 shadow-lg"
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
            <path d="M8 2.5v8M5 5.5l3-3 3 3M3.5 9v4h9V9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <motion.button
        type="button"
        data-tap
        layout
        aria-label="새 메모"
        onClick={() => setExtra((x) => x + 1)}
        className={cx(
          "absolute bottom-3 right-3 z-10 flex h-12 items-center gap-2 overflow-hidden rounded-2xl bg-accent text-sm font-medium text-accent-fg shadow-lg",
          // 좋은 예: 처음엔 글자가 있는 확장형, 스크롤하면 아이콘만 남겨 덜 가린다
          !bad && !scrolled ? "px-4" : "w-12 justify-center",
        )}
        style={{ borderRadius: 16 }}
      >
        <svg viewBox="0 0 16 16" className="size-5 shrink-0" aria-hidden>
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {!bad && !scrolled && <motion.span layout="position" aria-hidden>새 메모</motion.span>}
      </motion.button>
      <span role="status" className="sr-only">
        {step === null && extra > 0 ? `새 메모 ${extra}개 추가됨` : ""}
      </span>
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>{bad ? "버튼이 마지막 메모를 가리고, 두 개가 겹쳐 있어요" : "목록을 내리면 버튼이 작아져요"}</Hint>
    </div>
  );
}
