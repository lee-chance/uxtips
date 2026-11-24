"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, Hint, Scrim, Tap, useFocusTrap } from "@/components/demo/kit";

// 자동 재생: 대기 → 보관 누름 → 바로 사라지고 '되돌리기' 줄 → 되돌리기 누름 → 복구
const SCRIPT = [700, 300, 1200, 300, 800] as const;

const MAILS = ["주간 회의 안건", "청구서 도착 안내", "사진 공유했어요"];

export default function UndoDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const [archived, setArchived] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, confirm !== null, () => setConfirm(null));

  const gone = step === null ? archived : step === 2 || step === 3 ? [MAILS[0]] : [];

  const archive = (m: string) => (bad ? setConfirm(m) : setArchived((a) => [...a, m]));

  return (
    <div className="flex h-full flex-col">
      <AppBar title="받은 편지함" />
      <ul className="divide-y divide-line" aria-live="polite">
        <AnimatePresence initial={false}>
          {MAILS.map((m) =>
            gone.includes(m) ? (
              <motion.li
                key={`${m}-undo`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-surface-2 px-3 py-2.5 text-sm text-muted"
              >
                <span>보관했어요</span>
                <button
                  type="button"
                  onClick={() => setArchived((a) => a.filter((x) => x !== m))}
                  className="rounded px-2 py-0.5 font-semibold text-accent hover:bg-accent-soft"
                >
                  되돌리기
                </button>
              </motion.li>
            ) : (
              <motion.li
                key={m}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between px-3 py-2.5 text-sm"
              >
                <span>{m}</span>
                <DemoButton tone="secondary" size="sm" onClick={() => archive(m)} aria-label={`${m} 보관`}>
                  보관
                </DemoButton>
              </motion.li>
            ),
          )}
        </AnimatePresence>
      </ul>
      <Tap show={step === 1} target="li:first-child button" />
      <Tap show={step === 3} target="li:first-child button" />

      {/* 나쁜 예: 매번 확인창으로 묻는다 */}
      <AnimatePresence>
        {confirm && (
          <motion.div key="confirm" className="absolute inset-0 z-20" exit={{ opacity: 0 }}>
            <Scrim onClick={() => setConfirm(null)} />
            <motion.div
              ref={dialogRef}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="undo-bad-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute left-1/2 top-1/2 z-20 w-64 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-4 shadow-xl"
            >
              <p id="undo-bad-title" className="text-sm font-semibold">
                정말 보관하시겠습니까?
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <DemoButton tone="secondary" size="sm" onClick={() => setConfirm(null)}>
                  취소
                </DemoButton>
                <DemoButton
                  size="sm"
                  onClick={() => {
                    setArchived((a) => [...a, confirm]);
                    setConfirm(null);
                  }}
                >
                  확인
                </DemoButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Hint>{bad ? "매번 확인창이 흐름을 끊어요" : "보관한 뒤 되돌리기를 눌러 보세요"}</Hint>
    </div>
  );
}
