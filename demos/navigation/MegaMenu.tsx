"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { FakeList, Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 대기 → '카테고리' 누름 → 메가 메뉴 펼침 → 닫힘
const SCRIPT = [800, 300, 2200, 600] as const;

const GROUPS = [
  { title: "가전", links: ["노트북", "모니터", "태블릿"] },
  { title: "주방", links: ["커피머신", "에어프라이어", "식기"] },
  { title: "생활", links: ["침구", "수납", "조명"] },
];

export default function MegaMenuDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const open = step === null ? userOpen : step === 2;
  const panelId = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const later = (fn: () => void, ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(fn, ms);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // 좋은 예: 바깥을 누르면 닫힘
  useEffect(() => {
    if (step !== null || !userOpen || bad) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [userOpen, step, bad]);

  const close = () => {
    setUserOpen(false);
    btnRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      <div
        ref={wrapRef}
        className="relative z-20"
        // 좋은 예: 마우스는 약간 늦게 열고 더 늦게 닫아, 대각선으로 움직여도 유지된다
        onMouseEnter={() => step === null && later(() => setUserOpen(true), bad ? 0 : 150)}
        onMouseLeave={() => step === null && later(() => setUserOpen(false), bad ? 0 : 350)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && !bad && userOpen) {
            e.stopPropagation();
            close();
          }
        }}
      >
        <nav aria-label="쇼핑몰 메뉴" className="flex h-10 items-center gap-1 border-b border-line px-3 text-xs">
          {bad ? (
            // 나쁜 예: 마우스를 올려야만 열리는 글자. 포커스도 키보드 조작도 안 된다
            <span className="rounded-md px-2 py-1.5 font-semibold">카테고리 ▾</span>
          ) : (
            <button
              ref={btnRef}
              type="button"
              data-tap
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setUserOpen((o) => !o)}
              className={cx("rounded-md px-2 py-1.5 font-semibold", open ? "bg-accent-soft text-accent" : "hover:bg-surface-2")}
            >
              카테고리 <span aria-hidden>▾</span>
            </button>
          )}
          <span className="px-2 py-1.5 text-muted">기획전</span>
          <span className="px-2 py-1.5 text-muted">베스트</span>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id={panelId}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className={cx(
                "absolute inset-x-0 border-b border-line bg-surface shadow-xl",
                // 나쁜 예: 메뉴 바와 패널 사이에 틈이 있어 마우스를 옮기는 사이 닫힌다
                bad ? "top-[52px] mx-10 rounded-lg border" : "top-10",
              )}
            >
              <div className="grid grid-cols-3 gap-3 p-3">
                {GROUPS.map((g) => (
                  <section key={g.title} aria-labelledby={`${panelId}-${g.title}`}>
                    <h3 id={`${panelId}-${g.title}`} className="mb-1 text-[11px] font-bold text-muted">
                      {g.title}
                    </h3>
                    <ul className="space-y-0.5">
                      {g.links.map((l, i) => (
                        <li key={l}>
                          <button
                            type="button"
                            tabIndex={bad ? -1 : 0}
                            onClick={() => {
                              setPicked(l);
                              close();
                            }}
                            className={cx(
                              "w-full truncate rounded px-1 py-0.5 text-left text-xs hover:bg-surface-2",
                              step !== null && g.title === "가전" && i === 0 && "bg-surface-2",
                            )}
                          >
                            {l}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FakeList rows={3} />
      {step === null && (
        <p role="status" className="px-3 text-xs text-muted">
          {picked ? `'${picked}'로 이동했어요` : ""}
        </p>
      )}
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>
        {bad ? "마우스를 올려야만 열리고, 아래로 옮기는 사이 닫혀요" : "누르거나 마우스를 올려 열기 · Esc로 닫기"}
      </Hint>
    </div>
  );
}
