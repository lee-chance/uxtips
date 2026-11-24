"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * 데모 하나를 감싸는 실행 환경.
 * - autoplay: 카드 미리보기. 사용자 조작 없이 타임라인 스크립트대로 돈다.
 * - playing: 화면 안에 있을 때만 true (IntersectionObserver)
 * - reduced: prefers-reduced-motion. autoplay면 대표 프레임(poster)에서 멈춘다.
 */
export interface DemoEnv {
  autoplay: boolean;
  playing: boolean;
  reduced: boolean;
}

const DemoContext = createContext<DemoEnv>({
  autoplay: false,
  playing: true,
  reduced: false,
});

export const DemoProvider = DemoContext.Provider;

export function useDemoEnv() {
  return useContext(DemoContext);
}

export type Variant = "good" | "bad";

export interface DemoProps {
  /** 좋은 예 / 나쁜 예 */
  variant?: Variant;
}

/**
 * 자동 재생 타임라인.
 * script: 단계별 머무는 시간(ms). 모듈 최상단 상수로 선언한다(배열 정체성 유지).
 * poster: reduced-motion일 때 보여 줄 대표 단계.
 *
 * 반환값: autoplay가 아니면 null(= 사용자가 직접 조작), autoplay면 현재 단계 번호.
 *
 * 사용 예:
 *   const SCRIPT = [800, 1800, 600];          // 대기 → 열림 → 닫힘
 *   const step = useScript(SCRIPT, 1);
 *   const open = step === null ? userOpen : step === 1;
 */
export function useScript(script: readonly number[], poster = 0): number | null {
  const { autoplay, playing, reduced } = useDemoEnv();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!autoplay || reduced || !playing) return;
    const t = window.setTimeout(
      () => setStep((s) => (s + 1) % script.length),
      script[step],
    );
    return () => window.clearTimeout(t);
  }, [autoplay, reduced, playing, step, script]);

  if (!autoplay) return null;
  return reduced ? poster : step;
}

/**
 * 자동 재생 중 연속 값(0→1)이 필요할 때. 진행률 바 등.
 * durationMs 동안 0에서 1로 가고 holdMs 머문 뒤 반복한다.
 * autoplay가 아니면 null.
 */
export function useLoopProgress(
  durationMs: number,
  holdMs = 600,
  poster = 0.6,
): number | null {
  const { autoplay, playing, reduced } = useDemoEnv();
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!autoplay || reduced || !playing) return;
    let raf = 0;
    let start = performance.now() - t * durationMs;
    const total = durationMs + holdMs;
    const tick = (now: number) => {
      let el = now - start;
      if (el > total) {
        start = now;
        el = 0;
      }
      setT(Math.min(1, el / durationMs));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // t는 재개 위치로만 쓰므로 의존성에서 뺀다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, reduced, playing, durationMs, holdMs]);

  if (!autoplay) return null;
  return reduced ? poster : t;
}
