"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useLoopProgress, type DemoProps } from "@/components/demo/context";
import { Hint } from "@/components/demo/kit";
import { keyframes, Row, ScrollBox } from "./shared";

const HEADER = 44;
// 자동 재생: 아래로(헤더 숨음) → 멈춤 → 조금 위로(헤더 다시 나옴) → 맨 위로
const PATH = [
  [0, 0],
  [0.4, 240],
  [0.55, 240],
  [0.7, 170],
  [0.82, 170],
  [1, 0],
] as const;

const ITEMS = ["오늘의 추천", "새로 나온 음반", "주말 공연", "동네 맛집", "가을 캠핑", "책 리뷰", "전시 소식", "영화 개봉작", "운동 루틴", "레시피", "여행 사진", "동네 산책길", "봄 꽃 축제", "재즈 바", "북카페", "야시장"];

export default function HideOnScrollDemo({ variant = "good" }: DemoProps) {
  const auto = useLoopProgress(4000, 400, 0.3);
  const bad = variant === "bad";
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef(0);
  const [hidden, setHidden] = useState(false);

  const onScroll = () => {
    const y = ref.current?.scrollTop ?? 0;
    const d = y - last.current;
    last.current = y;
    if (y < HEADER) return setHidden(false);
    if (bad) {
      // 나쁜 예: 한번 숨으면 맨 위에 닿을 때까지 돌아오지 않는다
      if (d > 2) setHidden(true);
      return;
    }
    if (d > 4) setHidden(true);
    else if (d < -4) setHidden(false); // 조금만 올려도 다시 나타난다
  };

  const autoY = auto === null ? null : keyframes(auto, PATH);
  const isHidden = auto === null ? hidden : (autoY ?? 0) > HEADER && auto < 0.56;

  return (
    <div className="relative h-full">
      <motion.header
        className="absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-between border-b border-line bg-surface/95 px-3 backdrop-blur"
        initial={false}
        animate={{ y: isHidden ? -HEADER - 2 : 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <h3 className="text-sm font-semibold">둘러보기</h3>
        <span className="text-xs text-accent">필터</span>
      </motion.header>
      <ScrollBox autoY={autoY} label="둘러보기 목록" scrollRef={ref} onScroll={onScroll} className="h-full">
        <div style={{ height: HEADER }} aria-hidden />
        <ul>
          {ITEMS.map((t, i) => (
            <Row key={t} n={i} label={t} />
          ))}
        </ul>
        <div className="h-10" />
      </ScrollBox>
      <Hint>
        {bad ? "숨은 막대를 다시 보려면 맨 위까지 올라가야 해요" : "내리면 숨고, 살짝만 올려도 다시 나와요"}
      </Hint>
    </div>
  );
}
