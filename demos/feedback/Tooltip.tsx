"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 대기 → 커서 올림 → 툴팁 → 사라짐
const SCRIPT = [700, 250, 1600, 500] as const;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TOOLS = [
  { label: "굵게", d: "M6 4h5a3 3 0 0 1 0 6H6zM6 10h6a3 3 0 0 1 0 6H6z" },
  { label: "링크 넣기", d: "M8 12l4-4M7 9l-2 2a3 3 0 0 0 4 4l2-2M13 11l2-2a3 3 0 0 0-4-4L9 7" },
  { label: "사진 넣기", d: "M3 5h14v10H3zM3 13l4-4 4 4 2-2 4 4" },
];

function Tip({ label, d, forceOpen }: { label: string; d: string; forceOpen?: boolean }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const visible = forceOpen ?? open;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <span className="relative">
      <button
        type="button"
        aria-label={label}
        aria-describedby={visible ? id : undefined}
        onMouseEnter={() => (timer.current = window.setTimeout(() => setOpen(true), 300))}
        onMouseLeave={() => {
          window.clearTimeout(timer.current);
          setOpen(false);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="grid size-10 place-items-center rounded-lg text-fg hover:bg-surface-2"
      >
        <Icon d={d} />
      </button>
      <AnimatePresence>
        {visible && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-fg px-2 py-1 text-xs text-bg shadow"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function TooltipDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);

  if (variant === "bad") {
    // 나쁜 예: 꼭 알아야 할 조건을 마우스를 올려야만 보이는 툴팁에 숨김(키보드·터치로는 못 봄)
    return (
      <div className="flex h-full flex-col justify-center px-5 @md:px-16">
        <label htmlFor="bad-pw" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
          비밀번호
          <span className="group relative cursor-help text-muted">
            ⓘ
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-fg px-2 py-1 text-xs text-bg group-hover:block">
              8자 이상, 숫자와 특수문자를 꼭 넣어야 해요
            </span>
          </span>
        </label>
        <input id="bad-pw" type="password" className="h-10 rounded-lg border border-line bg-surface px-3 text-sm" />
        <p className="mt-2 text-xs text-muted">조건은 마우스를 올려야만 보여요. Tab으로는 볼 수 없어요.</p>
      </div>
    );
  }

  const auto = step !== null;
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div role="toolbar" aria-label="서식" className="flex gap-1 rounded-xl border border-line bg-surface p-1 shadow-sm">
        {TOOLS.map((t, i) => (
          <Tip key={t.label} {...t} forceOpen={auto ? i === 1 && step === 2 : undefined} />
        ))}
      </div>
      <Tap show={step === 1} x="50%" y="50%" />
      <Hint>아이콘에 마우스를 올리거나 Tab으로 이동해 보세요 (Esc로 닫기)</Hint>
    </div>
  );
}
