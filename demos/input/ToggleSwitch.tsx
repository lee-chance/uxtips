"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, DemoButton, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 꺼짐 → 누름 → 켜짐(바로 적용) → 누름 → 꺼짐
const SCRIPT = [900, 250, 1300, 250] as const;

function Switch({
  on,
  onChange,
  labelId,
  tap,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  labelId: string;
  tap?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={labelId}
      data-tap={tap ? "" : undefined}
      onClick={() => onChange(!on)}
      className={cx(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        on ? "bg-accent" : "bg-surface-3",
      )}
    >
      <motion.span
        aria-hidden
        className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow"
        initial={false}
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: "spring", duration: 0.25, bounce: 0.2 }}
      />
    </button>
  );
}

export default function ToggleSwitchDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const [wifi, setWifi] = useState(false);
  const [draft, setDraft] = useState(false); // 나쁜 예: 저장 전 임시 값
  const [saved, setSaved] = useState(false);
  const id1 = useId();
  const id2 = useId();
  const [dnd, setDnd] = useState(true);

  const on = step === null ? (bad ? draft : wifi) : step === 2 || step === 3;
  const applied = step === null ? (bad ? saved : wifi) : on;

  return (
    <div className={cx("flex h-full flex-col px-4 pt-4", step === null ? "pb-8" : "pb-3")}>
      <ul className="divide-y divide-line rounded-xl border border-line">
        <li className="flex items-center justify-between gap-3 px-3 py-2.5">
          <div className="min-w-0">
            <p id={id1} className="text-sm font-medium">
              {bad ? "알림 끄지 않기" : "Wi-Fi"}
            </p>
            <p className="text-xs text-muted">
              {bad ? (applied ? "적용됨: 켬" : "적용됨: 끔") : applied ? "연결됨 · 집" : "꺼짐"}
            </p>
          </div>
          <Switch
            on={on}
            labelId={id1}
            tap={step === 1 || step === 3}
            onChange={(v) => (bad ? setDraft(v) : setWifi(v))}
          />
        </li>
        <li className="flex items-center justify-between gap-3 px-3 py-2.5">
          <p id={id2} className="text-sm font-medium">
            방해 금지
          </p>
          <Switch on={dnd} labelId={id2} onChange={setDnd} />
        </li>
      </ul>

      {/* 좋은 예: 스위치는 누르는 즉시 적용되므로 저장 버튼이 없다 */}
      {bad && step === null && (
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-xs text-muted">{draft !== saved ? "저장하지 않은 변경이 있어요" : ""}</span>
          <DemoButton size="sm" onClick={() => setSaved(draft)}>
            저장
          </DemoButton>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {step === null ? (applied ? "켜짐" : "꺼짐") : ""}
      </p>

      <Tap show={step === 1 || step === 3} target="[data-tap]" />
      <Hint>
        {bad ? "스위치를 켜도 '저장'을 눌러야 적용되고, 이름이 부정형이라 헷갈려요" : "누르는 즉시 적용돼요"}
      </Hint>
    </div>
  );
}
