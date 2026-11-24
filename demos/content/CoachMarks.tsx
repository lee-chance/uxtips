"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { DemoButton, Hint, Tap, cx, useFocusTrap } from "@/components/demo/kit";

// 자동 재생: 평소 화면 → 첫 안내 → '다음' 누름 → 두 번째 안내
const SCRIPT = [700, 1300, 300, 1300] as const;

type Mark = { target: "search" | "filter" | "share" | "grid"; title: string; body: string };

const GOOD: Mark[] = [
  { target: "search", title: "사진 찾기", body: "사람, 장소, 날짜로 찾을 수 있어요." },
  { target: "filter", title: "보기 방식", body: "날짜별·앨범별로 바꿔 볼 수 있어요." },
  { target: "share", title: "앨범 공유", body: "링크 하나로 가족과 함께 봐요." },
];

// 나쁜 예: 쓰기 전에 6단계를 다 넘겨야 하고, 건너뛸 수 없다
const BAD: Mark[] = [
  { target: "search", title: "검색 기능 안내", body: "검색창에서는 사람, 장소, 날짜, 앨범, 파일 형식으로 사진을 찾을 수 있으며 고급 필터도 함께 쓸 수 있습니다." },
  { target: "filter", title: "필터 기능 안내", body: "필터에서는 정렬 방식, 보기 크기, 숨긴 사진 표시 여부를 설정할 수 있습니다." },
  { target: "share", title: "공유 기능 안내", body: "공유 버튼으로 링크 공유, 공동 앨범, 내보내기를 할 수 있습니다." },
  { target: "grid", title: "사진 목록 안내", body: "사진을 길게 누르면 여러 장을 고를 수 있습니다." },
  { target: "grid", title: "확대 안내", body: "두 손가락으로 벌리면 사진이 커집니다." },
  { target: "search", title: "다시 한번 검색 안내", body: "검색은 언제든 다시 쓸 수 있습니다." },
];

export default function CoachMarksDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 1);
  // 나쁜 예는 화면을 열자마자 투어를 띄운다
  const [index, setIndex] = useState<number | null>(bad ? 0 : null);
  const marks = bad ? BAD : GOOD;

  const current = step === null ? index : step === 0 ? null : step === 3 ? 1 : 0;
  const open = current !== null;
  const mark = open ? marks[current] : null;

  const stageRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const titleId = useId();
  const bodyId = useId();

  const close = () => setIndex(null);
  const next = () => setIndex((i) => (i === null || i >= marks.length - 1 ? null : i + 1));
  useFocusTrap(boxRef, open, bad ? undefined : close);

  // 안내 대상 요소의 위치를 재서 스포트라이트와 말풍선을 옮긴다(상태 대신 스타일 직접 갱신)
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const spot = spotRef.current;
    const box = boxRef.current;
    if (!stage || !spot || !box || !mark) return;
    const el = stage.querySelector(`[data-mark="${mark.target}"]`);
    if (!el) return;
    const s = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const pad = 4;
    Object.assign(spot.style, {
      left: `${r.left - s.left - pad}px`,
      top: `${r.top - s.top - pad}px`,
      width: `${r.width + pad * 2}px`,
      height: `${r.height + pad * 2}px`,
    });
    const boxW = box.offsetWidth;
    const cx = r.left - s.left + r.width / 2;
    const left = Math.max(8, Math.min(s.width - boxW - 8, cx - boxW / 2));
    box.style.left = `${left}px`;
    box.style.top = `${r.bottom - s.top + 12}px`;
    if (arrowRef.current) arrowRef.current.style.left = `${cx - left - 6}px`;
  }, [mark, open]);

  return (
    <div ref={stageRef} className="relative flex h-full flex-col">
      <div className="flex h-11 shrink-0 items-center gap-1 border-b border-line px-3">
        <span className="flex-1 text-[13px] font-semibold">사진첩</span>
        <IconBtn mark="search" label="검색">
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </IconBtn>
        <IconBtn mark="filter" label="보기 방식">
          <path d="M2.5 4h11M4.5 8h7M6.5 12h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </IconBtn>
        <IconBtn mark="share" label="공유">
          <path d="M8 2.5v8M5 5.5l3-3 3 3M3.5 9v4h9V9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </IconBtn>
      </div>
      <div data-mark="grid" aria-hidden className="m-3 grid flex-1 grid-cols-4 content-start gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={cx("aspect-square rounded-md", i % 3 === 0 ? "bg-accent-soft" : "bg-surface-3")} />
        ))}
      </div>
      {/* 닫히면 포커스가 돌아올 수 있게 투어 중에도 버튼을 남겨 둔다 */}
      {step === null && (
        <div className="flex justify-center pb-8">
          <DemoButton size="sm" tone="secondary" onClick={() => setIndex(0)}>
            새 기능 둘러보기
          </DemoButton>
        </div>
      )}

      <AnimatePresence>
        {open && mark && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20">
            {/* 스포트라이트: 큰 그림자로 주변만 어둡게 */}
            <div
              ref={spotRef}
              aria-hidden
              className="absolute rounded-lg shadow-[0_0_0_9999px_var(--scrim)] ring-2 ring-white/80 transition-all duration-300"
            />
            <div
              ref={boxRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={bodyId}
              className={cx(
                "absolute rounded-xl bg-surface p-3 text-left shadow-xl transition-[left,top] duration-300",
                bad ? "w-64 max-w-[calc(100%-16px)]" : "w-52",
              )}
            >
              <span ref={arrowRef} aria-hidden className="absolute -top-1.5 size-3 rotate-45 bg-surface" />
              <p id={titleId} className="text-sm font-semibold">
                {mark.title}
              </p>
              <p id={bodyId} className="mt-0.5 text-xs text-muted">
                {mark.body}
              </p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="mr-auto text-[11px] tabular-nums text-muted">
                  {current! + 1}/{marks.length}
                </span>
                {!bad && (
                  <DemoButton size="sm" tone="ghost" onClick={close}>
                    건너뛰기
                  </DemoButton>
                )}
                <DemoButton data-next data-autofocus size="sm" onClick={next}>
                  {current === marks.length - 1 ? "완료" : "다음"}
                </DemoButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Tap show={step === 2} target="[data-next]" />
      <Hint>{bad ? "건너뛸 수 없는 6단계 안내" : "짧고, 언제든 건너뛸 수 있어요 (Esc)"}</Hint>
    </div>
  );
}

function IconBtn({ mark, label, children }: { mark: Mark["target"]; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      data-mark={mark}
      aria-label={label}
      className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
    >
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
