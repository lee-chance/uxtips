"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, DemoButton, FakeList, Hint, Tap } from "@/components/demo/kit";

// 자동 재생: 대기 → 누름 → 토스트 보임 → 사라짐
const SCRIPT = [900, 300, 1900, 700] as const;

export default function ToastDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2);
  const [count, setCount] = useState(0); // 사용자가 띄운 횟수(=토스트 key)
  const [shown, setShown] = useState(false);
  const bad = variant === "bad";

  // 사용자가 띄운 토스트는 좋은 예 3초, 나쁜 예 1.2초 뒤 사라진다
  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setShown(false), bad ? 1200 : 3000);
    return () => clearTimeout(t);
  }, [shown, count, bad]);

  const visible = step === null ? shown : step === 2;
  const fire = () => {
    setCount((c) => c + 1);
    setShown(true);
  };

  return (
    <div className="flex h-full flex-col">
      <AppBar title="메모" />
      <FakeList rows={2} />
      <div className="flex flex-1 items-center justify-center pb-12">
        <DemoButton data-tap onClick={fire}>{bad ? "결제하기" : "저장"}</DemoButton>
      </div>
      <Tap show={step === 1} target="[data-tap]" />

      {/* 스크린리더가 읽도록 role=status 영역은 항상 존재하게 둔다 */}
      <div role="status" aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4">
        <AnimatePresence>
          {visible && (
            <motion.div
              key={count}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
              className={
                bad
                  ? "rounded-full bg-danger px-4 py-2 text-sm text-white shadow-lg dark:text-black"
                  : "rounded-full bg-fg px-4 py-2 text-sm text-bg shadow-lg"
              }
            >
              {bad ? "결제에 실패했습니다. 카드 정보를 확인…" : "저장했어요"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Hint>버튼을 눌러 보세요</Hint>
    </div>
  );
}
