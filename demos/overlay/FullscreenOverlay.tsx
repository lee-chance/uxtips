"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, FakeList, Hint, Tap, useFocusTrap } from "@/components/demo/kit";

const SCRIPT = [800, 300, 2100, 600] as const;
const RECENT = ["제주 숙소", "부산 맛집", "강릉 카페"];

export default function FullscreenOverlayDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState(false);
  const [q, setQ] = useState("");
  const open = step === null ? userOpen : step === 2;
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = () => setUserOpen(false);
  useFocusTrap(ref, open, bad ? undefined : close);

  return (
    <div className="flex h-full flex-col">
      <AppBar title="여행" />
      <div className="p-3 pb-0">
        <button
          type="button"
          onClick={() => setUserOpen(true)}
          className="flex h-9 w-full items-center gap-2 rounded-full bg-surface-2 px-3 text-left text-sm text-muted"
        >
          <SearchIcon />
          {bad ? "특가 보기" : "어디로 떠나세요?"}
        </button>
      </div>
      <FakeList rows={3} />
      <Tap show={step === 1} x="50%" y="62px" />
      <Hint>검색창을 눌러 보세요</Hint>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-30 flex flex-col bg-surface"
          >
            {bad ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-accent p-6 text-center text-accent-fg">
                <h2 id={titleId} className="text-xl font-extrabold">
                  오늘만 70% 할인!
                </h2>
                <p className="text-sm opacity-90">앱을 설치하면 쿠폰을 드려요</p>
                <DemoButton tone="secondary" className="mt-3 text-fg">
                  앱 설치하기
                </DemoButton>
                <button
                  type="button"
                  onClick={close}
                  className="absolute bottom-2 text-[10px] opacity-50"
                >
                  모바일 웹으로 계속
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 border-b border-line p-2">
                  <h2 id={titleId} className="sr-only">
                    여행지 검색
                  </h2>
                  <label className="flex h-9 flex-1 items-center gap-2 rounded-full bg-surface-2 px-3">
                    <SearchIcon />
                    <span className="sr-only">검색어</span>
                    <input
                      data-autofocus
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="어디로 떠나세요?"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-md px-2 py-1 text-sm text-accent hover:bg-accent-soft"
                  >
                    취소
                  </button>
                </div>
                <p className="px-3 pt-3 text-xs font-semibold text-muted">최근 검색</p>
                <ul className="p-1.5">
                  {RECENT.filter((r) => r.includes(q)).map((r) => (
                    <li key={r}>
                      <button
                        type="button"
                        onClick={() => setQ(r)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-2"
                      >
                        {r}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-muted" aria-hidden>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
