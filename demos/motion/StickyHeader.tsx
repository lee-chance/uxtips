"use client";

import { useLoopProgress, type DemoProps } from "@/components/demo/context";
import { cx, Hint } from "@/components/demo/kit";
import { keyframes, Row, ScrollBox, useScrollY } from "./shared";

const PATH = [
  [0, 0],
  [0.5, 220],
  [0.7, 220],
  [1, 0],
] as const;

const ITEMS = ["장보기 목록", "주간 회의 메모", "읽을 책", "운동 기록", "여행 준비물", "선물 아이디어", "영화 목록", "레시피 모음", "가계부", "공부 계획", "이사 체크리스트", "병원 예약", "택배 송장", "카페 추천", "생일 목록", "자동차 정비"];

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="size-4">
      <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m13.5 13.5 3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function StickyHeaderDemo({ variant = "good" }: DemoProps) {
  const auto = useLoopProgress(3400, 500, 0.5);
  const { ref, y, onScroll } = useScrollY();
  const bad = variant === "bad";
  const autoY = auto === null ? null : keyframes(auto, PATH);
  const scrolled = (autoY ?? y) > 4;

  return (
    <div className="flex h-full flex-col">
      {/* 헤더는 스크롤 영역 밖에 있어 항상 보인다 */}
      <header
        className={cx(
          "relative z-10 shrink-0 border-b bg-surface transition-shadow",
          scrolled ? "border-line shadow-[0_4px_12px_-6px_rgb(0_0_0/0.25)]" : "border-transparent",
        )}
      >
        {bad ? (
          // 나쁜 예: 로고 배너, 광고 띠, 검색창, 탭까지 전부 고정 — 화면의 절반 가까이를 차지한다
          <div>
            <div className="grid h-14 place-items-center bg-accent text-sm font-bold text-accent-fg @md:h-20">
              MEMO+ 프리미엄
            </div>
            <p className="bg-accent-soft px-3 py-1.5 text-[11px]">지금 가입하면 3개월 무료!</p>
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted">
              <SearchIcon /> 메모 검색
            </div>
            <div className="flex gap-3 px-3 pb-2 text-xs">
              <span className="font-semibold">전체</span>
              <span className="text-muted">즐겨찾기</span>
              <span className="text-muted">공유됨</span>
            </div>
          </div>
        ) : (
          <div className="flex h-11 items-center justify-between px-3">
            <h3 className="text-sm font-semibold">메모</h3>
            <button
              type="button"
              aria-label="메모 검색"
              className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
            >
              <SearchIcon />
            </button>
          </div>
        )}
      </header>
      <ScrollBox autoY={autoY} label="메모 목록" scrollRef={ref} onScroll={onScroll} className="min-h-0 flex-1">
        <ul>
          {ITEMS.map((t, i) => (
            <Row key={t} n={i} label={t} />
          ))}
        </ul>
        <div className="h-10" />
      </ScrollBox>
      <Hint>{bad ? "고정된 머리가 너무 커서 내용이 몇 줄 안 보여요" : "스크롤해도 제목과 검색은 위에 남아요"}</Hint>
    </div>
  );
}
