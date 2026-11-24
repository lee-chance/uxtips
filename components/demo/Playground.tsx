"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { demos } from "@/demos";
import { DemoProvider, type Variant } from "./context";
import { cx, Stage } from "./kit";

/** 상세 페이지 "직접 해보기". 좋은 예 / 나쁜 예 토글 */
export function Playground({
  slug,
  antiPattern,
}: {
  slug: string;
  antiPattern: { title: string; description: string };
}) {
  const Demo = demos[slug];
  const [variant, setVariant] = useState<Variant>("good");
  const [runKey, setRunKey] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const descId = useId();
  const areaRef = useRef<HTMLDivElement>(null);

  // 데모 안에서 누른 버튼이 사라지거나 비활성화되면 포커스가 <body>로 떨어진다
  // (이때 blur 이벤트가 오지 않을 수 있다). 키보드 사용자가 길을 잃지 않게
  // 데모 영역으로 포커스를 되돌린다.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    let inside = false;
    const onIn = () => (inside = true);
    const onOut = (e: FocusEvent) => {
      if (!area.contains(e.relatedTarget as Node | null)) inside = !!(e.relatedTarget === null);
    };
    const check = () => {
      const a = document.activeElement;
      if (inside && (!a || a === document.body)) area.focus({ preventScroll: true });
    };
    // 데모 밖을 누르면 되돌리지 않는다
    const onDown = (e: PointerEvent) => {
      if (!area.contains(e.target as Node)) inside = false;
    };
    document.addEventListener("pointerdown", onDown);
    const mo = new MutationObserver(() => {
      requestAnimationFrame(check);
      window.setTimeout(check, 80); // disabled 요소는 다음 렌더링 뒤에 포커스를 잃는다
    });
    mo.observe(area, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled", "inert", "hidden"] });
    area.addEventListener("focusin", onIn);
    area.addEventListener("focusout", onOut);
    return () => {
      mo.disconnect();
      document.removeEventListener("pointerdown", onDown);
      area.removeEventListener("focusin", onIn);
      area.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div
          role="radiogroup"
          aria-label="예시 종류"
          className="inline-flex rounded-lg border border-line bg-surface-2 p-0.5"
          onKeyDown={(e) => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
              e.preventDefault();
              const next = variant === "good" ? "bad" : "good";
              setVariant(next);
              (e.currentTarget.querySelector(`[data-v="${next}"]`) as HTMLElement)?.focus();
            }
          }}
        >
          {(["good", "bad"] as const).map((v) => (
            <button
              key={v}
              data-v={v}
              type="button"
              role="radio"
              aria-checked={variant === v}
              tabIndex={variant === v ? 0 : -1}
              onClick={() => setVariant(v)}
              className={cx(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                variant === v
                  ? v === "good"
                    ? "bg-surface text-fg shadow-sm"
                    : "bg-danger-soft text-danger shadow-sm"
                  : "text-muted hover:text-fg",
              )}
            >
              {v === "good" ? "좋은 예" : "나쁜 예"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRunKey((k) => k + 1)}
          className="rounded-md px-2 py-1 text-sm text-muted hover:bg-surface-2 hover:text-fg"
        >
          처음부터
        </button>
      </div>

      <div
        ref={areaRef}
        tabIndex={-1}
        role="group"
        aria-label="직접 해보기 데모"
        className={cx(
          "h-[420px] overflow-hidden rounded-2xl border shadow-sm focus-visible:outline-2 sm:h-[460px]",
          variant === "bad" ? "border-danger/50" : "border-line",
        )}
        aria-describedby={variant === "bad" ? descId : undefined}
      >
        <DemoProvider value={{ autoplay: false, playing: true, reduced }}>
          <Stage key={`${variant}-${runKey}`}>
            {Demo ? <Demo variant={variant} /> : null}
          </Stage>
        </DemoProvider>
      </div>

      <div aria-live="polite">
        {variant === "bad" && (
          <p id={descId} className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            <strong className="font-semibold">나쁜 예: {antiPattern.title}</strong>
            <span className="mt-0.5 block text-fg/80">{antiPattern.description}</span>
          </p>
        )}
      </div>
    </div>
  );
}
