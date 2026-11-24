"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 1 → (+) 2 → (+) 3 → (−) 2 → (−) 1
const SCRIPT = [700, 250, 600, 250, 700, 250, 600, 250] as const;
const AUTO = [1, 1, 2, 2, 3, 3, 2, 2];
const PRICE = 4500;
const MIN = 1;
const MAX = 10;

function Icon({ minus }: { minus?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3.5">
      <path d={minus ? "M3.5 8h9" : "M3.5 8h9M8 3.5v9"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function QuantityStepperDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 4);
  const bad = variant === "bad";
  const [qty, setQty] = useState(1);
  const [text, setText] = useState<string | null>(null); // 직접 입력 중인 글자
  const id = useId();

  const q = step === null ? qty : AUTO[step];
  const tap = step === 1 || step === 3 ? "plus" : step === 5 || step === 7 ? "minus" : null;

  // 좋은 예: 1~10 사이로 막는다. 나쁜 예: 0도, 음수도 된다
  const set = (n: number) => {
    setText(null);
    setQty(bad ? n : Math.min(MAX, Math.max(MIN, n)));
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") set(qty + 1);
    else if (e.key === "ArrowDown") set(qty - 1);
    else if (e.key === "Home") set(MIN);
    else if (e.key === "End") set(MAX);
    else return;
    e.preventDefault();
  };

  const btn = bad
    ? "grid size-5 place-items-center rounded text-muted hover:bg-surface-2"
    : "grid size-9 place-items-center rounded-lg text-fg hover:bg-surface-2 disabled:text-muted disabled:opacity-40";

  return (
    <div className={cx("flex h-full flex-col justify-center gap-4 px-5", step === null ? "pb-8" : "pb-3")}>
      <div className="flex items-center gap-2 rounded-xl border border-line p-2.5 @xs:gap-3 @xs:p-3">
        <div aria-hidden className="hidden size-12 shrink-0 rounded-lg bg-accent-soft @xs:block" />
        <div className="min-w-0 flex-1">
          <p id={id} className="truncate text-sm font-medium">
            아메리카노
          </p>
          <p className="text-xs text-muted">{PRICE.toLocaleString()}원</p>
        </div>
        <div className={cx("flex shrink-0 items-center", !bad && "rounded-lg border border-line")}>
          <button
            type="button"
            aria-label="수량 줄이기"
            data-tap={tap === "minus" ? "" : undefined}
            disabled={!bad && q <= MIN}
            onClick={() => set(qty - 1)}
            className={btn}
          >
            <Icon minus />
          </button>
          <input
            role="spinbutton"
            aria-labelledby={id}
            aria-valuenow={q}
            aria-valuemin={bad ? undefined : MIN}
            aria-valuemax={bad ? undefined : MAX}
            inputMode="numeric"
            // 나쁜 예: 직접 입력할 수 없다
            readOnly={bad}
            value={text ?? String(q)}
            onChange={(e) => setText(e.target.value.replace(/[^0-9]/g, ""))}
            onBlur={() => text !== null && set(Number(text) || MIN)}
            onKeyDown={onKey}
            className={cx(
              "w-9 bg-transparent text-center text-sm tabular-nums",
              bad ? "text-xs" : "font-semibold",
            )}
          />
          <button
            type="button"
            aria-label="수량 늘리기"
            data-tap={tap === "plus" ? "" : undefined}
            disabled={!bad && q >= MAX}
            onClick={() => set(qty + 1)}
            className={btn}
          >
            <Icon />
          </button>
        </div>
      </div>
      <p className="flex justify-between text-sm">
        <span className="text-muted">합계</span>
        <span className={cx("font-semibold tabular-nums", q <= 0 && "text-danger")} aria-live="polite">
          {(q * PRICE).toLocaleString()}원
        </span>
      </p>
      <Tap show={tap !== null} target="[data-tap]" />
      <Hint>
        {bad ? "버튼이 작고, 0개·음수까지 내려가고, 숫자를 직접 칠 수 없어요" : "± 버튼, 화살표 키, 직접 입력 모두 돼요 (1~10)"}
      </Hint>
    </div>
  );
}
