"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";
import { CheckIcon } from "../loading/shared";

// 자동 재생: 대기 → 둘째 줄 누름(물결 + 눌림 층) → 선택됨 표시 → 원래대로
const SCRIPT = [800, 700, 1300, 400] as const;
const ROWS = ["사진 자동 백업", "와이파이에서만", "원본 화질", "위치 정보 포함"];

interface Wave {
  id: number;
  x: number;
  y: number;
  size: number;
}

function RippleRow({
  label,
  checked,
  bad,
  autoPress,
  tapTarget,
  onToggle,
}: {
  tapTarget: boolean;
  label: string;
  checked: boolean;
  bad: boolean;
  autoPress: number | null;
  onToggle: () => void;
}) {
  const [waves, setWaves] = useState<Wave[]>([]);
  const nextId = useRef(0);

  const spawn = (e: MouseEvent<HTMLButtonElement>) => {
    if (bad) return; // 나쁜 예: 눌렀다는 표시가 전혀 없다
    const r = e.currentTarget.getBoundingClientRect();
    // 키보드로 누르면(detail === 0) 가운데에서 퍼진다
    const x = e.detail === 0 ? r.width / 2 : e.clientX - r.left;
    const y = e.detail === 0 ? r.height / 2 : e.clientY - r.top;
    const size = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2;
    const id = nextId.current++;
    setWaves((w) => [...w, { id, x, y, size }]);
  };

  return (
    <li>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-tap={tapTarget ? "" : undefined}
        onClick={(e) => {
          spawn(e);
          onToggle();
        }}
        className={cx(
          "relative flex h-11 w-full items-center justify-between overflow-hidden px-3 text-left text-sm",
          // 좋은 예: 눌림 층(state layer) — 누르는 동안 살짝 어두워진다
          !bad && "active:bg-fg/10 hover:bg-fg/5",
        )}
      >
        <span>{label}</span>
        <span
          className={cx(
            "grid size-5 place-items-center rounded-full border",
            checked ? "border-accent bg-accent text-accent-fg" : "border-line",
          )}
        >
          {checked && <CheckIcon className="size-3.5" />}
        </span>
        <AnimatePresence>
          {waves.map((w) => (
            <motion.span
              key={w.id}
              aria-hidden
              className="pointer-events-none absolute rounded-full bg-accent/25"
              style={{ left: w.x - w.size / 2, top: w.y - w.size / 2, width: w.size, height: w.size }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              onAnimationComplete={() => setWaves((all) => all.filter((x) => x.id !== w.id))}
            />
          ))}
          {autoPress !== null && (
            <motion.span
              key={`auto-${autoPress}`}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </button>
    </li>
  );
}

export default function RippleDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const [on, setOn] = useState<boolean[]>([true, false, false, false]);
  const [pending, setPending] = useState(0);

  // 나쁜 예: 반응이 0.9초 늦게 온다 — 사용자는 안 눌린 줄 알고 또 누른다
  const queue = useRef<number[]>([]);
  useEffect(() => {
    if (pending === 0) return;
    const t = setTimeout(() => {
      const i = queue.current.shift();
      if (i !== undefined) setOn((xs) => xs.map((v, j) => (j === i ? !v : v)));
      setPending((p) => p - 1);
    }, 900);
    return () => clearTimeout(t);
  }, [pending]);

  const toggle = (i: number) => {
    if (bad) {
      queue.current.push(i);
      setPending((p) => p + 1);
      return;
    }
    setOn((xs) => xs.map((v, j) => (j === i ? !v : v)));
  };

  const shown = step === null ? on : ROWS.map((_, i) => i === 0 || (i === 1 && step === 2));

  return (
    <div className="flex h-full flex-col">
      <ul className="m-3 divide-y divide-line overflow-hidden rounded-xl border border-line" aria-label="백업 설정">
        {(step === null ? ROWS : ROWS.slice(0, 3)).map((label, i) => (
          <RippleRow
            key={label}
            label={label}
            checked={shown[i]}
            bad={bad}
            tapTarget={i === 1}
            autoPress={step !== null && i === 1 && step === 1 ? step : null}
            onToggle={() => toggle(i)}
          />
        ))}
      </ul>
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>{bad ? "눌러도 아무 표시가 없고 0.9초 뒤에야 바뀌어요" : "누른 자리에서 물결이 퍼지고, 결과(체크)도 함께 바뀌어요"}</Hint>
    </div>
  );
}
