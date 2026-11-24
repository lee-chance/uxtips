"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { demos } from "@/demos";
import { DemoProvider } from "./context";
import { Stage } from "./kit";

/**
 * 홈 카드·짝 비교용 자동 재생 미리보기.
 * 상세 데모와 같은 컴포넌트를 autoplay 모드로 그린다.
 * 화면 밖이면 일시정지, reduced-motion이면 대표 프레임에서 정지.
 * 미리보기는 조작 대상이 아니므로 inert + aria-hidden.
 */
export function AutoplayPreview({ slug, className }: { slug: string; className?: string }) {
  const Demo = demos[slug];
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden inert>
      <DemoProvider value={{ autoplay: true, playing: visible, reduced }}>
        <Stage>{Demo ? <Demo variant="good" /> : <Missing />}</Stage>
      </DemoProvider>
    </div>
  );
}

function Missing() {
  return (
    <div className="grid h-full place-items-center text-xs text-muted">데모 준비 중</div>
  );
}
