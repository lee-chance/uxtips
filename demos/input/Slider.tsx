"use client";

import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint } from "@/components/demo/kit";

// 자동 재생: 값이 단계별로 움직인다(손잡이를 끄는 모습)
const SCRIPT = [700, 500, 500, 700, 500, 500] as const;
const AUTO_VALUES = [30, 55, 80, 80, 55, 30];

export default function SliderDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const [value, setValue] = useState(bad ? 35 : 40);
  const id = useId();

  const v = step === null ? value : AUTO_VALUES[step];
  const min = 0;
  const max = bad ? 120 : 100;
  const pct = ((v - min) / (max - min)) * 100;

  return (
    <div className={cx("flex h-full flex-col justify-center gap-4 px-5", step === null ? "pb-8" : "pb-3")}>
      {!bad && (
        // 값이 바뀌는 결과를 바로 보여 준다(밝기 미리보기)
        <div
          aria-hidden
          className="mx-auto h-14 w-full max-w-60 rounded-xl border border-line bg-accent @md:h-24"
          style={{ opacity: 0.15 + (v / 100) * 0.85 }}
        />
      )}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor={id} className="text-sm font-medium">
            {bad ? "나이" : "밝기"}
          </label>
          {/* 나쁜 예: 정확한 값을 넣어야 하는데 지금 값이 보이지 않는다 */}
          {!bad && <output htmlFor={id} className="text-sm tabular-nums text-muted">{v}%</output>}
        </div>
        <div className="relative h-6">
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-surface-3" aria-hidden>
            <div
              className={cx("h-full rounded-full bg-accent", step !== null && "transition-[width] duration-300 ease-out")}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div
            aria-hidden
            className={cx(
              "pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-surface shadow",
              step !== null && "transition-[left] duration-300 ease-out",
              bad && "size-3",
            )}
            style={{ left: `${pct}%` }}
          />
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={bad ? 1 : 5}
            value={v}
            aria-valuetext={bad ? undefined : `${v}%`}
            onChange={(e) => setValue(Number(e.target.value))}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-1 rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-accent"
          />
        </div>
        {!bad && (
          <div className="mt-1 flex justify-between text-[11px] text-muted" aria-hidden>
            <span>어둡게</span>
            <span>밝게</span>
          </div>
        )}
      </div>
      <Hint>
        {bad ? "정확한 숫자(나이)를 슬라이더로, 값도 안 보이게 고르게 해요" : "끌거나 화살표 키로 조절해 보세요"}
      </Hint>
    </div>
  );
}
