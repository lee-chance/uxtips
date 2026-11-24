"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, cx, DemoButton, Hint } from "@/components/demo/kit";
import { SpinnerIcon } from "./shared";

// 자동 재생: 가만히 → 당김(문턱 넘음) → 새로고침 중 → 새 글
const SCRIPT = [700, 800, 1100, 1200] as const;
const AUTO_Y = [0, 72, 48, 0];
const THRESHOLD = 64;

const BASE = ["주간 회의록 공유", "디자인 리뷰 일정 변경", "점심 메뉴 투표"];
const FRESH = ["새 공지: 사무실 이전 안내", "배포 완료 알림", "신규 입사자 소개"];

export default function PullToRefreshDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState(BASE);
  const [announce, setAnnounce] = useState("");
  const startY = useRef<number | null>(null);

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setAnnounce(bad ? "" : "새로고침 중");
    setTimeout(() => {
      setItems((list) => {
        const n = list.length - BASE.length;
        const text = n < FRESH.length ? FRESH[n] : `${FRESH[n % FRESH.length]} (${n + 1})`;
        return [text, ...list];
      });
      setRefreshing(false);
      setAnnounce(bad ? "" : "새 글 1개를 불러왔어요");
    }, 1200);
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (refreshing || e.currentTarget.scrollTop > 0) return;
    startY.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    setPull(Math.max(0, Math.min(110, (e.clientY - startY.current) * 0.55)));
  };
  const onUp = () => {
    if (startY.current === null) return;
    startY.current = null;
    setDragging(false);
    if (pull >= THRESHOLD) refresh();
    setPull(0);
  };

  const auto = step !== null;
  const y = auto ? AUTO_Y[step] : refreshing && !bad ? 48 : pull;
  const spinning = auto ? step === 2 : refreshing;
  const list = auto ? (step === 3 ? [FRESH[0], ...BASE] : BASE) : items;
  const armed = y >= THRESHOLD;

  return (
    <div className="flex h-full flex-col">
      <AppBar
        title="알림"
        right={
          !auto && (
            <DemoButton size="sm" tone="ghost" onClick={refresh} disabled={refreshing}>
              새로고침
            </DemoButton>
          )
        }
      />
      <div className="relative flex-1 overflow-hidden">
        {/* 당김 표시: 나쁜 예에는 없다 */}
        {!bad && (
          <div
            className="absolute inset-x-0 top-0 flex items-center justify-center gap-1.5 text-[11px] text-muted"
            style={{ height: y }}
            aria-hidden
          >
            {spinning ? (
              <SpinnerIcon className="size-5 text-accent" />
            ) : y > 8 ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className={cx("size-4 transition-transform", armed && "rotate-180 text-accent")}
                >
                  <path d="M12 5v14m-6-6 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {armed ? "놓으면 새로고침" : "당겨서 새로고침"}
              </>
            ) : null}
          </div>
        )}
        <div
          onPointerDown={auto ? undefined : onDown}
          onPointerMove={auto ? undefined : onMove}
          onPointerUp={auto ? undefined : onUp}
          onPointerCancel={auto ? undefined : onUp}
          className={cx(
            "h-full touch-none select-none overflow-y-auto bg-surface",
            !dragging && "transition-transform duration-300 ease-out",
            !auto && "cursor-grab active:cursor-grabbing",
          )}
          style={{ transform: `translateY(${y}px)` }}
        >
          <ul className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {list.map((t) => (
                <motion.li
                  key={t}
                  layout
                  initial={{ opacity: 0, backgroundColor: "var(--accent-soft)" }}
                  animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
                  transition={{ duration: 0.8 }}
                  className="px-3 py-2.5 text-xs"
                >
                  {t}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
      <span role="status" className="sr-only">
        {announce}
      </span>
      <Hint>{bad ? "당겨도 아무 표시가 없어요" : "목록을 아래로 끌어 당기거나 ‘새로고침’을 누르세요"}</Hint>
    </div>
  );
}
