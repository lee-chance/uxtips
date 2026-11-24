"use client";

import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { DemoButton, Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 폼 → 결제 누름 → 칸 옆에 오류 → 다시
const SCRIPT = [800, 300, 1900, 300] as const;

export default function ErrorMessageDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("1234 5678 9012");
  const [submitted, setSubmitted] = useState(false);
  const [ok, setOk] = useState(false);

  const digits = value.replace(/\D/g, "");
  const invalid = digits.length !== 16;
  const showError = step === null ? submitted && invalid : step === 2;

  return (
    <div className="flex h-full flex-col justify-center px-5 @md:px-16">
      {/* 나쁜 예: 멀리 떨어진 위쪽에 모호한 문구, 빨간색만으로 표시 */}
      {bad && showError && (
        <p role="alert" className="absolute inset-x-0 top-3 text-center text-xs text-danger">
          오류가 발생했습니다. (코드 0x80070057)
        </p>
      )}
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          setOk(!invalid);
          if (invalid) inputRef.current?.focus();
        }}
        className="flex flex-col"
      >
        <label htmlFor={id} className="mb-1.5 text-sm font-medium">
          카드 번호
        </label>
        <input
          ref={inputRef}
          id={id}
          inputMode="numeric"
          value={step === null ? value : "1234 5678 9012"}
          readOnly={step !== null}
          onChange={(e) => {
            setValue(e.target.value);
            setOk(false);
          }}
          aria-invalid={!bad && showError}
          aria-describedby={!bad && showError ? `${id}-err` : undefined}
          className={cx(
            "h-10 rounded-lg border bg-surface px-3 text-sm tabular-nums",
            showError ? "border-danger" : "border-line",
          )}
        />
        {!bad && showError && (
          <p id={`${id}-err`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs text-danger">
            <svg viewBox="0 0 16 16" className="mt-px size-3.5 shrink-0" aria-hidden>
              <circle cx="8" cy="8" r="7" fill="currentColor" />
              <path d="M8 4.5v4M8 11v.5" stroke="var(--surface)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>
              카드 번호가 {digits.length || 12}자리예요. 카드 앞면의 16자리 숫자를 모두 입력해 주세요.
            </span>
          </p>
        )}
        <DemoButton type="submit" className="mt-4">
          결제하기
        </DemoButton>
        <p role="status" className="mt-2 min-h-4 text-center text-xs text-success">
          {step === null && ok ? "결제했어요" : ""}
        </p>
      </form>
      <Tap show={step === 1} x="50%" y="calc(50% + 30px)" />
      <Hint>16자리가 아닌 번호로 결제해 보세요</Hint>
    </div>
  );
}
