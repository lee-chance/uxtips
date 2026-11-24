"use client";

import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 빈 별 → 넷째 별 누름 → 4점으로 채워짐
const SCRIPT = [900, 250, 1700, 400] as const;
const WORDS = ["", "별로예요", "그저 그래요", "괜찮아요", "좋아요", "최고예요"];

function Star({ filled, size = "size-8" }: { filled: boolean; size?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cx(size, filled ? "text-[#f5a524]" : "text-surface-3")} aria-hidden>
      <path
        d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function RatingDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const name = useId();
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(0);

  if (bad && step === null) {
    // 나쁜 예: div 별. 마우스로만 되고, 지금 몇 점인지 글자로 알려 주지 않는다
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 pb-8">
        <p className="text-sm font-medium">이 숙소는 어땠나요?</p>
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} onMouseEnter={() => setHover(n)} onClick={() => setValue(n)} className="cursor-pointer">
              <Star filled={n <= (hover || value)} size="size-4" />
            </div>
          ))}
        </div>
        <Hint>작은 별이 마우스로만 눌리고, 키보드로는 고를 수 없어요</Hint>
      </div>
    );
  }

  const current = step === null ? value : step >= 2 ? 4 : 0;
  const shown = step === null ? hover || value : current;

  return (
    <div className={cx("flex h-full flex-col items-center justify-center gap-2", step === null ? "pb-8" : "pb-3")}>
      <fieldset className="flex flex-col items-center gap-1.5">
        <legend className="mb-1 text-center text-sm font-medium">이 숙소는 어땠나요?</legend>
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              data-tap={n === 4 ? "" : undefined}
              onMouseEnter={() => step === null && setHover(n)}
              className="cursor-pointer rounded-md p-0.5 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="radio"
                name={name}
                value={n}
                checked={current === n}
                onChange={() => setValue(n)}
                className="sr-only"
              />
              <span className="sr-only">{n}점</span>
              <Star filled={n <= shown} />
            </label>
          ))}
        </div>
      </fieldset>
      <p className="h-5 text-sm text-muted" aria-live="polite">
        {current ? `${current}점 · ${WORDS[current]}` : "별을 눌러 점수를 주세요"}
      </p>
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>Tab으로 들어와 ←/→ 키로도 점수를 바꿀 수 있어요</Hint>
    </div>
  );
}
