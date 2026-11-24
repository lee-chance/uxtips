"use client";

/**
 * 데모 공용 부품. 모든 데모는 <Stage> 안에서 그려지고,
 * 오버레이도 position: fixed가 아니라 Stage 기준 absolute로 띄운다.
 * (카드 미리보기와 상세 데모가 같은 컴포넌트를 쓰기 때문)
 */

import { motion } from "motion/react";
import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { useDemoEnv } from "./context";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** 데모 무대. 부모 크기를 꽉 채운다. */
export function Stage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "@container relative isolate h-full w-full overflow-hidden bg-surface text-fg",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** 앱 화면처럼 보이게 하는 상단 바 */
export function AppBar({
  title = "받은 편지함",
  right,
}: {
  title?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex h-10 items-center justify-between border-b border-line px-3 text-[13px] font-semibold">
      <span>{title}</span>
      {right}
    </div>
  );
}

/** 회색 막대로 된 가짜 목록. 배경 맥락용 */
export function FakeList({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cx("space-y-3 p-3", className)} aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <div className="size-8 shrink-0 rounded-full bg-surface-3" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2 rounded bg-surface-3" style={{ width: `${70 - i * 9}%` }} />
            <div className="h-2 w-1/3 rounded bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

/** 데모 안에서 쓰는 버튼 */
export function DemoButton({ tone = "primary", size = "md", className, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-50",
        size === "md" ? "h-9 px-3.5 text-sm" : "h-7 px-2.5 text-xs",
        tone === "primary" && "bg-accent text-accent-fg hover:opacity-90",
        tone === "secondary" && "border border-line bg-surface hover:bg-surface-2",
        tone === "ghost" && "text-accent hover:bg-accent-soft",
        tone === "danger" && "bg-danger text-white hover:opacity-90 dark:text-black",
        className,
      )}
      {...rest}
    />
  );
}

/** 반투명 배경막(scrim). 클릭하면 onClick */
export function Scrim({ onClick, show = true }: { onClick?: () => void; show?: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 z-10 bg-scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
    />
  );
}

/**
 * 자동 재생 때 "여기를 눌렀다"를 보여 주는 손가락 점.
 * show가 true가 되는 순간 눌리는 애니메이션을 한다.
 */
export function Tap({ show, x, y }: { show: boolean; x: string; y: string }) {
  const { autoplay } = useDemoEnv();
  if (!autoplay) return null;
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute z-50 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/30 shadow-lg dark:bg-white/40"
      style={{ left: x, top: y }}
      initial={false}
      animate={show ? { opacity: [0, 1, 1, 0], scale: [1.4, 0.8, 0.8, 1] } : { opacity: 0 }}
      transition={{ duration: 0.7, times: [0, 0.3, 0.7, 1] }}
    />
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * 오버레이용: 열리면 첫 포커스 요소로 이동, Tab을 안에 가두고,
 * Esc로 닫고, 닫히면 열기 전 요소로 포커스를 돌려준다.
 * autoplay(미리보기)에서는 아무것도 하지 않는다.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void,
) {
  const { autoplay } = useDemoEnv();
  const escRef = useRef(onEscape);
  useEffect(() => {
    escRef.current = onEscape;
  });

  useEffect(() => {
    if (!active || autoplay) return;
    const node = ref.current;
    if (!node) return;
    const prev = document.activeElement as HTMLElement | null;
    const first = node.querySelector<HTMLElement>("[data-autofocus]") ??
      node.querySelector<HTMLElement>(FOCUSABLE) ??
      node;
    first.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && escRef.current) {
        e.stopPropagation();
        escRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const a = items[0];
      const z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      if (prev && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, [active, autoplay, ref]);
}

/** 상세 데모 아래 작은 안내 문구 */
export function Hint({ children }: { children: ReactNode }) {
  const { autoplay } = useDemoEnv();
  if (autoplay) return null;
  return (
    <p className="pointer-events-none absolute inset-x-0 bottom-2 z-0 text-center text-[11px] text-muted">
      {children}
    </p>
  );
}
