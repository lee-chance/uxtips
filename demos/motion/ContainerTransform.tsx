"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap, useFocusTrap } from "@/components/demo/kit";

// 자동 재생: 대기 → 카드 누름 → 카드가 상세 화면으로 커짐 → 다시 카드로 줄어듦
const SCRIPT = [900, 300, 1700, 900] as const;

const ALBUMS = [
  { title: "여름 바다", meta: "사진 32장", tone: "bg-accent/30" },
  { title: "가을 산행", meta: "사진 18장", tone: "bg-success/30" },
  { title: "골목 산책", meta: "사진 9장", tone: "bg-danger/25" },
  { title: "겨울 여행", meta: "사진 21장", tone: "bg-surface-3" },
];

export default function ContainerTransformDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState<number | null>(null);
  const bad = variant === "bad";
  const group = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const open = step === null ? userOpen : step === 2 ? 0 : null;
  const close = () => setUserOpen(null);
  useFocusTrap(dialogRef, open !== null, close);

  return (
    <LayoutGroup id={group}>
      <div className="relative h-full overflow-hidden">
        <ul className="grid grid-cols-2 gap-2.5 p-3">
          {ALBUMS.map((a, i) => (
            <li key={a.title}>
              <motion.button
                type="button"
                data-tap={i === 0 ? "" : undefined}
                layoutId={bad ? undefined : `album-${i}`}
                onClick={() => setUserOpen(i)}
                aria-haspopup="dialog"
                className="block w-full overflow-hidden rounded-xl border border-line bg-surface text-left"
                style={{ borderRadius: 12 }}
              >
                <motion.div layoutId={bad ? undefined : `album-img-${i}`} className={cx("h-9 @md:h-20", a.tone)} />
                <div className="px-2.5 py-1.5">
                  <p className="truncate text-xs font-semibold">{a.title}</p>
                  <p className="text-[11px] text-muted">{a.meta}</p>
                </div>
              </motion.button>
            </li>
          ))}
        </ul>
        <Tap show={step === 1} target="[data-tap]" />

        <AnimatePresence>
          {open !== null && (
            <motion.div
              key="detail"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              layoutId={bad ? undefined : `album-${open}`}
              // 나쁜 예: 누른 카드와 상관없이 오른쪽에서 밀려 들어오고 느리다
              initial={bad ? { x: "100%" } : undefined}
              animate={bad ? { x: 0 } : undefined}
              exit={bad ? { x: "100%" } : undefined}
              transition={bad ? { duration: 1.1, ease: "easeInOut" } : { type: "spring", duration: 0.45, bounce: 0.12 }}
              className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-surface"
              style={{ borderRadius: 0 }}
            >
              <motion.div
                layoutId={bad ? undefined : `album-img-${open}`}
                className={cx("h-24 shrink-0 @md:h-40", ALBUMS[open].tone)}
              />
              <div className="flex items-center gap-2 px-3 pt-3">
                <button
                  type="button"
                  onClick={close}
                  aria-label="앨범 목록으로 돌아가기"
                  className="grid size-8 place-items-center rounded-md hover:bg-surface-2"
                >
                  <svg aria-hidden viewBox="0 0 20 20" className="size-4">
                    <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <h3 id={titleId} className="text-base font-bold">
                  {ALBUMS[open].title}
                </h3>
              </div>
              <p className="px-3 pl-13 text-xs text-muted">{ALBUMS[open].meta} · 2026년</p>
              <div className="grid grid-cols-4 gap-1 p-3" aria-hidden>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={cx("aspect-square rounded", ALBUMS[open].tone)} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Hint>{bad ? "어느 카드를 눌렀는지와 상관없이 옆에서 밀려 들어와요" : "카드를 누르면 그 카드가 커지며 상세 화면이 돼요"}</Hint>
      </div>
    </LayoutGroup>
  );
}
