"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useDemoEnv, useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap, useFocusTrap } from "@/components/demo/kit";

// 자동 재생: 닫힘 → 칸 누름 → 달력 → 날짜 누름 → 값이 들어감
const SCRIPT = [700, 250, 900, 300, 1100] as const;

// 데모 기준 '오늘'(빌드·접속 시각과 상관없이 같은 화면이 나오도록 고정)
const TODAY = { y: 2026, m: 11, d: 8 }; // 2026년 12월 8일 (m은 0부터)
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

function ymLabel(y: number, m: number) {
  return `${y}년 ${m + 1}월`;
}

function Arrow({ left }: { left?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3.5">
      <path d={left ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DatePickerDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const { autoplay } = useDemoEnv();
  const bad = variant === "bad";
  const [userOpen, setUserOpen] = useState(false);
  const [ym, setYm] = useState({ y: TODAY.y, m: TODAY.m });
  const [focusDay, setFocusDay] = useState(TODAY.d);
  const [picked, setPicked] = useState<{ y: number; m: number; d: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cells = useRef<Record<number, HTMLButtonElement | null>>({});
  const titleId = useId();

  const open = step === null ? userOpen : step === 2 || step === 3;
  const value = step === null ? picked : step === 4 ? { y: 2026, m: 11, d: 18 } : null;
  const autoHover = step === 3 ? 18 : null;

  const close = () => setUserOpen(false);
  useFocusTrap(panelRef, open, close);

  // 화살표 키로 옮긴 날짜에 포커스를 준다
  useEffect(() => {
    if (!open || autoplay) return;
    cells.current[focusDay]?.focus();
  }, [focusDay, open, autoplay, ym]);

  const first = new Date(ym.y, ym.m, 1).getDay();
  const days = new Date(ym.y, ym.m + 1, 0).getDate();
  const isPast = (d: number) =>
    !bad && (ym.y < TODAY.y || (ym.y === TODAY.y && (ym.m < TODAY.m || (ym.m === TODAY.m && d < TODAY.d))));

  const moveMonth = (delta: number) => {
    const m = ym.m + delta;
    setYm({ y: ym.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 });
    setFocusDay(1);
  };

  const onGridKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = focusDay + map[e.key];
    if (next < 1) moveMonth(-1);
    else if (next > days) moveMonth(1);
    else setFocusDay(next);
  };

  const label = bad ? "생년월일" : "체크인";
  const shown = value ? `${value.y}. ${value.m + 1}. ${value.d}.` : bad ? "생년월일을 고르세요" : "날짜 선택";

  return (
    <div className={cx("relative flex h-full flex-col px-4 pt-3", step === null ? "pb-8" : "pb-3")}>
      <p className="mb-1 text-xs font-semibold text-muted">{label}</p>
      <button
        type="button"
        data-tap={step === 1 ? "" : undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setUserOpen(true)}
        className="flex h-9 items-center justify-between rounded-lg border border-line bg-surface px-3 text-sm"
      >
        <span className={value ? "" : "text-muted"}>{shown}</span>
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-muted">
          <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-3 top-2 z-20 rounded-xl border border-line bg-surface p-2 shadow-xl @md:inset-x-auto @md:left-4 @md:top-16 @md:w-72"
          >
            <div className="mb-1 flex items-center justify-between">
              <button type="button" aria-label="이전 달" onClick={() => moveMonth(-1)} className="grid size-6 place-items-center rounded hover:bg-surface-2">
                <Arrow left />
              </button>
              <h3 id={titleId} className="text-xs font-semibold @md:text-sm" aria-live="polite">
                {label} · {ymLabel(ym.y, ym.m)}
              </h3>
              <button type="button" aria-label="다음 달" onClick={() => moveMonth(1)} className="grid size-6 place-items-center rounded hover:bg-surface-2">
                <Arrow />
              </button>
            </div>
            <div role="grid" aria-labelledby={titleId} onKeyDown={onGridKey} className="text-center text-[10px] @md:text-xs">
              <div role="row" className="grid grid-cols-7 text-muted">
                {WEEK.map((w) => (
                  <span key={w} role="columnheader" aria-label={`${w}요일`} className="py-0.5">
                    {w}
                  </span>
                ))}
              </div>
              <div role="row" className="grid grid-cols-7 gap-y-0.5">
                {Array.from({ length: first }).map((_, i) => (
                  <span key={`b${i}`} role="gridcell" />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                  const d = i + 1;
                  const sel = value && value.y === ym.y && value.m === ym.m && value.d === d;
                  const today = ym.y === TODAY.y && ym.m === TODAY.m && d === TODAY.d;
                  const past = isPast(d);
                  return (
                    <span key={d} role="gridcell" aria-selected={!!sel}>
                      <button
                        ref={(el) => {
                          cells.current[d] = el;
                        }}
                        type="button"
                        tabIndex={d === focusDay ? 0 : -1}
                        data-autofocus={d === focusDay ? "" : undefined}
                        data-tap={autoHover === d ? "" : undefined}
                        disabled={past}
                        aria-label={`${ym.m + 1}월 ${d}일${today ? ", 오늘" : ""}`}
                        onClick={() => {
                          setPicked({ y: ym.y, m: ym.m, d });
                          close();
                        }}
                        className={cx(
                          "mx-auto grid size-5 place-items-center rounded-full tabular-nums @md:size-8",
                          sel || autoHover === d
                            ? "bg-accent text-accent-fg"
                            : today
                              ? "font-bold text-accent ring-1 ring-accent"
                              : past
                                ? "text-muted/50 line-through"
                                : "hover:bg-surface-2",
                        )}
                      >
                        {d}
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Tap show={step === 1 || step === 3} target="[data-tap]" />
      <Hint>
        {bad
          ? "생년월일인데 이번 달 달력부터 시작해요. 1990년까지 '이전 달'을 400번 넘게 눌러야 해요"
          : "화살표 키로 날짜를 옮기고 Enter로 골라요. 지난 날짜는 고를 수 없어요"}
      </Hint>
    </div>
  );
}
