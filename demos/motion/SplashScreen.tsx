"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, DemoButton, Hint } from "@/components/demo/kit";

// 자동 재생: 런치 화면 → 첫 화면
const SCRIPT = [1300, 2100] as const;

const TABS = ["홈", "검색", "저장", "MY"];

function Shell({ ready }: { ready: boolean }) {
  // 좋은 예: 런치 화면이 첫 화면의 뼈대(상단 막대·하단 탭)와 똑같아서, 준비되면 내용만 채워진다
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 shrink-0 items-center border-b border-line bg-surface-2 px-3 text-sm font-semibold">
        <AnimatePresence>
          {ready && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              오늘의 레시피
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-3">
        <AnimatePresence>
          {ready && (
            <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {["김치볶음밥", "된장찌개", "버섯 파스타"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 rounded-lg border border-line p-2 text-xs">
                  <span aria-hidden className="size-8 shrink-0 rounded-md bg-accent-soft" />
                  {t}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <div className="grid h-10 shrink-0 grid-cols-4 border-t border-line text-[10px] text-muted">
        {TABS.map((t) => (
          <span key={t} className="grid place-items-center">
            {/* 런치 화면에는 글자 없이 모양만 둔다 */}
            {ready ? t : <span aria-hidden className="size-3 rounded-full bg-surface-3" />}
          </span>
        ))}
      </div>
    </div>
  );
}

function BrandSplash({ left }: { left: number }) {
  // 나쁜 예: 첫 화면과 전혀 다른 브랜드 광고 화면. 몇 초씩 붙잡아 둔다
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-accent text-accent-fg">
      <div className="grid size-14 place-items-center rounded-2xl bg-accent-fg/20 text-xl font-black">R</div>
      <p className="text-lg font-black tracking-tight">RECIPE+</p>
      <p className="text-xs opacity-80">세상의 모든 맛을 한 곳에</p>
      <p className="absolute right-3 top-3 rounded-full bg-black/25 px-2 py-0.5 text-[11px]">광고 · {left}초</p>
    </div>
  );
}

export default function SplashScreenDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 0);
  const bad = variant === "bad";
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const [left, setLeft] = useState(4);

  useEffect(() => {
    if (ready) return;
    if (!bad) {
      const t = setTimeout(() => setReady(true), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (left <= 1) setReady(true);
      else setLeft((l) => l - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [ready, bad, left, run]);

  const isReady = step === null ? ready : step === 1;

  return (
    <div className="relative h-full">
      <div className={cx("relative h-full", step === null && "pb-7")}>
      {bad && isReady ? (
        // 나쁜 예: 광고가 끝나면 전혀 다른 배치로 툭 바뀐다
        <div className="flex h-full flex-col p-3">
          <p className="text-sm font-bold">RECIPE+ 홈</p>
          <div className="mt-2 grid flex-1 grid-cols-2 gap-2" aria-hidden>
            <div className="rounded-lg bg-surface-2" />
            <div className="rounded-lg bg-surface-2" />
          </div>
        </div>
      ) : (
        <Shell ready={isReady} />
      )}
      {bad && !isReady && <BrandSplash left={left} />}
      </div>
      <span role="status" className="sr-only">
        {step === null ? (isReady ? "앱이 준비됐어요" : "앱을 여는 중") : ""}
      </span>
      {/* 키보드 사용자가 처음부터 닿을 수 있게 버튼은 항상 두고, 여는 중에는 누를 수 없음만 알린다 */}
      {step === null && (
        <DemoButton
          size="sm"
          tone="secondary"
          aria-disabled={!isReady}
          className={cx("absolute right-2 top-1.5 z-20", !isReady && "opacity-50")}
          onClick={() => {
            if (!isReady) return;
            setReady(false);
            setLeft(4);
            setRun((r) => r + 1);
          }}
        >
          앱 다시 열기
        </DemoButton>
      )}
      <Hint>{bad ? "4초짜리 광고 뒤에 전혀 다른 화면이 나와요" : "런치 화면이 첫 화면의 뼈대와 같아 바로 이어져요"}</Hint>
    </div>
  );
}
