"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, cx, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 대기 → 누름 → 바로 반영(서버 저장 중) → 서버 확인
const SCRIPT = [700, 250, 1000, 1200] as const;
const BASE = 12;

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OptimisticUIDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const bad = variant === "bad";
  const failId = useId();
  const [liked, setLiked] = useState(false); // 화면에 보이는 값(낙관적)
  const [server, setServer] = useState(false); // 서버에 실제 저장된 값
  const [pending, setPending] = useState(false);
  const [fail, setFail] = useState(false);
  const [message, setMessage] = useState("");

  const toggle = () => {
    if (pending) return;
    const next = !liked;
    const willFail = bad || fail; // 나쁜 예: 서버가 항상 실패한다
    setLiked(next); // 서버 응답을 기다리지 않고 바로 바꾼다
    setPending(true);
    setMessage("");
    setTimeout(() => {
      setPending(false);
      if (willFail) {
        if (!bad) {
          setLiked(!next); // 좋은 예: 실패하면 되돌리고 알린다
          setMessage("좋아요를 반영하지 못했어요. 다시 시도해 주세요.");
        }
        // 나쁜 예: 되돌리지도 알리지도 않는다 → 화면과 서버가 어긋난다
      } else {
        setServer(next);
      }
    }, 1000);
  };

  const isLiked = step === null ? liked : step >= 2;
  const isPending = step === null ? pending : step === 2;
  const count = BASE + (isLiked ? 1 : 0);

  return (
    <div className="flex h-full flex-col">
      <AppBar title="게시물" />
      <div className="m-3 rounded-xl border border-line p-3">
        <div className="h-16 rounded-lg bg-accent-soft @md:h-28" aria-hidden />
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={isLiked}
            className={cx(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors",
              isLiked ? "text-danger" : "text-muted hover:text-fg",
            )}
          >
            <motion.span key={String(isLiked)} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
              <Heart filled={isLiked} />
            </motion.span>
            <span className="sr-only">좋아요 </span>
            <span className="tabular-nums">{count}</span>
            <span className="sr-only">개</span>
          </button>
          <AnimatePresence>
            {isPending && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-muted"
              >
                저장 중…
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {step === null && (
        <div className="space-y-1.5 px-4 text-[11px] text-muted">
          <p>서버에 저장된 값: {server ? "좋아요 누름" : "안 누름"}</p>
          {bad ? (
            <p>이 예시에서는 서버가 항상 실패해요.</p>
          ) : (
            <label htmlFor={failId} className="flex items-center gap-1.5">
              <input id={failId} type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} />
              서버 실패 흉내 내기
            </label>
          )}
        </div>
      )}
      <p role="status" className="mx-4 mt-2 text-xs text-danger">
        {message}
      </p>
      <Tap show={step === 1} x="30px" y="calc(40px + 12px + 12px + 64px + 22px)" />
      <Hint>{bad ? "실패해도 화면은 ‘좋아요’ 그대로예요" : "하트를 눌러 보고, 실패도 흉내 내 보세요"}</Hint>
    </div>
  );
}
