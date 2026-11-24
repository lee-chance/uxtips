"use client";

import { useId, useState } from "react";
import { useLoopProgress, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, Hint } from "@/components/demo/kit";
import { useInterval } from "./shared";

const TOTAL = 10; // 사진 10장

export default function ProgressBarDemo({ variant = "good" }: DemoProps) {
  const auto = useLoopProgress(2600, 800, 0.6);
  const [p, setP] = useState(0);
  const [running, setRunning] = useState(false);
  const bad = variant === "bad";
  const labelId = useId();

  useInterval(
    () => {
      setP((v) => {
        let next: number;
        if (bad) {
          // 나쁜 예: 튀고, 뒤로 가고, 99%에서 멈춘다
          const r = Math.random();
          next = r < 0.2 ? v - 0.15 : r < 0.5 ? v : v + 0.12;
          next = Math.max(0.05, Math.min(0.99, next));
        } else {
          next = Math.min(1, v + 0.025);
        }
        if (next >= 1) setRunning(false);
        return next;
      });
    },
    running ? 150 : null,
  );

  const value = auto ?? p;
  const pct = Math.round(value * 100);
  const done = Math.min(TOTAL, Math.floor(value * TOTAL));
  const secondsLeft = Math.ceil(((1 - value) / 0.025) * 0.15);
  const active = auto !== null || running || p > 0;

  return (
    <div className="flex h-full flex-col">
      <AppBar title="사진 올리기" />
      <div className="flex flex-1 flex-col justify-center gap-3 px-4 @md:px-12">
        <div className="flex items-baseline justify-between text-xs">
          <span id={labelId} className="font-medium">
            {bad ? "업로드 중…" : value >= 1 ? "10장 모두 올렸어요" : `사진 ${TOTAL}장 중 ${done}장 올리는 중`}
          </span>
          {!bad && <span className="tabular-nums text-muted">{pct}%</span>}
        </div>
        <div
          role="progressbar"
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="h-2 overflow-hidden rounded-full bg-surface-3"
        >
          <div
            className={`h-full rounded-full bg-accent ${auto === null ? "transition-[width] duration-150 ease-linear" : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {!bad && (
          <p className="text-[11px] text-muted">
            {value >= 1 ? "완료" : active ? `약 ${secondsLeft}초 남음` : "올릴 준비가 됐어요"}
          </p>
        )}
        {auto === null && (
          <div className="flex gap-2">
            <DemoButton
              size="sm"
              onClick={() => {
                if (p >= 1 || p === 0) setP(0);
                setRunning(true);
              }}
              disabled={running}
            >
              {p > 0 && p < 1 ? "이어서 올리기" : "올리기 시작"}
            </DemoButton>
            {!bad && (
              <DemoButton size="sm" tone="secondary" disabled={!running} onClick={() => setRunning(false)}>
                취소
              </DemoButton>
            )}
          </div>
        )}
      </div>
      <Hint>{bad ? "숫자 없이 막대가 오락가락해요" : "시작한 뒤 취소도 해 보세요"}</Hint>
    </div>
  );
}
