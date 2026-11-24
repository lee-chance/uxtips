"use client";

import { useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 1쪽 → (탭) 2 → 2쪽 → (탭) 3 → 3쪽 → (탭) 1
const SCRIPT = [1000, 250, 1000, 250, 1000, 250] as const;
const PAGES = 5;
const PER = 3;
const TOPICS = ["공지", "후기", "질문", "정보", "자랑"];

function itemsOf(page: number) {
  return Array.from({ length: PER }, (_, i) => {
    const n = (page - 1) * PER + i + 1;
    return `${TOPICS[(n - 1) % TOPICS.length]} · 게시글 ${n}`;
  });
}

export default function PaginationDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const [user, setUser] = useState(1);
  const listRef = useRef<HTMLHeadingElement>(null);

  const page = step === null ? user : Math.floor(step / 2) + 1;
  const tapping = step !== null && step % 2 === 1;
  const nextAuto = (page % 3) + 1;

  const go = (p: number) => {
    setUser(Math.min(PAGES, Math.max(1, p)));
    // 새 쪽의 처음으로 포커스를 옮겨 스크린리더가 바뀐 내용을 읽게 한다
    listRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      <h3 ref={listRef} tabIndex={-1} className="px-3 pt-3 text-sm font-semibold">
        자유게시판 {!bad && <span className="font-normal text-muted">· {page}쪽</span>}
      </h3>
      <ul className="flex-1 space-y-1.5 p-3">
        {itemsOf(page).map((t) => (
          <li key={t} className="rounded-lg bg-surface-2 px-3 py-2 text-xs">
            {t}
          </li>
        ))}
      </ul>
      <nav aria-label="페이지" className={cx("shrink-0 px-3", step === null ? "pb-8" : "pb-3")}>
        {bad ? (
          <div className="flex justify-between">
            <button type="button" onClick={() => go(page - 1)} className="text-xs text-muted hover:text-fg">
              이전
            </button>
            <button type="button" onClick={() => go(page + 1)} className="text-xs text-muted hover:text-fg">
              다음
            </button>
          </div>
        ) : (
          <ul className="flex items-center justify-center gap-1">
            <li>
              <PageBtn label="이전 페이지" disabled={page === 1} onClick={() => go(page - 1)}>
                ‹
              </PageBtn>
            </li>
            {Array.from({ length: PAGES }, (_, i) => i + 1).map((p) => (
              <li key={p}>
                <button
                  type="button"
                  aria-current={p === page ? "page" : undefined}
                  data-tap={tapping && p === nextAuto ? "" : undefined}
                  onClick={() => go(p)}
                  className={cx(
                    "grid size-7 place-items-center rounded-md text-xs tabular-nums",
                    p === page ? "bg-accent font-semibold text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  {p}
                  <span className="sr-only">쪽</span>
                </button>
              </li>
            ))}
            <li>
              <PageBtn label="다음 페이지" disabled={page === PAGES} onClick={() => go(page + 1)}>
                ›
              </PageBtn>
            </li>
          </ul>
        )}
      </nav>
      <Tap show={tapping} target="[data-tap]" />
      <Hint>{bad ? "지금 몇 쪽인지, 모두 몇 쪽인지 알 수 없어요" : "번호를 눌러 원하는 쪽으로 바로 가요"}</Hint>
    </div>
  );
}

function PageBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => !disabled && onClick()}
      className={cx(
        "grid size-7 place-items-center rounded-md text-sm",
        disabled ? "text-surface-3" : "text-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      <span aria-hidden>{children}</span>
    </button>
  );
}
