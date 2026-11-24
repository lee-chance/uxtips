"use client";

import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 가려진 비밀번호 → 눈 아이콘 누름 → 보임 → 다시 누름(가림)
const SCRIPT = [1000, 250, 1600, 250] as const;
const SAMPLE = "summer2024!";

function Eye({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
      <path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {off && <path d="m3 3 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
    </svg>
  );
}

export default function PasswordToggleDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const id = useId();
  const id2 = useId();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);

  if (bad && step === null) {
    const mismatch = pw2 !== "" && pw !== pw2;
    return (
      <div className="flex h-full flex-col gap-3 px-4 pb-8 pt-5">
        <div>
          <label htmlFor={id} className="mb-1 block text-sm font-medium">
            비밀번호
          </label>
          <input id={id} type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm" />
        </div>
        <div>
          <label htmlFor={id2} className="mb-1 block text-sm font-medium">
            비밀번호 확인
          </label>
          <input
            id={id2}
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            aria-invalid={mismatch}
            aria-describedby={`${id2}-m`}
            className={cx("h-10 w-full rounded-lg border bg-surface px-3 text-sm", mismatch ? "border-danger" : "border-line")}
          />
          <p id={`${id2}-m`} className="mt-1 h-4 text-xs text-danger" aria-live="polite">
            {mismatch ? "비밀번호가 달라요. 어디가 틀렸는지는 볼 수 없어요." : ""}
          </p>
        </div>
        <Hint>입력한 글자를 확인할 방법이 없어 같은 걸 두 번 치게 해요</Hint>
      </div>
    );
  }

  const visible = step === null ? show : step === 2 || step === 3;
  const value = step === null ? pw : SAMPLE;

  return (
    <div className={cx("flex h-full flex-col justify-center px-4", step === null ? "pb-8" : "pb-3")}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        비밀번호
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          readOnly={step !== null}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="new-password"
          className="h-11 w-full rounded-lg border border-line bg-surface pl-3 pr-11 font-mono text-sm"
        />
        <button
          type="button"
          data-tap
          aria-label="비밀번호 보기"
          aria-pressed={visible}
          aria-controls={id}
          onClick={() => setShow((s) => !s)}
          className="absolute right-1 top-1 grid size-9 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
        >
          <Eye off={visible} />
        </button>
      </div>
      <p className="mt-1.5 text-xs text-muted" aria-live="polite">
        {visible ? "비밀번호가 보이고 있어요" : "8자 이상, 숫자 포함"}
      </p>
      <Tap show={step === 1 || step === 3} target="[data-tap]" />
      <Hint>눈 아이콘으로 친 글자를 확인해 보세요</Hint>
    </div>
  );
}
