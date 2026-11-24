"use client";

import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 빈 칸(레이블이 칸 안) → 누름 → 레이블이 위로 → 입력 중 → 다 씀
const SCRIPT = [900, 250, 700, 700, 1300] as const;
const TYPED = ["", "", "", "hong@", "hong@example.com"];

function Field({
  label,
  value,
  onChange,
  focusedOverride,
  type = "text",
  tap,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  focusedOverride?: boolean;
  type?: string;
  tap?: boolean;
}) {
  const id = useId();
  const [focus, setFocus] = useState(false);
  const focused = focusedOverride ?? focus;
  const up = focused || value !== "";
  return (
    <div className="relative" data-tap={tap ? "" : undefined}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={cx(
          "peer h-12 w-full rounded-lg border bg-surface px-3 pb-1.5 pt-5 text-sm outline-none",
          focused ? "border-accent ring-2 ring-accent-soft" : "border-line",
        )}
      />
      <label
        htmlFor={id}
        className={cx(
          "pointer-events-none absolute left-3 origin-left transition-all duration-150",
          up ? "top-1.5 text-[11px] font-medium" : "top-3.5 text-sm",
          up && focused ? "text-accent" : "text-muted",
        )}
      >
        {label}
      </label>
    </div>
  );
}

export default function FloatingLabelDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 4);
  const bad = variant === "bad";
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (bad && step === null) {
    return (
      <div className="flex h-full flex-col gap-3 px-4 pb-8 pt-5">
        {/* 나쁜 예: 플레이스홀더가 유일한 레이블. 쓰기 시작하면 무슨 칸인지 사라진다 */}
        <input
          aria-label="이메일"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-lg border border-line bg-surface px-3 text-sm placeholder:text-surface-3"
        />
        <input
          aria-label="휴대폰 번호"
          placeholder="휴대폰 번호 ('-' 없이)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-11 rounded-lg border border-line bg-surface px-3 text-sm placeholder:text-surface-3"
        />
        <Hint>글자를 치면 칸 이름과 형식 안내가 사라져요. 흐린 글씨도 잘 안 보여요</Hint>
      </div>
    );
  }

  return (
    <div className={cx("flex h-full flex-col gap-3 px-4 pt-5", step === null ? "pb-8" : "pb-3")}>
      <Field
        label="이메일"
        type="email"
        value={step === null ? email : TYPED[step]}
        onChange={setEmail}
        focusedOverride={step === null ? undefined : step >= 1}
        tap
      />
      <Field label="휴대폰 번호" value={step === null ? phone : ""} onChange={setPhone} focusedOverride={step === null ? undefined : false} />
      <Tap show={step === 1} target="[data-tap] input" />
      <Hint>칸을 눌러 보세요. 레이블이 사라지지 않고 위로 올라가요</Hint>
    </div>
  );
}
