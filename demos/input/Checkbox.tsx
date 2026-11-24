"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 아무것도 안 고름 → 하나씩 체크(전체 동의가 '일부 선택'으로) → 전부 체크
const SCRIPT = [900, 700, 700, 1400] as const;

const TERMS = ["서비스 이용약관 (필수)", "개인정보 처리방침 (필수)", "마케팅 정보 수신 (선택)"];
const BAD = ["택배", "퀵서비스", "방문 수령"];

function Box({
  label,
  checked,
  indeterminate = false,
  onChange,
  tap,
  strong,
}: {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange?: (v: boolean) => void;
  tap?: string;
  strong?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <div className="flex items-center gap-2.5 py-1.5" data-tap={tap}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="size-4 shrink-0 accent-[var(--accent)]"
      />
      <label htmlFor={id} className={cx("min-w-0 truncate text-sm", strong && "font-semibold")}>
        {label}
      </label>
    </div>
  );
}

export default function CheckboxDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 1);
  const bad = variant === "bad";
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const [badChecked, setBadChecked] = useState<boolean[]>([false, false, false]);

  const list = step === null ? checked : TERMS.map((_, i) => i < step);
  const all = list.every(Boolean);
  const some = list.some(Boolean) && !all;

  if (bad && step === null) {
    const picked = BAD.filter((_, i) => badChecked[i]);
    return (
      <div className="flex h-full flex-col px-4 pb-8 pt-5">
        <fieldset>
          <legend className="mb-1 text-sm font-medium">배송 방법</legend>
          {BAD.map((o, i) => (
            <Box
              key={o}
              label={o}
              checked={badChecked[i]}
              onChange={(v) => setBadChecked((c) => c.map((x, j) => (j === i ? v : x)))}
            />
          ))}
        </fieldset>
        <p className="mt-2 text-xs text-danger" aria-live="polite">
          {picked.length > 1 ? `${picked.join(", ")}를 한꺼번에 고를 수 있어요. 무엇으로 보내야 하죠?` : ""}
        </p>
        <Hint>하나만 골라야 하는데 체크박스라 여러 개가 골라져요</Hint>
      </div>
    );
  }

  return (
    <div className={cx("flex h-full flex-col px-4 pt-4", step === null ? "pb-8" : "pb-3")}>
      <fieldset className="rounded-xl border border-line px-3 py-1.5">
        <legend className="sr-only">약관 동의</legend>
        <Box
          label="전체 동의"
          strong
          checked={all}
          indeterminate={some}
          onChange={(v) => setChecked([v, v, v])}
        />
        <div className="border-t border-line pl-6">
          {TERMS.map((t, i) => (
            <Box
              key={t}
              label={t}
              checked={list[i]}
              tap={step !== null && step === i + 1 ? "on" : undefined}
              onChange={(v) => setChecked((c) => c.map((x, j) => (j === i ? v : x)))}
            />
          ))}
        </div>
      </fieldset>
      <p className="mt-2 truncate text-xs text-muted" aria-live="polite">
        {all ? "모두 동의했어요" : some ? "일부만 골라 전체 동의가 '–'로 보여요" : "여러 개를 함께 고를 수 있어요"}
      </p>
      {step !== null && step > 0 && <Tap key={step} show target='[data-tap="on"] input' />}
      <Hint>하위 항목을 하나만 골라 &lsquo;전체 동의&rsquo;의 중간 상태를 보세요</Hint>
    </div>
  );
}
