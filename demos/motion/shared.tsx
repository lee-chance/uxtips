"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import { cx } from "@/components/demo/kit";

/**
 * 0~1 진행값 t를 [시점, 값] 키프레임 사이로 부드럽게 보간한다.
 * 자동 재생에서 "가짜 스크롤 위치"를 만들 때 쓴다.
 */
export function keyframes(t: number, points: readonly (readonly [number, number])[]) {
  for (let i = 1; i < points.length; i++) {
    const [t0, v0] = points[i - 1];
    const [t1, v1] = points[i];
    if (t <= t1) {
      const k = t1 === t0 ? 1 : (t - t0) / (t1 - t0);
      const e = k * k * (3 - 2 * k); // smoothstep
      return v0 + (v1 - v0) * e;
    }
  }
  return points[points.length - 1][1];
}

/** 직접 조작 모드에서 스크롤 위치를 상태로 들고 있는다 */
export function useScrollY() {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);
  const onScroll = () => setY(ref.current?.scrollTop ?? 0);
  return { ref, y, onScroll };
}

/**
 * 무대 안의 스크롤 영역.
 * - 직접 조작: 진짜 overflow-y-auto. 포커스 받을 수 있어 화살표 키로 스크롤된다.
 * - 자동 재생(autoY가 숫자): 넘침을 숨기고 내용을 -autoY만큼 옮겨 스크롤을 흉내 낸다.
 */
export function ScrollBox({
  autoY,
  label,
  scrollRef,
  onScroll,
  className,
  children,
}: {
  autoY: number | null;
  label: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
  className?: string;
  children: ReactNode;
}) {
  if (autoY !== null) {
    return (
      <div className={cx("relative overflow-hidden", className)}>
        <div style={{ transform: `translateY(${-autoY}px)` }}>{children}</div>
      </div>
    );
  }
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      tabIndex={0}
      role="region"
      aria-label={label}
      className={cx("relative overflow-y-auto overscroll-contain", className)}
    >
      {children}
    </div>
  );
}

/** 목록 한 줄(배경 맥락용) */
export function Row({ n, label }: { n: number; label?: string }) {
  return (
    <li className="flex h-11 items-center gap-2.5 border-b border-line px-3 text-xs">
      <span aria-hidden className="size-7 shrink-0 rounded-full bg-surface-3" />
      <span className="min-w-0 flex-1 truncate">{label ?? `게시글 ${n}`}</span>
      <span aria-hidden className="h-2 w-8 rounded bg-surface-2" />
    </li>
  );
}
