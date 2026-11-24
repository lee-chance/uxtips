"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { useLoopProgress, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";
import { keyframes, Row, ScrollBox, useScrollY } from "./shared";

const SHOW_AFTER = 160;
// 자동 재생: 길게 내려감 → 버튼 등장 → 버튼 누름 → 맨 위로
const PATH = [
  [0, 0],
  [0.45, 320],
  [0.62, 320],
  [0.85, 0],
  [1, 0],
] as const;

function UpIcon() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="size-4">
      <path d="M10 15V5M5 10l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BackToTopDemo({ variant = "good" }: DemoProps) {
  const auto = useLoopProgress(3800, 500, 0.55);
  const { ref, y, onScroll } = useScrollY();
  const topRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion() ?? false;
  const bad = variant === "bad";

  const autoY = auto === null ? null : keyframes(auto, PATH);
  const scroll = autoY ?? y;
  const visible = bad || scroll > SHOW_AFTER;

  const goTop = () => {
    ref.current?.scrollTo({ top: 0, behavior: bad || reduced ? "auto" : "smooth" });
    // 좋은 예: 맨 위 제목으로 포커스를 옮겨 키보드·스크린리더 사용자도 같이 올라가게 한다
    if (!bad) topRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="relative h-full">
      <ScrollBox autoY={autoY} label="소식 목록" scrollRef={ref} onScroll={onScroll} className="h-full">
        <h3 ref={topRef} tabIndex={-1} className="px-3 pb-1 pt-3 text-sm font-semibold">
          동네 소식
        </h3>
        <ul>
          {Array.from({ length: 16 }).map((_, i) => (
            <Row key={i} n={i + 1} label={`소식 ${i + 1}`} />
          ))}
        </ul>
        <p className="px-3 py-4 text-center text-xs text-muted">마지막 소식이에요</p>
      </ScrollBox>

      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            data-tap
            onClick={goTop}
            aria-label="맨 위로"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cx(
              "absolute z-10 grid place-items-center shadow-lg",
              bad
                ? "bottom-3 left-3 h-12 w-[70%] rounded-lg bg-accent/90 text-accent-fg"
                : cx(
                    "right-3 size-10 rounded-full border border-line bg-surface text-fg hover:bg-surface-2",
                    auto === null ? "bottom-9" : "bottom-3",
                  ),
            )}
          >
            <UpIcon />
          </motion.button>
        )}
      </AnimatePresence>
      <Tap show={auto !== null && auto > 0.55 && auto < 0.62} target="[data-tap]" />
      <Hint>
        {bad ? "처음부터 떠 있는 큰 버튼이 내용을 가려요" : "충분히 내려가면 오른쪽 아래에 버튼이 나타나요"}
      </Hint>
    </div>
  );
}
