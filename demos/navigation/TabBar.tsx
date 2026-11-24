"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, FakeList, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 홈 → (탭) 검색 → (탭) 내 정보 → 처음
const SCRIPT = [900, 250, 900, 250, 900, 250] as const;
const AUTO_ORDER = [0, 1, 3];

type Item = { label: string; icon: string };
// 24x24 단순 아이콘 경로
const ICONS = {
  home: "M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm5 12 4 4",
  heart: "M12 20s-7-4.4-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.6 12 20 12 20z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0",
  bag: "M6 8h12l-1 12H7zM9 8a3 3 0 0 1 6 0",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1 2H5zM10 20h4",
  gear: "M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM12 3v3M12 18v3M3 12h3M18 12h3",
};
const GOOD: Item[] = [
  { label: "홈", icon: ICONS.home },
  { label: "검색", icon: ICONS.search },
  { label: "찜", icon: ICONS.heart },
  { label: "내 정보", icon: ICONS.user },
];
const BAD: Item[] = [
  { label: "홈", icon: ICONS.home },
  { label: "검색", icon: ICONS.search },
  { label: "찜", icon: ICONS.heart },
  { label: "장바구니", icon: ICONS.bag },
  { label: "알림", icon: ICONS.bell },
  { label: "설정", icon: ICONS.gear },
  { label: "내 정보", icon: ICONS.user },
];

export default function TabBarDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const items = bad ? BAD : GOOD;
  const [user, setUser] = useState(0);

  const autoIdx = step === null ? 0 : Math.floor(step / 2) % AUTO_ORDER.length;
  const current = step === null ? user : AUTO_ORDER[autoIdx];
  const tapping = step !== null && step % 2 === 1;
  const next = AUTO_ORDER[(autoIdx + 1) % AUTO_ORDER.length];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <p className="px-3 pt-3 text-sm font-semibold">{items[current].label}</p>
        <motion.div key={current} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <FakeList rows={3} />
        </motion.div>
      </div>
      <nav aria-label="주 메뉴" className={cx("shrink-0 border-t border-line bg-surface", step === null && "mb-6")}>
        <ul className="flex">
          {items.map((it, i) => (
            <li key={it.label} className="flex-1">
              <button
                type="button"
                aria-current={i === current ? "page" : undefined}
                aria-label={bad ? it.label : undefined}
                data-tap={i === next ? "" : undefined}
                onClick={() => setUser(i)}
                className={cx(
                  "flex w-full flex-col items-center gap-0.5 py-1.5 text-[10px]",
                  i === current ? "text-accent" : "text-muted hover:text-fg",
                )}
              >
                <span
                  className={cx(
                    "grid place-items-center rounded-full",
                    bad ? "h-5 w-6" : "h-6 w-12",
                    i === current && !bad && "bg-accent-soft",
                  )}
                >
                  <svg aria-hidden viewBox="0 0 24 24" className={bad ? "size-3.5" : "size-[18px]"}>
                    <path
                      d={it.icon}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {!bad && <span className={i === current ? "font-semibold" : undefined}>{it.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <Tap show={tapping} target="[data-tap]" />
      <Hint>{bad ? "아이콘 7개, 이름이 없어 무엇인지 알기 어려워요" : "아래 탭으로 주요 화면을 오가요"}</Hint>
    </div>
  );
}
