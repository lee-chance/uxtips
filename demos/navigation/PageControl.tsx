"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { Hint, cx } from "@/components/demo/kit";

// 자동 재생: 한 장씩 넘어가며 점이 따라 움직인다
const SCRIPT = [1100, 1100, 1100] as const;

const PAGES = [
  { title: "사진을 모아 보세요", body: "날짜·장소별로 자동 정리", tone: "bg-accent-soft" },
  { title: "앨범을 함께 써요", body: "가족과 친구를 초대", tone: "bg-success-soft" },
  { title: "어디서나 열어요", body: "휴대폰·태블릿·웹", tone: "bg-surface-2" },
];
const BAD_COUNT = 12;

export default function PageControlDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 1);
  const [user, setUser] = useState(0);
  const count = bad ? BAD_COUNT : PAGES.length;
  const page = step === null ? user : step;
  const go = (i: number) => setUser(Math.max(0, Math.min(count - 1, i)));
  const p = PAGES[page % PAGES.length];

  return (
    <div className="flex h-full flex-col p-3">
      <div
        role="group"
        aria-roledescription="페이지 넘김"
        aria-label={`소개 ${count}장 중 ${page + 1}번째`}
        tabIndex={step === null ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(page + 1);
          else if (e.key === "ArrowLeft") go(page - 1);
          else return;
          e.preventDefault();
        }}
        className="relative min-h-0 flex-1 overflow-hidden rounded-xl"
      >
        <motion.div
          key={page}
          drag={step === null ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) go(page + 1);
            else if (info.offset.x > 50) go(page - 1);
          }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={cx("flex h-full cursor-grab flex-col items-center justify-center gap-1 text-center", p.tone)}
        >
          <p className="text-sm font-bold @md:text-lg">{p.title}</p>
          <p className="text-xs text-muted">{p.body}</p>
          {bad && <p className="text-[10px] text-muted">({page + 1}번째 화면)</p>}
        </motion.div>
      </div>

      <div className={cx("flex items-center justify-center gap-3 pt-3", step === null ? "pb-6" : "pb-1")}>
        {!bad && step === null && (
          <button
            type="button"
            onClick={() => go(page - 1)}
            disabled={page === 0}
            aria-label="이전"
            className="grid size-7 place-items-center rounded-md text-muted hover:bg-surface-2 disabled:opacity-30"
          >
            ‹
          </button>
        )}
        {bad ? (
          // 나쁜 예: 12개의 작은 점, 지금 위치가 거의 구분되지 않고 누를 수도 없다
          <div className="flex gap-1" aria-hidden>
            {Array.from({ length: BAD_COUNT }).map((_, i) => (
              <span key={i} className={cx("size-1 rounded-full", i === page ? "bg-muted" : "bg-surface-3")} />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {PAGES.map((pg, i) => (
              <button
                key={pg.title}
                type="button"
                aria-label={`${i + 1}번째 화면`}
                aria-current={i === page ? "true" : undefined}
                tabIndex={step === null ? 0 : -1}
                onClick={() => go(i)}
                className="grid size-6 place-items-center"
              >
                <motion.span
                  layout
                  className={cx("block h-2 rounded-full", i === page ? "w-5 bg-accent" : "w-2 bg-surface-3")}
                />
              </button>
            ))}
          </div>
        )}
        {!bad && step === null && (
          <button
            type="button"
            onClick={() => go(page + 1)}
            disabled={page === count - 1}
            aria-label="다음"
            className="grid size-7 place-items-center rounded-md text-muted hover:bg-surface-2 disabled:opacity-30"
          >
            ›
          </button>
        )}
      </div>
      <Hint>{bad ? "점이 너무 많고 작아서 지금 위치를 알기 어려워요 (←/→로 넘김)" : "끌어서 넘기기 · 점을 눌러 이동 · ←/→"}</Hint>
    </div>
  );
}
