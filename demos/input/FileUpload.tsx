"use client";

import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, DemoButton, Hint, Tap } from "@/components/demo/kit";
import { CheckIcon, useInterval } from "@/demos/loading/shared";

// 자동 재생: 빈 드롭존 → 누름 → 올리는 중 35% → 80% → 완료
const SCRIPT = [900, 250, 800, 800, 1300] as const;
const AUTO_PCT = [0, 0, 35, 80, 100];

interface Item {
  id: number;
  name: string;
  size: string;
  pct: number;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
      <path d="M10 13V4m0 0L6.5 7.5M10 4l3.5 3.5M4 13v2.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Row({ item }: { item: Item }) {
  const done = item.pct >= 100;
  return (
    <li className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2">
      <span className="grid size-7 shrink-0 place-items-center rounded bg-accent-soft text-[10px] font-semibold text-accent">
        {item.name.split(".").pop()?.toUpperCase().slice(0, 3)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex justify-between gap-2 text-xs">
          <span className="truncate font-medium">{item.name}</span>
          <span className="shrink-0 text-muted">{done ? item.size : `${item.pct}%`}</span>
        </p>
        <div
          role="progressbar"
          aria-label={`${item.name} 올리기`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={item.pct}
          className="mt-1 h-1 overflow-hidden rounded-full bg-surface-3"
        >
          <div className={cx("h-full rounded-full", done ? "bg-success" : "bg-accent")} style={{ width: `${item.pct}%` }} />
        </div>
      </div>
      {done && <CheckIcon className="size-4 shrink-0 text-success" />}
    </li>
  );
}

export default function FileUploadDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 3);
  const bad = variant === "bad";
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [items, setItems] = useState<Item[]>([]);
  const [over, setOver] = useState(false);
  const [note, setNote] = useState("");

  const uploading = items.some((i) => i.pct < 100);
  useInterval(
    () => setItems((xs) => xs.map((x) => (x.pct < 100 ? { ...x, pct: Math.min(100, x.pct + 7) } : x))),
    uploading ? 120 : null,
  );

  const add = (files: { name: string; size: number }[]) => {
    if (files.length === 0) return;
    setItems((xs) => [
      ...xs,
      ...files.map((f, i) => ({
        id: Date.now() + i,
        name: f.name,
        size: f.size > 1e6 ? `${(f.size / 1e6).toFixed(1)}MB` : `${Math.max(1, Math.round(f.size / 1e3))}KB`,
        pct: 0,
      })),
    ]);
    setNote(`${files.length}개 파일을 올리는 중`);
  };

  const auto: Item[] = step !== null && step >= 2 ? [{ id: 1, name: "여행사진.jpg", size: "2.4MB", pct: AUTO_PCT[step] }] : [];
  const list = step === null ? items : auto;

  if (bad && step === null) {
    return (
      <div className="flex h-full flex-col gap-3 px-4 pb-8 pt-4">
        {/* 나쁜 예: 끌어다 놓기만 되는 영역. 눌러도, 키보드로도 파일을 고를 수 없다 */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            add(Array.from(e.dataTransfer.files));
          }}
          className={cx(
            "grid h-24 place-items-center rounded-xl border-2 border-dashed text-sm text-muted",
            over ? "border-accent bg-accent-soft" : "border-line",
          )}
        >
          여기로 끌어다 놓으세요
        </div>
        <ul className="space-y-2">
          {items.map((i) => (
            <Row key={i.id} item={i} />
          ))}
        </ul>
        <Hint>눌러도 아무 일도 없고, 어떤 파일을 얼마나 올릴 수 있는지도 몰라요</Hint>
      </div>
    );
  }

  return (
    <div className={cx("flex h-full flex-col gap-2.5 px-4 pt-4", step === null ? "pb-8" : "pb-3")}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          add(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <button
        type="button"
        data-tap
        aria-describedby={hintId}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(Array.from(e.dataTransfer.files));
        }}
        className={cx(
          "flex shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-3 py-3 text-center",
          over || step === 1 ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
        )}
      >
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <UploadIcon />
          파일 선택 또는 끌어다 놓기
        </span>
        <span id={hintId} className="text-[11px] text-muted">
          JPG, PNG · 파일당 최대 10MB
        </span>
      </button>
      <ul className="min-h-0 space-y-2 overflow-hidden" aria-label="올린 파일">
        {list.map((i) => (
          <Row key={i.id} item={i} />
        ))}
      </ul>
      {step === null && (
        <DemoButton
          size="sm"
          tone="ghost"
          className="self-start"
          onClick={() => add([{ name: `샘플사진${items.length + 1}.png`, size: 1_800_000 }])}
        >
          샘플 파일로 해보기
        </DemoButton>
      )}
      <p className="sr-only" aria-live="polite">
        {step === null ? (uploading ? note : items.length ? "올리기를 마쳤어요" : "") : ""}
      </p>
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>눌러서 고르거나, 파일을 끌어다 놓거나, 샘플로 해보세요</Hint>
    </div>
  );
}
