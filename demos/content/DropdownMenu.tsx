"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 대기 → ⋮ 누름 → 메뉴 펼침(둘째 항목 강조) → 닫힘
const SCRIPT = [800, 300, 1800, 500] as const;

type Item = { label: string; danger?: boolean; divider?: boolean };

const GOOD: Item[] = [
  { label: "이름 바꾸기" },
  { label: "복제" },
  { label: "공유" },
  { label: "삭제", danger: true, divider: true },
];
// 나쁜 예: 위험한 '삭제'가 맨 위에, 다른 항목과 똑같은 모양으로 붙어 있다
const BAD: Item[] = [{ label: "삭제" }, { label: "이름 바꾸기" }, { label: "복제" }, { label: "공유" }];

export default function DropdownMenuDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const items = bad ? BAD : GOOD;
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const open = step === null ? userOpen : step === 2;
  const activeIndex = step === null ? active : 1;

  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const close = (focusButton = true) => {
    setUserOpen(false);
    if (focusButton) btnRef.current?.focus();
  };
  const openWith = (index: number) => {
    setActive(index);
    setUserOpen(true);
  };

  // 열리면 활성 항목으로 포커스(로빙 포커스)
  useEffect(() => {
    if (step === null && userOpen) itemRefs.current[active]?.focus();
  }, [userOpen, active, step]);

  // 바깥을 누르면 닫는다
  useEffect(() => {
    if (step !== null || !userOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [userOpen, step]);

  const onMenuKey = (e: KeyboardEvent) => {
    const last = items.length - 1;
    if (bad) {
      // 나쁜 예: 화살표도 Esc도 먹지 않는다. Tab으로 빠져나가면 닫힌다.
      return;
    }
    if (e.key === "ArrowDown") setActive((i) => (i >= last ? 0 : i + 1));
    else if (e.key === "ArrowUp") setActive((i) => (i <= 0 ? last : i - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(last);
    else if (e.key === "Escape") close();
    else return;
    e.preventDefault();
  };

  const choose = (label: string) => {
    setPicked(label);
    close();
  };

  return (
    <div className="flex h-full flex-col">
      <AppBar title="내 문서" />
      <div className={cx("p-3", step === null ? "pb-8" : "pb-3")}>
        <div className="relative flex items-center gap-2.5 rounded-xl border border-line p-3">
          <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
            <svg viewBox="0 0 16 16" className="size-4">
              <path d="M4 1.5h5l3 3v10H4z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">프로젝트 기획안</p>
            <p className="text-xs text-muted">어제 수정</p>
          </div>
          <button
            ref={btnRef}
            type="button"
            data-tap
            aria-label="프로젝트 기획안 더 보기"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => (userOpen ? close(false) : openWith(0))}
            onKeyDown={(e) => {
              if (bad) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                openWith(0);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                openWith(items.length - 1);
              }
            }}
            className="grid size-8 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-2"
          >
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
              <circle cx="8" cy="3" r="1.4" fill="currentColor" />
              <circle cx="8" cy="8" r="1.4" fill="currentColor" />
              <circle cx="8" cy="13" r="1.4" fill="currentColor" />
            </svg>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                ref={menuRef}
                id={menuId}
                role="menu"
                aria-label="문서 동작"
                onKeyDown={onMenuKey}
                onBlur={(e) => {
                  if (step === null && !e.currentTarget.contains(e.relatedTarget as Node)) setUserOpen(false);
                }}
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-2 top-[calc(100%-6px)] z-20 w-40 origin-top-right rounded-xl border border-line bg-surface p-1 shadow-xl"
              >
                {items.map((it, i) => (
                  <div key={it.label}>
                    {it.divider && <div role="separator" className="my-1 h-px bg-line" />}
                    <button
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      type="button"
                      role="menuitem"
                      tabIndex={bad ? 0 : i === activeIndex ? 0 : -1}
                      onMouseEnter={() => step === null && !bad && setActive(i)}
                      onClick={() => choose(it.label)}
                      className={cx(
                        "flex w-full items-center rounded-lg px-2.5 text-left outline-none",
                        // 카드 미리보기는 높이가 작아 메뉴를 촘촘하게
                        step === null ? "py-1.5 text-sm" : "py-1 text-xs",
                        it.danger ? "text-danger" : "text-fg",
                        !bad && i === activeIndex && (it.danger ? "bg-danger-soft" : "bg-surface-2"),
                        bad && "hover:bg-surface-2 focus-visible:bg-surface-2",
                      )}
                    >
                      {it.label}
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-2 h-4 text-xs text-muted" role="status">
          {step === null && picked ? `선택: ${picked}` : ""}
        </p>
      </div>
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>{bad ? "삭제가 맨 위에 똑같은 모양이고, Esc·화살표가 안 먹어요" : "⋮ 버튼에서 ↓ 키로 열고 ↑↓·Esc로 다뤄 보세요"}</Hint>
    </div>
  );
}
