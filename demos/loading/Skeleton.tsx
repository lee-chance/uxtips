"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { AppBar, cx, DemoButton, Hint } from "@/components/demo/kit";

// 자동 재생: 스켈레톤 → 실제 콘텐츠
const SCRIPT = [1700, 1500] as const;

const POSTS = [
  { name: "김하늘", time: "3분 전", text: "회사 앞 국숫집 오늘 처음 가 봤는데 국물이 진하다." },
  { name: "이도윤", time: "12분 전", text: "주말 등산 사진 올려요. 단풍이 벌써 들었네요." },
];

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cx("relative overflow-hidden rounded bg-surface-3", className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/50 to-transparent motion-reduce:hidden dark:via-white/10" />
    </div>
  );
}

/** 실제 콘텐츠와 같은 자리·같은 크기로 그린 스켈레톤 */
function GoodSkeleton() {
  return (
    <div className="space-y-4">
      {POSTS.map((p) => (
        <div key={p.name} className="flex gap-2.5">
          <Shimmer className="size-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5 pt-0.5">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-16 w-full rounded-lg @md:h-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 나쁜 예: 실제 레이아웃과 다른 모양. 로딩이 끝나면 화면이 튄다 */
function BadSkeleton() {
  return (
    <div className="space-y-3">
      <Shimmer className="h-28 w-full rounded-lg" />
      <Shimmer className="mx-auto h-3 w-2/3" />
      <Shimmer className="mx-auto h-3 w-1/2" />
      <Shimmer className="mx-auto h-3 w-3/4" />
    </div>
  );
}

function Content() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {POSTS.map((p, i) => (
        <article key={p.name} className="flex gap-2.5">
          <div className={cx("size-8 shrink-0 rounded-full", i ? "bg-success/60" : "bg-accent/70")} aria-hidden />
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="text-xs leading-3">
              <strong className="font-semibold">{p.name}</strong>{" "}
              <span className="text-muted">{p.time}</span>
            </p>
            <p className="truncate text-xs leading-3">{p.text}</p>
            <div className={cx("h-16 rounded-lg @md:h-24", i ? "bg-success-soft" : "bg-accent-soft")} aria-hidden />
          </div>
        </article>
      ))}
    </motion.div>
  );
}

export default function SkeletonDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 0);
  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState(0);
  const bad = variant === "bad";

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, [loading, run]);

  const isLoading = step === null ? loading : step === 0;

  return (
    <div className="flex h-full flex-col">
      <AppBar
        title="피드"
        right={
          step === null && (
            <DemoButton
              size="sm"
              tone="secondary"
              aria-disabled={loading}
              className={loading ? "opacity-50" : undefined}
              onClick={() => {
                if (loading) return;
                setLoading(true);
                setRun((r) => r + 1);
              }}
            >
              다시 불러오기
            </DemoButton>
          )
        }
      />
      <div aria-busy={isLoading} className="flex-1 overflow-hidden p-3">
        <span role="status" className="sr-only">
          {isLoading ? "피드를 불러오는 중" : "피드를 불러왔어요"}
        </span>
        {isLoading ? bad ? <BadSkeleton /> : <GoodSkeleton /> : <Content />}
      </div>
      <Hint>&lsquo;다시 불러오기&rsquo;로 로딩을 다시 볼 수 있어요</Hint>
    </div>
  );
}
