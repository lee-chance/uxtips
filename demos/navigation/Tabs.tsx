"use client";

import { motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 상품정보 → (탭) 리뷰 → (탭) 문의 → 처음
const SCRIPT = [900, 250, 900, 250, 900, 250] as const;
const GOOD = ["상품정보", "리뷰", "문의"];
const BAD = ["1. 약관", "2. 본인확인", "3. 주소", "4. 결제수단", "5. 쿠폰", "6. 확인", "7. 완료"];

const PANELS: Record<string, string[]> = {
  상품정보: ["무게 1.2kg · 13인치", "배터리 최대 18시간"],
  리뷰: ["가볍고 화면이 선명해요 ★★★★★", "배송이 빨랐어요 ★★★★☆"],
  문의: ["충전기 포함인가요? — 네, 포함돼요", "색상 변경 되나요? — 출고 전 가능해요"],
};

export default function TabsDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const tabs = bad ? BAD : GOOD;
  const [user, setUser] = useState(0);
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);

  // 자동 재생: 짝수 단계에서 머물고, 홀수 단계에서 다음 탭을 누른다
  const current = step === null ? user : Math.floor(step / 2) % GOOD.length;
  const tapping = step !== null && step % 2 === 1;
  const nextIndex = (current + 1) % tabs.length;

  const select = (i: number) => {
    setUser(i);
    const btn = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[i];
    btn?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      <AppBar title={bad ? "주문하기" : "노트북 13"} />
      <div
        ref={listRef}
        role="tablist"
        aria-label={bad ? "주문 단계" : "상품 상세"}
        className={cx("relative flex shrink-0 border-b border-line", bad && "overflow-x-auto")}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") select((current + 1) % tabs.length);
          else if (e.key === "ArrowLeft") select((current - 1 + tabs.length) % tabs.length);
          else if (e.key === "Home") select(0);
          else if (e.key === "End") select(tabs.length - 1);
          else return;
          e.preventDefault();
        }}
      >
        {tabs.map((t, i) => (
          <button
            key={t}
            id={`${id}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === current}
            aria-controls={`${id}-panel`}
            tabIndex={i === current ? 0 : -1}
            data-tap={i === nextIndex && !bad ? "" : undefined}
            onClick={() => setUser(i)}
            className={cx(
              "relative h-10 shrink-0 px-3 text-sm transition-colors",
              !bad && "flex-1",
              i === current ? "font-semibold text-fg" : "text-muted hover:text-fg",
            )}
          >
            {t}
            {i === current && (
              <motion.span
                layoutId={`${id}-ink`}
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
              />
            )}
          </button>
        ))}
      </div>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${current}`}
        tabIndex={0}
        className="flex-1 space-y-2 p-3 text-sm"
      >
        {bad ? (
          <>
            <p className="font-medium">{tabs[current]}</p>
            <p className="text-xs text-muted">
              순서대로 해야 하는 단계인데 탭이라 아무 데나 누를 수 있고, 뒤쪽 탭은 화면 밖으로 밀려 보이지 않아요.
            </p>
          </>
        ) : (
          PANELS[tabs[current]].map((line) => (
            <p key={line} className="rounded-lg bg-surface-2 px-3 py-2 text-xs">
              {line}
            </p>
          ))
        )}
      </div>
      <Tap show={tapping} target="[data-tap]" />
      <Hint>{bad ? "탭이 단계처럼 쓰여요. 옆으로 밀어야 보여요" : "탭을 누르거나 ← → 키로 옮겨 보세요"}</Hint>
    </div>
  );
}
