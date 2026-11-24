"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 모두 닫힘 → (탭) 1번 → 1번 열림 → (탭) 2번 → 1·2번 열림
const SCRIPT = [700, 250, 900, 250, 1300] as const;
const ITEMS = [
  { q: "배송은 얼마나 걸리나요?", a: "평일 오후 2시 전 주문은 당일 출고돼요. 보통 1~2일이면 받아요." },
  { q: "교환·반품은 어떻게 하나요?", a: "받은 날부터 7일 안에 주문 내역에서 신청할 수 있어요." },
  { q: "영수증을 다시 받을 수 있나요?", a: "주문 상세에서 언제든 다시 내려받을 수 있어요." },
];

export default function AccordionDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 4);
  const bad = variant === "bad";
  const id = useId();
  const [open, setOpen] = useState<number[]>([]);

  const autoOpen = step === null ? null : step >= 4 ? [0, 1] : step >= 2 ? [0] : [];
  const opened = autoOpen ?? open;
  const tapIndex = step === 1 ? 0 : step === 3 ? 1 : -1;

  const toggle = (i: number) => {
    if (bad) {
      // 나쁜 예: 하나를 열면 나머지는 모두 닫힌다
      setOpen((o) => (o.includes(i) ? [] : [i]));
    } else {
      setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
    }
  };

  return (
    <div className={cx("h-full overflow-hidden p-3", step === null && "pb-8")}>
      <h3 className="mb-2 text-sm font-semibold">자주 묻는 질문</h3>
      <ul className="divide-y divide-line rounded-xl border border-line">
        {ITEMS.map((it, i) => {
          const isOpen = opened.includes(i);
          const btnId = `${id}-b${i}`;
          const panelId = `${id}-p${i}`;
          const chevron = (
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className={cx("size-3.5 shrink-0 text-muted transition-transform", isOpen && "rotate-180")}
            >
              <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          );
          return (
            <li key={it.q}>
              <h4 className="text-xs font-medium">
                {bad ? (
                  // 나쁜 예: 제목줄이 아니라 작은 화살표만 눌린다
                  <span className="flex items-center justify-between px-3 py-2.5">
                    {it.q}
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-label={`${it.q} ${isOpen ? "접기" : "펼치기"}`}
                      onClick={() => toggle(i)}
                      className="grid size-5 place-items-center rounded"
                    >
                      {chevron}
                    </button>
                  </span>
                ) : (
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    data-tap={i === tapIndex ? "" : undefined}
                    onClick={() => toggle(i)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-surface-2"
                  >
                    {it.q}
                    {chevron}
                  </button>
                )}
              </h4>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="px-3 pb-2.5 text-xs text-muted">{it.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      <Tap show={tapIndex >= 0} target="[data-tap]" />
      <Hint>{bad ? "작은 화살표만 눌리고, 하나를 열면 다른 답이 닫혀요" : "질문을 눌러 답을 펼치고 접어 보세요"}</Hint>
    </div>
  );
}
