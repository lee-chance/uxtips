"use client";

import { AnimatePresence, motion, useAnimationControls, type PanInfo } from "motion/react";
import { useEffect, useState } from "react";
import { useDemoEnv, useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 대기 → 첫 줄을 누름 → 왼쪽으로 밀려 동작이 드러남 → 닫힘
const SCRIPT = [800, 300, 1700, 700] as const;

const MAILS = ["주간 회의 안건", "청구서 도착", "여행 일정 공유", "새 댓글 3개"];
const OPEN_X = -128;

export default function SwipeActionsDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [mails, setMails] = useState(MAILS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [removed, setRemoved] = useState<{ title: string; index: number } | null>(null);

  const remove = (title: string) => {
    setRemoved({ title, index: mails.indexOf(title) });
    setMails((m) => m.filter((x) => x !== title));
    setOpenId(null);
  };
  const undo = () => {
    if (!removed) return;
    setMails((m) => [...m.slice(0, removed.index), removed.title, ...m.slice(removed.index)]);
    setRemoved(null);
  };

  return (
    <div className="flex h-full flex-col">
      <AppBar title="받은 편지함" />
      <ul className="divide-y divide-line border-b border-line">
        <AnimatePresence initial={false}>
          {mails.map((m, i) => (
            <motion.li
              key={m}
              layout
              exit={{ height: 0, opacity: 0 }}
              className="relative overflow-hidden"
            >
              <Row
                title={m}
                bad={bad}
                open={step === null ? openId === m : i === 0 && step === 2}
                onOpenChange={(o) => setOpenId(o ? m : null)}
                onDelete={() => remove(m)}
                tapTarget={i === 0}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {step === null && mails.length < MAILS.length && (
        <div className="flex justify-center pt-3">
          <DemoButton
            size="sm"
            tone="ghost"
            onClick={() => {
              setMails(MAILS);
              setRemoved(null);
            }}
          >
            데모 되돌리기
          </DemoButton>
        </div>
      )}
      <Tap show={step === 1} target="[data-tap]" />

      {/* 좋은 예: 지운 뒤 되돌릴 기회를 준다 */}
      <div role="status" aria-live="polite" className="absolute inset-x-3 bottom-8 z-20">
        <AnimatePresence>
          {!bad && removed && step === null && (
            <Undo key={removed.title} title={removed.title} onUndo={undo} onTimeout={() => setRemoved(null)} />
          )}
        </AnimatePresence>
      </div>
      <Hint>
        {bad ? "끝까지 밀면 바로 지워지고, 되돌릴 수 없어요" : "왼쪽으로 밀거나 ··· 버튼을 눌러 보세요"}
      </Hint>
    </div>
  );
}

function Row({
  title,
  bad,
  open,
  onOpenChange,
  onDelete,
  tapTarget,
}: {
  title: string;
  bad: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  tapTarget: boolean;
}) {
  const { autoplay } = useDemoEnv();
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({ x: open ? OPEN_X : 0, transition: { type: "spring", duration: 0.35, bounce: 0.1 } });
  }, [open, controls]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // 나쁜 예: 끝까지 밀면 확인도 되돌리기도 없이 바로 지운다
    if (bad && info.offset.x < -150) {
      onDelete();
      return;
    }
    const next = info.offset.x < -48 || (open && info.offset.x < 20);
    onOpenChange(next);
    controls.start({ x: next ? OPEN_X : 0 });
  };

  return (
    <>
      <motion.div
        animate={controls}
        drag={autoplay ? false : "x"}
        dragConstraints={{ left: bad ? -260 : OPEN_X, right: 0 }}
        dragElastic={0.08}
        onDragEnd={onDragEnd}
        data-tap={tapTarget ? "" : undefined}
        tabIndex={bad && !autoplay ? 0 : undefined}
        onKeyDown={
          bad
            ? (e) => {
                if (e.key === "Delete" || e.key === "Backspace") onDelete();
              }
            : undefined
        }
        aria-label={bad ? `${title}. Delete 키를 누르면 바로 삭제` : undefined}
        className="relative z-10 flex touch-pan-y items-center gap-2.5 bg-surface px-3 py-2.5 text-sm"
      >
        <span aria-hidden className="size-7 shrink-0 rounded-full bg-surface-3" />
        <span className="flex-1 truncate">{title}</span>
        {/* 좋은 예: 밀기를 몰라도, 키보드로도 같은 동작에 닿는 버튼 */}
        {!bad && (
          <button
            type="button"
            aria-label={`${title} 동작 ${open ? "닫기" : "더 보기"}`}
            aria-expanded={open}
            onClick={() => onOpenChange(!open)}
            className="grid size-7 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-2"
          >
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
              <circle cx="3" cy="8" r="1.4" fill="currentColor" />
              <circle cx="8" cy="8" r="1.4" fill="currentColor" />
              <circle cx="13" cy="8" r="1.4" fill="currentColor" />
            </svg>
          </button>
        )}
      </motion.div>
      {/* 밀면 드러나는 동작 버튼. 줄 뒤에 두어 Tab 순서가 ··· 다음이 되게 한다 */}
      <div className="absolute inset-y-0 right-0 z-0 flex" aria-hidden={!open}>
        {!bad && (
          <button
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={() => onOpenChange(false)}
            className="w-16 bg-accent text-xs font-medium text-accent-fg"
          >
            보관
          </button>
        )}
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          onClick={onDelete}
          className={cx("bg-danger text-xs font-medium text-white dark:text-black", bad ? "w-32" : "w-16")}
        >
          삭제
        </button>
      </div>
    </>
  );
}

function Undo({ title, onUndo, onTimeout }: { title: string; onUndo: () => void; onTimeout: () => void }) {
  useEffect(() => {
    const t = setTimeout(onTimeout, 6000);
    return () => clearTimeout(t);
  }, [onTimeout]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-center justify-between gap-2 rounded-lg bg-fg px-3 py-2 text-sm text-bg shadow-lg"
    >
      <span className="truncate">&lsquo;{title}&rsquo; 삭제했어요</span>
      <button type="button" onClick={onUndo} className="shrink-0 rounded px-2 py-0.5 font-semibold text-accent-soft hover:bg-bg/10">
        되돌리기
      </button>
    </motion.div>
  );
}
