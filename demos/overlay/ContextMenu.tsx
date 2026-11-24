"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 대기 → 사진을 길게 누름 → 메뉴 → 닫힘
const SCRIPT = [800, 600, 2000, 600] as const;

const FILES = ["제주 바다", "한라산", "귤밭", "돌담길"];
const ACTIONS = ["공유", "즐겨찾기", "이름 바꾸기", "삭제"];
const TONES = ["bg-accent-soft", "bg-success-soft", "bg-surface-3", "bg-danger-soft"];

type Menu = { file: number; x: number; y: number } | null;

export default function ContextMenuDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [menu, setMenu] = useState<Menu>(null);
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const press = useRef<number | undefined>(undefined);

  const shown: Menu = step === null ? menu : step === 2 ? { file: 1, x: 0, y: 0 } : null;

  // 메뉴 위치: 포인터 위치 또는 요소 아래(키보드)
  const openAt = (file: number, clientX?: number, clientY?: number) => {
    const root = rootRef.current!.getBoundingClientRect();
    const tile = tileRefs.current[file]!.getBoundingClientRect();
    const x = (clientX ?? tile.left + 8) - root.left;
    const y = (clientY ?? tile.bottom - 8) - root.top;
    setActive(0);
    setMenu({ file, x: Math.min(x, root.width - 150), y: Math.min(y, root.height - 150) });
  };
  const close = (refocus = true) => {
    const f = menu?.file;
    setMenu(null);
    if (refocus && f !== undefined) tileRefs.current[f]?.focus();
  };

  useEffect(() => {
    if (step === null && menu) itemRefs.current[active]?.focus();
  }, [menu, active, step]);

  useEffect(() => {
    if (step !== null || !menu) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[role=menu]")) setMenu(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu, step]);

  const onMenuKey = (e: KeyboardEvent) => {
    const last = ACTIONS.length - 1;
    if (e.key === "ArrowDown") setActive((i) => (i >= last ? 0 : i + 1));
    else if (e.key === "ArrowUp") setActive((i) => (i <= 0 ? last : i - 1));
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") close(false);
    else return;
    if (e.key !== "Tab") e.preventDefault();
  };

  // 자동 재생에서는 둘째 사진 위에 메뉴를 띄운다
  const style =
    step === null && shown
      ? { left: shown.x, top: shown.y }
      : { left: "32%", top: "36%" };

  return (
    <div ref={rootRef} className={cx("relative flex h-full flex-col p-3", step === null ? "pb-8" : "pb-3")}>
      <ul className="grid min-h-0 flex-1 grid-cols-2 gap-2">
        {FILES.map((f, i) => (
          <li key={f} className="relative min-h-0">
            <button
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              type="button"
              data-tap={i === 1 ? "" : undefined}
              aria-haspopup={bad ? undefined : "menu"}
              aria-label={bad ? f : `${f} (Shift+F10으로 메뉴)`}
              onContextMenu={(e) => {
                e.preventDefault();
                if (!bad) openAt(i, e.clientX, e.clientY);
              }}
              onPointerDown={(e) => {
                // 길게 누르기(터치·마우스 0.5초)
                const { clientX, clientY } = e;
                window.clearTimeout(press.current);
                press.current = window.setTimeout(() => openAt(i, clientX, clientY), 500);
              }}
              onPointerUp={() => window.clearTimeout(press.current)}
              onPointerLeave={() => window.clearTimeout(press.current)}
              onKeyDown={(e) => {
                if (bad) return;
                if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
                  e.preventDefault();
                  openAt(i);
                }
              }}
              className={cx(
                "flex h-full w-full items-end rounded-lg p-2 text-left text-xs font-medium",
                TONES[i],
                shown?.file === i && "ring-2 ring-accent",
              )}
            >
              {f}
            </button>
            {!bad && step === null && (
              // 좋은 예: 숨은 제스처만 있지 않도록 눈에 보이는 '더 보기' 버튼도 둔다
              <button
                type="button"
                aria-label={`${f} 더 보기`}
                aria-haspopup="menu"
                onClick={() => openAt(i)}
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-md bg-surface/80 text-xs"
              >
                ⋯
              </button>
            )}
          </li>
        ))}
      </ul>
      {step === null && msg && (
        <p role="status" className="pt-1 text-xs text-muted">
          {msg}
        </p>
      )}

      <AnimatePresence>
        {shown && (
          <motion.div
            role="menu"
            aria-label={`${FILES[shown.file]} 메뉴`}
            onKeyDown={onMenuKey}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.14 }}
            style={style}
            className="absolute z-30 w-36 origin-top-left rounded-xl border border-line bg-surface p-1 shadow-xl"
          >
            {ACTIONS.map((a, i) => (
              <button
                key={a}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={i === active ? 0 : -1}
                onClick={() => {
                  setMsg(`'${FILES[shown.file]}' ${a}`);
                  close();
                }}
                className={cx(
                  "block w-full rounded-lg px-2.5 py-1 text-left text-xs outline-none",
                  a === "삭제" && "text-danger",
                  (step === null ? i === active : i === 0) && "bg-surface-2",
                )}
              >
                {a}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>
        {bad
          ? "길게 눌러야만 메뉴가 나와요. 알려 주는 것도, 키보드 방법도 없어요"
          : "우클릭·길게 누르기·⋯ 버튼·Shift+F10 모두 같은 메뉴"}
      </Hint>
    </div>
  );
}
