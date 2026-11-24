"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { DemoButton, FakeList, Hint, Scrim, Tap, cx, useFocusTrap } from "@/components/demo/kit";

// 자동 재생: 대기 → '공유' 누름 → 공유 시트 → 닫힘
const SCRIPT = [800, 300, 2100, 700] as const;

const TARGETS = [
  { label: "메시지", tone: "bg-success-soft text-success" },
  { label: "이메일", tone: "bg-accent-soft text-accent" },
  { label: "노트", tone: "bg-surface-3 text-fg" },
  { label: "더 보기", tone: "bg-surface-2 text-muted" },
];
const BAD_ICONS = Array.from({ length: 12 }, (_, i) => `앱 ${i + 1}`);

export default function ShareSheetDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const open = step === null ? userOpen : step === 2;
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = () => setUserOpen(false);
  useFocusTrap(ref, open, close);

  const done = (text: string) => {
    setMsg(text);
    close();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="m-3 mb-0 rounded-xl border border-line p-3">
        <p className="text-sm font-semibold">주말 제주 여행 코스</p>
        <p className="text-xs text-muted">3일 · 장소 12곳</p>
        <div className="mt-2 flex items-center justify-between">
          <span role="status" className="text-xs text-success">
            {step === null ? msg : ""}
          </span>
          <DemoButton data-tap size="sm" tone="secondary" onClick={() => setUserOpen(true)}>
            공유
          </DemoButton>
        </div>
      </div>
      <FakeList rows={2} />
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>{bad ? "작은 아이콘 12개, 이름도 '링크 복사'도 없어요" : "공유 버튼을 눌러 보세요"}</Hint>

      <AnimatePresence>
        {open && (
          <>
            <Scrim onClick={close} />
            {bad ? (
              // 나쁜 예: 가운데 팝업에 이름 없는 작은 아이콘만 잔뜩, 링크 복사는 없다
              <motion.div
                ref={ref}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 top-1/2 z-20 w-56 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface p-3 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <h2 id={titleId} className="text-xs font-bold">
                    SNS 공유
                  </h2>
                  <button type="button" onClick={close} aria-label="닫기" className="text-[10px] text-muted">
                    ×
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-6 gap-1.5">
                  {BAD_ICONS.map((a, i) => (
                    <button
                      key={a}
                      type="button"
                      aria-label={a}
                      onClick={() => done(`${a}(으)로 공유했어요`)}
                      className={cx("size-5 rounded", ["bg-accent", "bg-success", "bg-danger", "bg-muted"][i % 4])}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                ref={ref}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.12 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 1 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 70 || info.velocity.y > 500) close();
                }}
                className="absolute inset-x-0 bottom-0 z-20 mx-auto max-w-md rounded-t-2xl bg-surface px-4 pb-3 pt-2 shadow-2xl"
              >
                <div aria-hidden className="mx-auto mb-2 h-1 w-9 rounded-full bg-surface-3" />
                <div className="flex items-center gap-2 border-b border-line pb-2">
                  <span aria-hidden className="size-8 shrink-0 rounded-lg bg-accent-soft" />
                  <div className="min-w-0 flex-1">
                    <h2 id={titleId} className="truncate text-xs font-bold">
                      주말 제주 여행 코스
                    </h2>
                    <p className="truncate text-[11px] text-muted">trip.example/jeju</p>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="공유 닫기"
                    className="grid size-7 place-items-center rounded-full bg-surface-2 text-xs"
                  >
                    ×
                  </button>
                </div>
                <ul className="flex justify-around py-2" aria-label="보낼 곳">
                  {TARGETS.map((t) => (
                    <li key={t.label}>
                      <button
                        type="button"
                        onClick={() => done(`${t.label}(으)로 보냈어요`)}
                        className="flex flex-col items-center gap-1 text-[11px]"
                      >
                        <span aria-hidden className={cx("grid size-9 place-items-center rounded-xl text-xs font-bold", t.tone)}>
                          {t.label[0]}
                        </span>
                        {t.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => done("링크를 복사했어요")}
                  className="flex w-full items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-xs font-medium"
                >
                  링크 복사 <span aria-hidden>⧉</span>
                </button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
