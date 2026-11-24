"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 1번 → (탭) 다음 → 2번 → (탭) 다음 → 3번 → (탭) 다음
const SCRIPT = [900, 250, 900, 250, 900, 250] as const;
const SLIDES = [
  { title: "봄맞이 할인", body: "가방·신발 최대 30%", tone: "bg-accent-soft" },
  { title: "새로 들어온 책", body: "이번 주 신간 12권", tone: "bg-success-soft" },
  { title: "무료 배송 주간", body: "금액 상관없이 무료", tone: "bg-surface-3" },
];

export default function CarouselDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const [user, setUser] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);

  const index = step === null ? user : Math.floor(step / 2) % SLIDES.length;
  const tapping = step !== null && step % 2 === 1;
  const n = SLIDES.length;

  const go = (d: number) => {
    setDir(d);
    setUser((i) => (i + d + n) % n);
  };

  // 상세 데모 자동 회전. 좋은 예: 5초, 멈춤 버튼, 마우스·포커스가 있으면 멈춤.
  // 나쁜 예: 1.5초마다 넘어가고 멈출 방법이 없다.
  const rotating = step === null && (bad || (!paused && !hover));
  useEffect(() => {
    if (!rotating) return;
    const t = setInterval(() => go(1), bad ? 1500 : 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotating, bad]);

  const slide = SLIDES[index];

  return (
    <div className={cx("flex h-full flex-col p-3", step === null && "pb-8")}>
      <section
        aria-roledescription="carousel"
        aria-label="이번 주 소식"
        className="relative flex min-h-0 flex-1 flex-col"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl" aria-live={rotating ? "off" : "polite"}>
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${n}`}
              custom={dir}
              initial={{ x: `${dir * 100}%` }}
              animate={{ x: 0 }}
              exit={{ x: `${dir * -100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={cx("absolute inset-0 flex flex-col justify-end p-4", slide.tone)}
            >
              <p className="text-base font-bold @md:text-xl">{slide.title}</p>
              <p className="text-xs text-muted @md:text-sm">{slide.body}</p>
            </motion.div>
          </AnimatePresence>
          {!bad && (
            <span className="absolute right-2 top-2 rounded-full bg-surface/80 px-2 py-0.5 text-[10px] tabular-nums">
              {index + 1} / {n}
            </span>
          )}
        </div>

        <div className="mt-2 flex shrink-0 items-center justify-between">
          {bad ? (
            // 나쁜 예: 이전·다음·멈춤 없이 아주 작은 점만 눌린다
            <span className="mx-auto flex gap-1">
              {SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  aria-label={`${i + 1}번 슬라이드`}
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setUser(i);
                  }}
                  className={cx("size-1.5 rounded-full", i === index ? "bg-muted" : "bg-surface-3")}
                />
              ))}
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "자동 넘김 시작" : "자동 넘김 멈춤"}
                className="grid size-7 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
              >
                <svg aria-hidden viewBox="0 0 16 16" className="size-3.5">
                  {paused ? (
                    <path d="M5 3.5v9l7-4.5z" fill="currentColor" />
                  ) : (
                    <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  )}
                </svg>
              </button>
              <span className="flex gap-1" aria-hidden>
                {SLIDES.map((s, i) => (
                  <span key={s.title} className={cx("h-1.5 rounded-full transition-all", i === index ? "w-4 bg-accent" : "w-1.5 bg-surface-3")} />
                ))}
              </span>
              <span className="flex gap-1">
                <ArrowBtn label="이전 슬라이드" onClick={() => go(-1)} flip />
                <ArrowBtn label="다음 슬라이드" onClick={() => go(1)} tap={tapping} />
              </span>
            </>
          )}
        </div>
      </section>
      <Tap show={tapping} target="[data-tap]" />
      <Hint>{bad ? "1.5초마다 넘어가고 멈출 수 없어요" : "멈춤 버튼, 이전·다음으로 직접 넘겨 보세요"}</Hint>
    </div>
  );
}

function ArrowBtn({ label, onClick, flip, tap }: { label: string; onClick: () => void; flip?: boolean; tap?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      data-tap={tap ? "" : undefined}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-md border border-line text-muted hover:bg-surface-2 hover:text-fg"
    >
      <svg aria-hidden viewBox="0 0 16 16" className={cx("size-3.5", flip && "rotate-180")}>
        <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}
