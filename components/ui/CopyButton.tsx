"use client";

import { useState } from "react";

export function CopyButton({ text, label = "복사" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("fail");
    }
    setTimeout(() => setState("idle"), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-xs font-medium hover:bg-surface-2"
    >
      <svg aria-hidden viewBox="0 0 16 16" className="size-3.5">
        {state === "done" ? (
          <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <g fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" />
            <path d="M3 10.5V3.5A1 1 0 0 1 4 2.5h6.5" />
          </g>
        )}
      </svg>
      {state === "done" ? "복사했어요" : state === "fail" ? "복사 실패" : label}
      <span role="status" className="sr-only">
        {state === "done" ? "클립보드에 복사했습니다" : ""}
      </span>
    </button>
  );
}
