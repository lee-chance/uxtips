"use client";

import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 닫힘 → 누름 → 목록 열림 → 새 값으로 닫힘
const SCRIPT = [900, 250, 1300, 1100] as const;

const OPTIONS = ["문 앞에 놓아 주세요", "경비실에 맡겨 주세요", "배송 전에 연락 주세요", "택배함에 넣어 주세요"];
const BAD_OPTIONS = ["택배", "방문 수령"];

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 text-muted" aria-hidden>
      <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SelectDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const [value, setValue] = useState(OPTIONS[0]);
  const [badValue, setBadValue] = useState("");
  const id = useId();

  // 자동 재생: 네이티브 목록은 열 수 없으므로 같은 모양의 목록을 그려 보여 준다
  if (step !== null) {
    const shown = step === 3 ? OPTIONS[1] : OPTIONS[0];
    return (
      <div className="flex h-full flex-col px-4 pb-3 pt-4">
        <p className="mb-1.5 text-xs font-medium">배송 요청사항</p>
        <div
          data-tap
          className={cx(
            "flex h-9 items-center justify-between rounded-lg border bg-surface px-3 text-sm",
            step === 1 || step === 2 ? "border-accent ring-2 ring-accent-soft" : "border-line",
          )}
        >
          <span className="truncate">{shown}</span>
          <Chevron />
        </div>
        {step === 2 && (
          <ul className="mt-1 overflow-hidden rounded-lg border border-line bg-surface py-1 text-sm shadow-lg">
            {OPTIONS.slice(0, 3).map((o, i) => (
              <li key={o} className={cx("flex items-center justify-between px-3 py-1.5", i === 1 && "bg-accent-soft")}>
                <span className="truncate">{o}</span>
                {i === 0 && <span className="text-xs text-accent">현재</span>}
              </li>
            ))}
          </ul>
        )}
        <Tap show={step === 1} target="[data-tap]" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 px-4 pb-8 pt-5">
      {bad ? (
        <>
          <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
              수령 방법
            </label>
            <div className="relative">
              <select
                id={id}
                value={badValue}
                onChange={(e) => setBadValue(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-line bg-surface px-3 pr-9 text-sm"
              >
                <option value="">선택하세요</option>
                {BAD_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-3">
                <Chevron />
              </span>
            </div>
          </div>
          <p className="text-xs text-muted">
            보기가 둘뿐인데 목록 안에 숨겨 두어, 열어 보기 전에는 무엇을 고를 수 있는지 모른다.
          </p>
        </>
      ) : (
        <>
          <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
              배송 요청사항
            </label>
            <div className="relative">
              <select
                id={id}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-line bg-surface px-3 pr-9 text-sm"
              >
                {OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-3">
                <Chevron />
              </span>
            </div>
          </div>
          <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs" aria-live="polite">
            고른 값: <strong className="font-semibold">{value}</strong>
          </p>
        </>
      )}
      <Hint>
        {bad ? "보기가 2개라면 라디오 버튼으로 다 보여 주는 편이 빨라요" : "보기가 많고 하나만 고를 때 목록에 접어 둬요"}
      </Hint>
    </div>
  );
}
