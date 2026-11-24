"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, cx, DemoButton, Hint, Tap } from "@/components/demo/kit";
import { CheckIcon } from "./shared";

// 자동 재생: 홀수 단계에서 '다음'을 누르고, 짝수 단계에서 화면이 넘어간다
const SCRIPT = [700, 250, 700, 250, 700, 250, 1100] as const;

const STEPS = ["장바구니", "배송지", "결제", "완료"];
const BAD_STEPS = 7;

export default function StepperDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 4);
  const [user, setUser] = useState(0);
  const bad = variant === "bad";
  const total = bad ? BAD_STEPS : STEPS.length;

  const current = step === null ? user : Math.floor(step / 2);
  const tapping = step !== null && step % 2 === 1;

  return (
    <div className="flex h-full flex-col">
      <AppBar title="주문하기" />

      {bad ? (
        // 나쁜 예: 이름 없는 점 7개, 지금 단계가 거의 구분되지 않는다
        <div className="flex justify-center gap-1.5 py-4" aria-hidden>
          {Array.from({ length: BAD_STEPS }).map((_, i) => (
            <span key={i} className={cx("size-2 rounded-full", i === current ? "bg-muted" : "bg-surface-3")} />
          ))}
        </div>
      ) : (
        <ol className="flex items-start px-3 pt-4 @md:px-10" aria-label="주문 단계">
          {STEPS.map((label, i) => {
            const done = i < current;
            const now = i === current;
            return (
              <li
                key={label}
                aria-current={now ? "step" : undefined}
                className="relative flex flex-1 flex-col items-center gap-1 text-center"
              >
                {i > 0 && (
                  <span aria-hidden className="absolute right-1/2 top-3 h-0.5 w-full bg-surface-3">
                    <motion.span
                      className="block h-full origin-left bg-accent"
                      initial={false}
                      animate={{ scaleX: i <= current ? 1 : 0 }}
                    />
                  </span>
                )}
                <span
                  className={cx(
                    "relative z-10 grid size-6 place-items-center rounded-full text-[11px] font-semibold transition-colors",
                    done && "bg-accent text-accent-fg",
                    now && "bg-accent text-accent-fg ring-4 ring-accent-soft",
                    !done && !now && "border border-line bg-surface text-muted",
                  )}
                >
                  {done ? <CheckIcon className="size-3.5" /> : i + 1}
                </span>
                <span className={cx("text-[11px]", now ? "font-semibold" : "text-muted")}>
                  {label}
                  {done && <span className="sr-only"> (완료)</span>}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mx-3 mt-2 min-h-0 flex-1 overflow-hidden rounded-lg border border-line p-3 text-xs @md:mx-10">
        <p className="font-semibold">
          {bad ? "다음 정보를 입력하세요" : `${current + 1}단계 · ${STEPS[current]}`}
        </p>
        <div className="mt-2 space-y-1.5" aria-hidden>
          <div className="h-6 rounded border border-line bg-surface-2" />
          <div className="h-6 w-2/3 rounded border border-line bg-surface-2" />
        </div>
      </div>

      <div className={cx("flex justify-between px-3 pt-3 @md:px-10", step === null ? "pb-8" : "pb-3")}>
        <DemoButton size="sm" tone="secondary" disabled={current === 0} onClick={() => setUser((s) => s - 1)}>
          이전
        </DemoButton>
        <DemoButton data-tap size="sm" disabled={current === total - 1} onClick={() => setUser((s) => s + 1)}>
          다음
        </DemoButton>
      </div>
      <Tap show={tapping} target="[data-tap]" />
      <span role="status" className="sr-only">
        {step === null && !bad ? `${current + 1}단계 ${STEPS[current]}` : ""}
      </span>
      <Hint>{bad ? "지금 몇 번째인지, 몇 단계 남았는지 알기 어려워요" : "이전·다음으로 단계를 오가 보세요"}</Hint>
    </div>
  );
}
