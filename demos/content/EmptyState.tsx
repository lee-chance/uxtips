"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 빈 상태 → 버튼 누름 → 항목이 채워짐 → 다시 비움
const SCRIPT = [1500, 300, 1500, 300] as const;

const PLACES = ["성수동 카페 거리", "서울숲", "망원 한강공원"];

export default function EmptyStateDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 0);
  const [items, setItems] = useState<string[]>([]);
  const list = step === null ? items : step === 2 ? PLACES : [];

  return (
    <div className="flex h-full flex-col">
      <AppBar
        title="즐겨찾기"
        right={
          step === null && items.length > 0 ? (
            <DemoButton size="sm" tone="ghost" onClick={() => setItems([])}>
              비우기
            </DemoButton>
          ) : undefined
        }
      />
      <div className={cx("flex flex-1 flex-col", step === null ? "pb-8" : "pb-3")}>
        <AnimatePresence mode="wait" initial={false}>
          {list.length > 0 ? (
            <motion.ul
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="divide-y divide-line"
            >
              {list.map((p) => (
                <li key={p} className="flex items-center gap-2.5 px-3 py-2.5 text-sm">
                  <Pin className="size-4 text-accent" />
                  {p}
                </li>
              ))}
            </motion.ul>
          ) : bad ? (
            // 나쁜 예: 무슨 화면인지, 무엇을 하면 되는지 아무것도 알려 주지 않는다
            <motion.p
              key="bad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="m-auto text-xs text-muted"
            >
              데이터가 없습니다.
            </motion.p>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="m-auto flex max-w-60 flex-col items-center px-4 text-center"
            >
              <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent @md:size-14">
                <Pin className="size-5 @md:size-6" />
              </span>
              <p className="mt-2 text-sm font-semibold">아직 즐겨찾기한 장소가 없어요</p>
              <p className="mt-0.5 text-xs text-muted">마음에 드는 장소의 별을 누르면 여기에 모여요.</p>
              <DemoButton data-tap size="sm" className="mt-3" onClick={() => setItems(PLACES)}>
                장소 둘러보기
              </DemoButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span role="status" className="sr-only">
        {step === null && items.length > 0 ? `장소 ${items.length}곳` : ""}
      </span>
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>{bad ? "무엇을 하면 되는지 알 수 없어요" : "빈 화면에서 다음 할 일을 알려 줘요"}</Hint>
    </div>
  );
}

function Pin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path
        d="M10 18s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="2.2" fill="currentColor" />
    </svg>
  );
}
