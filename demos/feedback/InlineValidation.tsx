"use client";

import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { Hint, cx } from "@/components/demo/kit";

// 자동 재생: 입력 중 → 칸을 떠남(오류) → 고쳐 씀(통과)
const SCRIPT = [500, 500, 1400, 500, 1200] as const;
const AUTO_TEXT = ["ab", "abc@mail", "abc@mail", "abc@mail.c", "abc@mail.com"];
const AUTO_TOUCHED = [false, false, true, true, true];

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default function InlineValidationDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const id = useId();
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const v = step === null ? value : AUTO_TEXT[step];
  const t = step === null ? touched : AUTO_TOUCHED[step];
  const valid = isEmail(v);

  // 좋은 예: 칸을 떠난 뒤(blur)부터 검사, 그 뒤로는 고치는 즉시 다시 검사
  // 나쁜 예: 첫 글자부터 오류를 띄운다
  const showError = bad ? v.length > 0 && !valid : t && v.length > 0 && !valid;
  const showOk = !bad && t && valid;

  return (
    <div className="flex h-full flex-col justify-center px-5 @md:px-16">
      <label htmlFor={id} className="mb-1.5 text-sm font-medium">
        이메일
      </label>
      <div className="relative">
        <input
          id={id}
          type="email"
          autoComplete="off"
          value={v}
          readOnly={step !== null}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError}
          aria-describedby={`${id}-msg`}
          placeholder="name@example.com"
          className={cx(
            "h-10 w-full rounded-lg border bg-surface px-3 pr-9 text-sm outline-none transition-colors placeholder:text-muted/60",
            showError ? "border-danger" : showOk ? "border-success" : "border-line focus:border-accent",
          )}
        />
        {showOk && (
          <svg viewBox="0 0 16 16" className="absolute right-3 top-3 size-4 text-success" aria-hidden>
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <p id={`${id}-msg`} className="mt-1.5 min-h-5 text-xs" aria-live="polite">
        {showError ? (
          <span className="text-danger">
            {bad ? "잘못된 이메일!" : "이메일 형식이 아니에요. 예: name@example.com"}
          </span>
        ) : showOk ? (
          <span className="text-success">사용할 수 있는 이메일이에요</span>
        ) : null}
      </p>
      <Hint>입력하고 Tab으로 칸을 떠나 보세요</Hint>
    </div>
  );
}
