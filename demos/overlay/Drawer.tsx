"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { FakeList, Hint, Scrim, Tap, cx, useFocusTrap } from "@/components/demo/kit";

const SCRIPT = [800, 300, 2000, 700] as const;
const PRIMARY = ["홈", "검색", "장바구니", "내 정보"];
const SECONDARY = ["설정", "공지사항", "고객센터", "약관"];

export default function DrawerDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState(false);
  const [page, setPage] = useState("홈");
  const open = step === null ? userOpen : step === 2;
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = () => setUserOpen(false);
  useFocusTrap(ref, open, close);
  const menu = bad ? [...PRIMARY, ...SECONDARY] : SECONDARY;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center gap-2 border-b border-line px-2 text-[13px] font-semibold">
        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={open}
          onClick={() => setUserOpen(true)}
          className="grid size-8 place-items-center rounded-md hover:bg-surface-2"
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        {page}
      </div>
      <FakeList rows={3} className="flex-1" />
      {!bad && (
        <nav aria-label="주요 메뉴" className="grid grid-cols-4 border-t border-line">
          {PRIMARY.map((p) => (
            <button
              key={p}
              type="button"
              aria-current={page === p ? "page" : undefined}
              onClick={() => setPage(p)}
              className={cx("h-10 text-[11px]", page === p ? "font-semibold text-accent" : "text-muted")}
            >
              {p}
            </button>
          ))}
        </nav>
      )}
      <Tap show={step === 1} x="24px" y="20px" />
      {bad && <Hint>홈·검색도 메뉴 안에 숨어 있어요</Hint>}

      <AnimatePresence>
        {open && (
          <>
            <Scrim onClick={close} />
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.05 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 1, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -500) close();
              }}
              className="absolute inset-y-0 left-0 z-20 flex w-[72%] max-w-[260px] flex-col bg-surface shadow-2xl"
            >
              <div className="flex h-10 items-center justify-between border-b border-line px-3">
                <h2 id={titleId} className="text-[13px] font-bold">
                  메뉴
                </h2>
                <button
                  type="button"
                  aria-label="메뉴 닫기"
                  onClick={close}
                  className="grid size-7 place-items-center rounded-md text-muted hover:bg-surface-2"
                >
                  <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <ul className="flex-1 overflow-auto p-1.5">
                {menu.map((m) => (
                  <li key={m}>
                    <button
                      type="button"
                      onClick={() => {
                        setPage(m);
                        close();
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-2"
                    >
                      {m}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
