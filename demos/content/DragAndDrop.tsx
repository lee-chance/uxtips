"use client";

import { Reorder, useDragControls } from "motion/react";
import { useId, useState, type KeyboardEvent } from "react";
import { useDemoEnv, useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, Hint, cx } from "@/components/demo/kit";

// 자동 재생: 그대로 → '숙소 예약'을 집어 듦 → 맨 위로 옮김 → 내려놓음
const SCRIPT = [900, 500, 1200, 900] as const;

const BASE = ["여권 챙기기", "환전하기", "숙소 예약", "짐 싸기"];
const MOVED = ["숙소 예약", "여권 챙기기", "환전하기", "짐 싸기"];

export default function DragAndDropDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [items, setItems] = useState(BASE);
  const [grabbed, setGrabbed] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const helpId = useId();

  const list = step === null ? items : step >= 2 ? MOVED : BASE;
  const lifted = step === null ? grabbed : step === 1 || step === 2 ? "숙소 예약" : null;

  const move = (item: string, dir: -1 | 1) => {
    const i = items.indexOf(item);
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    setMsg(`${item}, ${items.length}개 중 ${j + 1}번째`);
  };

  return (
    <div className="flex h-full flex-col">
      <AppBar title="여행 준비" />
      {!bad && step === null && (
        <p id={helpId} className="px-3 pt-2 text-[11px] text-muted">
          손잡이를 끌거나, 손잡이에서 Space로 집고 ↑↓로 옮긴 뒤 Space로 놓아요.
        </p>
      )}
      <Reorder.Group
        axis="y"
        values={list}
        onReorder={step === null ? setItems : () => {}}
        className="space-y-1.5 p-3"
      >
        {list.map((item) => (
          <Item
            key={item}
            item={item}
            bad={bad}
            lifted={lifted === item}
            index={list.indexOf(item)}
            total={list.length}
            helpId={helpId}
            onGrab={(on) => {
              setGrabbed(on ? item : null);
              setMsg(on ? `${item} 집음. 위아래 화살표로 옮기고 Space로 놓으세요.` : `${item} 놓음`);
            }}
            onMove={(d) => move(item, d)}
          />
        ))}
      </Reorder.Group>
      <span role="status" aria-live="assertive" className="sr-only">
        {msg}
      </span>
      <Hint>{bad ? "마우스로 끄는 방법밖에 없어요. 키보드로는 순서를 바꿀 수 없어요" : "끌거나 키보드로 순서를 바꿔 보세요"}</Hint>
    </div>
  );
}

function Item({
  item,
  bad,
  lifted,
  index,
  total,
  helpId,
  onGrab,
  onMove,
}: {
  item: string;
  bad: boolean;
  lifted: boolean;
  index: number;
  total: number;
  helpId: string;
  onGrab: (on: boolean) => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const { autoplay } = useDemoEnv();
  const controls = useDragControls();

  const onKey = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onGrab(!lifted);
    } else if (lifted && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      onMove(e.key === "ArrowUp" ? -1 : 1);
    } else if (lifted && (e.key === "Escape" || e.key === "Tab")) {
      onGrab(false);
    }
  };

  return (
    <Reorder.Item
      value={item}
      // 나쁜 예는 줄 전체를 끌어야만 옮겨진다. 좋은 예는 손잡이로만 끈다.
      dragListener={!autoplay && bad}
      dragControls={controls}
      animate={{ scale: lifted ? 1.03 : 1, zIndex: lifted ? 10 : 0 }}
      className={cx(
        "relative flex h-9 items-center gap-2 rounded-lg border bg-surface px-2 text-sm @md:h-10",
        lifted ? "border-accent shadow-lg" : "border-line",
        bad && !autoplay && "cursor-grab active:cursor-grabbing",
      )}
    >
      {!bad && (
        <button
          type="button"
          aria-label={`${item} 옮기기, ${total}개 중 ${index + 1}번째`}
          aria-describedby={helpId}
          aria-pressed={lifted}
          onPointerDown={(e) => !autoplay && controls.start(e)}
          onKeyDown={onKey}
          className="grid h-7 w-6 shrink-0 cursor-grab touch-none place-items-center rounded text-muted hover:bg-surface-2 active:cursor-grabbing"
        >
          <svg viewBox="0 0 12 16" className="size-3.5" aria-hidden>
            {[3, 8, 13].map((y) => (
              <g key={y} fill="currentColor">
                <circle cx="4" cy={y} r="1.2" />
                <circle cx="8" cy={y} r="1.2" />
              </g>
            ))}
          </svg>
        </button>
      )}
      <span className="flex-1 truncate">{item}</span>
      {/* 끌지 않고도 한 번 눌러 옮길 수 있는 대안 (WCAG 2.5.7) */}
      {!bad && !autoplay && (
        <span className="flex gap-0.5">
          <MoveButton label={`${item} 위로`} disabled={index === 0} onClick={() => onMove(-1)} up />
          <MoveButton label={`${item} 아래로`} disabled={index === total - 1} onClick={() => onMove(1)} />
        </span>
      )}
    </Reorder.Item>
  );
}

function MoveButton({ label, disabled, onClick, up }: { label: string; disabled: boolean; onClick: () => void; up?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => !disabled && onClick()}
      className={cx("grid size-7 place-items-center rounded text-muted hover:bg-surface-2", disabled && "opacity-30")}
    >
      <svg viewBox="0 0 16 16" className={cx("size-3.5", !up && "rotate-180")} aria-hidden>
        <path d="m4 10 4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
