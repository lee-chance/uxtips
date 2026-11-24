"use client";

import { useReducedMotion } from "motion/react";
import { useLoopProgress, type DemoProps } from "@/components/demo/context";
import { Hint } from "@/components/demo/kit";
import { keyframes, Row, ScrollBox, useScrollY } from "./shared";

// 자동 재생: 아래로 스크롤 → 잠깐 멈춤 → 다시 위로
const PATH = [
  [0, 0],
  [0.45, 100],
  [0.65, 100],
  [1, 0],
] as const;

export default function ParallaxDemo({ variant = "good" }: DemoProps) {
  const auto = useLoopProgress(3200, 500, 0.45);
  const { ref, y, onScroll } = useScrollY();
  const reduced = useReducedMotion() ?? false;
  const bad = variant === "bad";

  const autoY = auto === null ? null : keyframes(auto, PATH);
  const scroll = autoY ?? y;
  // 좋은 예는 reduced-motion이면 시차를 끈다. 나쁜 예는 무시한다.
  const k = bad ? 1 : reduced && auto === null ? 0 : 1;

  return (
    <div className="flex h-full flex-col">
      <ScrollBox autoY={autoY} label="여행 이야기" scrollRef={ref} onScroll={onScroll} className="flex-1">
        <section className="relative h-32 overflow-hidden @md:h-56" aria-label="표지">
          {/* 배경: 스크롤보다 느리게(0.5배) 움직인다 */}
          <div
            aria-hidden
            className="absolute inset-x-0 -top-10 h-[calc(100%+80px)] bg-gradient-to-b from-accent-soft to-surface-2"
            style={{ transform: `translateY(${scroll * 0.5 * k}px)` }}
          >
            <div className="absolute bottom-16 left-6 size-16 rounded-full bg-accent/25" />
            <div className="absolute bottom-10 right-10 h-10 w-24 rounded-t-full bg-accent/35" />
            <div className="absolute bottom-6 left-1/3 h-14 w-32 rounded-t-full bg-accent/45" />
          </div>
          {bad && (
            // 나쁜 예: 앞쪽 산이 거꾸로, 옆으로 빠르게 미끄러진다
            <div
              aria-hidden
              className="absolute bottom-0 left-0 h-12 w-40 rounded-t-full bg-accent/60"
              style={{ transform: `translate(${scroll * 0.9}px, ${-scroll * 0.6}px)` }}
            />
          )}
          <div
            className="absolute inset-x-0 bottom-3 px-4"
            // 나쁜 예: 제목 글자도 다른 속도로 움직여 읽기 어렵다
            style={bad ? { transform: `translateY(${scroll * 0.9}px) rotate(${scroll * 0.03}deg)` } : undefined}
          >
            <h3 className="text-base font-bold @md:text-xl">제주 동쪽 한 바퀴</h3>
            <p className="text-xs text-muted">3일 · 사진 24장</p>
          </div>
        </section>
        <ul
          style={bad ? { transform: `translateX(${Math.sin(scroll / 30) * 8}px)` } : undefined}
        >
          {["성산 일출봉", "섭지코지", "비자림", "월정리 해변", "세화 오일장", "종달리 수국길", "우도 땅콩 아이스크림"].map(
            (t, i) => (
              <Row key={t} n={i} label={t} />
            ),
          )}
        </ul>
        <div className="h-10" />
      </ScrollBox>
      <Hint>
        {bad
          ? "글자와 배경이 제각각 움직여 어지러워요"
          : reduced
            ? "동작 줄이기 설정이라 시차 효과를 껐어요"
            : "스크롤하면 배경이 더 천천히 움직여요"}
      </Hint>
    </div>
  );
}
