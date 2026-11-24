"use client";

import { useState } from "react";
import { useLoopProgress, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, Hint } from "@/components/demo/kit";
import { CheckIcon, useInterval } from "./shared";

const R = 26;
const C = 2 * Math.PI * R;

export default function CircularProgressDemo({ variant = "good" }: DemoProps) {
  const auto = useLoopProgress(2600, 900, 0.65);
  const [p, setP] = useState(0);
  const [running, setRunning] = useState(false);
  const bad = variant === "bad";

  useInterval(
    () => {
      setP((v) => {
        const next = v + 0.02;
        if (next >= 1) {
          // 나쁜 예: 다 찬 뒤 0으로 돌아가 다시 채운다 — 가짜 진행률
          if (bad) return 0;
          setRunning(false);
          return 1;
        }
        return next;
      });
    },
    running ? 100 : null,
  );

  const value = auto ?? p;
  const pct = Math.round(value * 100);
  const complete = value >= 1;

  return (
    <div className="flex h-full flex-col">
      <AppBar title="오프라인 지도" />
      <div className="flex flex-1 items-center justify-center gap-4 px-4">
        <div
          role="progressbar"
          aria-label="지도 내려받기"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={bad ? undefined : pct}
          className="relative grid size-20 shrink-0 place-items-center @md:size-28"
        >
          <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="32" cy="32" r={R} fill="none" strokeWidth="6" className="stroke-surface-3" />
            <circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className="stroke-accent transition-[stroke-dashoffset] duration-100 ease-linear"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - value)}
            />
          </svg>
          {!bad &&
            (complete ? (
              <CheckIcon className="size-7 text-accent" />
            ) : (
              <span className="text-sm font-semibold tabular-nums @md:text-base">{pct}%</span>
            ))}
        </div>
        <div className="min-w-0 space-y-1 text-xs">
          <p className="font-medium">서울 지도 · 120MB</p>
          <p className="text-muted">
            {bad
              ? "내려받는 중…"
              : complete
                ? "내려받았어요"
                : value > 0
                  ? `${Math.round(value * 120)}MB / 120MB`
                  : "내려받기 전"}
          </p>
          {auto === null && (
            <div className="flex gap-2 pt-1">
              <DemoButton
                size="sm"
                disabled={running}
                onClick={() => {
                  if (p >= 1) setP(0);
                  setRunning(true);
                }}
              >
                내려받기
              </DemoButton>
              {!bad && (
                <DemoButton size="sm" tone="secondary" disabled={!running} onClick={() => setRunning(false)}>
                  취소
                </DemoButton>
              )}
            </div>
          )}
        </div>
      </div>
      <Hint>{bad ? "숫자 없이 다 찼다가 다시 처음부터 채워져요" : "작은 공간에 진행률을 보여 줘요"}</Hint>
    </div>
  );
}
