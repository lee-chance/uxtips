"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 13인치 상세 → (탭) '가전' → 가전 목록 → (탭) '노트북' → …
const SCRIPT = [1200, 250, 1100, 250] as const;
const FULL = ["홈", "가전", "노트북", "13인치 노트북"];
const CHILDREN: Record<string, string[]> = {
  홈: ["가전", "패션", "식품"],
  가전: ["노트북", "모니터", "청소기"],
  노트북: ["13인치 노트북", "15인치 노트북"],
  "13인치 노트북": [],
};
// 나쁜 예: 위계가 아니라 지나온 순서(방문 기록)를 보여 준다
const HISTORY = ["노트북", "운동화", "쿠폰함", "노트북", "13인치 노트북"];

export default function BreadcrumbDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 0);
  const bad = variant === "bad";
  const [path, setPath] = useState(FULL);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // 경로를 바꾸면 새 페이지 제목으로 포커스를 옮긴다(누른 링크가 사라지므로)
  const navigate = (next: string[]) => {
    setPath(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const auto = step === null ? null : step < 2 ? FULL : FULL.slice(0, 2);
  const trail = auto ?? path;
  const here = trail[trail.length - 1];
  const tapTarget = step === 1 ? "가전" : step === 3 ? "노트북" : null;
  const crumbs = bad ? HISTORY : trail;

  return (
    <div className="flex h-full flex-col">
      <nav aria-label="이동 경로" className="shrink-0 border-b border-line px-3 py-2.5">
        <ol className="flex flex-wrap items-center gap-1 text-xs">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={`${c}-${i}`} className="flex items-center gap-1">
                {bad ? (
                  <button type="button" className="text-accent underline-offset-2 hover:underline">
                    {c}
                  </button>
                ) : last ? (
                  <span aria-current="page" className="font-semibold">
                    {c}
                  </span>
                ) : (
                  <button
                    type="button"
                    data-tap={c === tapTarget ? "" : undefined}
                    onClick={() => navigate(trail.slice(0, i + 1))}
                    className="text-muted underline-offset-2 hover:text-fg hover:underline"
                  >
                    {c}
                  </button>
                )}
                {!last && (
                  <svg aria-hidden viewBox="0 0 16 16" className="size-3 text-muted">
                    <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
        <motion.div
          key={here}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 p-3"
        >
          <h3 ref={headingRef} tabIndex={-1} className="text-sm font-semibold">{bad ? "13인치 노트북" : here}</h3>
          {bad || CHILDREN[here].length === 0 ? (
            <div className="mt-2 space-y-1.5" aria-hidden>
              <div className="h-14 rounded-lg bg-accent-soft" />
              <div className="h-2 w-2/3 rounded bg-surface-3" />
            </div>
          ) : (
            <ul className="mt-2 grid grid-cols-2 gap-2 @md:grid-cols-3">
              {CHILDREN[here].map((child) => (
                <li key={child}>
                  <button
                    type="button"
                    data-tap={child === tapTarget ? "" : undefined}
                    onClick={() => navigate([...trail, child])}
                    className={cx(
                      "w-full rounded-lg border border-line px-2.5 py-2 text-left text-xs hover:border-accent/50",
                    )}
                  >
                    {child}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      <Tap show={tapTarget !== null} target="[data-tap]" />
      <Hint>{bad ? "지나온 순서라서 지금 어디에 있는지 알 수 없어요" : "경로를 눌러 위 단계로 올라가 보세요"}</Hint>
    </div>
  );
}
