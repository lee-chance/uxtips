"use client";

import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, DemoButton, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 기본값 → 다른 보기 누름 → 그 보기로 바뀜(이전 선택은 자동 해제)
const SCRIPT = [1000, 250, 1500] as const;

const OPTIONS = [
  { label: "일반 배송", desc: "2~3일 · 무료" },
  { label: "빠른 배송", desc: "내일 도착 · 3,000원" },
  { label: "새벽 배송", desc: "내일 오전 7시 전 · 5,000원" },
];

export default function RadioButtonDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const name = useId();
  const [value, setValue] = useState(0);
  const [news, setNews] = useState(false);

  if (bad && step === null) {
    return (
      <div className="flex h-full flex-col gap-3 px-4 pb-8 pt-5">
        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="radio"
            name={`${name}-bad`}
            checked={news}
            onChange={() => setNews(true)}
            className="size-4 accent-[var(--accent)]"
          />
          뉴스레터 받기
        </label>
        <p className="text-xs text-muted" aria-live="polite">
          {news ? "한 번 고르면 다시 끌 방법이 없어요. 라디오 버튼은 눌러도 해제되지 않아요." : "눌러 본 뒤 다시 꺼 보세요."}
        </p>
        {news && (
          <DemoButton size="sm" tone="secondary" className="self-start" onClick={() => setNews(false)}>
            데모 되돌리기
          </DemoButton>
        )}
        <Hint>켜고 끄는 하나짜리 선택에는 체크박스나 스위치를 써요</Hint>
      </div>
    );
  }

  const current = step === null ? value : step === 2 ? 1 : 0;

  return (
    <div className={cx("flex h-full flex-col px-4 pt-4", step === null ? "pb-8" : "pb-3")}>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">배송 방법</legend>
        <div className="space-y-1.5">
          {OPTIONS.map((o, i) => (
            <label
              key={o.label}
              data-tap={i === 1 ? "" : undefined}
              className={cx(
                "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-1.5",
                current === i ? "border-accent bg-accent-soft/50" : "border-line",
              )}
            >
              <input
                type="radio"
                name={name}
                checked={current === i}
                onChange={() => setValue(i)}
                className="size-4 shrink-0 accent-[var(--accent)]"
              />
              {step === null ? (
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{o.label}</span>
                  <span className="block truncate text-xs text-muted">{o.desc}</span>
                </span>
              ) : (
                // 카드 미리보기는 높이가 작아 한 줄로
                <span className="flex min-w-0 items-baseline gap-1.5 text-sm">
                  <span className="shrink-0 font-medium">{o.label}</span>
                  <span className="truncate text-xs text-muted">{o.desc.split(" · ").pop()}</span>
                </span>
              )}
            </label>
          ))}
        </div>
      </fieldset>
      <Tap show={step === 1} target="[data-tap] input" />
      <Hint>화살표 키로 보기 사이를 옮겨 보세요. 하나만 골라져요</Hint>
    </div>
  );
}
