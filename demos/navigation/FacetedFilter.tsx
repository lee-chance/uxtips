"use client";

import { useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 전체 → '성수' 고름 → '주차' 더함 → 지움
const SCRIPT = [900, 1300, 1500, 700] as const;

type Facet = "area" | "feature";
const PLACES = [
  { name: "성수 로스터리", area: "성수", feature: ["주차", "반려동물"] },
  { name: "서울숲 베이커리", area: "성수", feature: ["반려동물"] },
  { name: "성수 브루어리", area: "성수", feature: ["주차"] },
  { name: "연남 티하우스", area: "연남", feature: ["24시"] },
  { name: "연남 책방카페", area: "연남", feature: ["반려동물"] },
  { name: "을지로 다방", area: "을지로", feature: [] as string[] },
];
const FACETS: { id: Facet; label: string; options: string[] }[] = [
  { id: "area", label: "지역", options: ["성수", "연남", "을지로"] },
  { id: "feature", label: "편의", options: ["주차", "반려동물", "24시"] },
];

type Sel = { area: string[]; feature: string[] };
const EMPTY: Sel = { area: [], feature: [] };
const AUTO: Sel[] = [EMPTY, { area: ["성수"], feature: [] }, { area: ["성수"], feature: ["주차"] }, EMPTY];

function match(p: (typeof PLACES)[number], s: Sel) {
  const areaOk = s.area.length === 0 || s.area.includes(p.area);
  const featOk = s.feature.every((f) => p.feature.includes(f));
  return areaOk && featOk;
}

export default function FacetedFilterDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [user, setUser] = useState<Sel>(EMPTY);
  const sel = step === null ? user : AUTO[step];
  const results = PLACES.filter((p) => match(p, sel));
  const applied = [...sel.area, ...sel.feature];

  const toggle = (f: Facet, o: string) =>
    setUser((s) => {
      // 나쁜 예: 하나를 고르면 다른 선택이 모두 풀린다
      if (bad) return { ...EMPTY, [f]: s[f].includes(o) ? [] : [o] };
      return { ...s, [f]: s[f].includes(o) ? s[f].filter((x) => x !== o) : [...s[f], o] };
    });

  // 이 옵션을 더 골랐을 때 남을 결과 수(지역은 '또는', 편의는 '그리고')
  const countIf = (f: Facet, o: string) => {
    const next: Sel = { ...sel, [f]: [...sel[f], o] };
    return PLACES.filter((p) => match(p, next)).length;
  };

  return (
    <div className="flex h-full flex-col gap-2 p-3 @md:flex-row @md:gap-4">
      <div className="space-y-2 @md:w-44 @md:shrink-0" role="group" aria-label="필터">
        {FACETS.map((f) => (
          <fieldset key={f.id}>
            <legend className="mb-1 text-[11px] font-bold text-muted">{f.label}</legend>
            <div className="flex flex-wrap gap-1">
              {f.options.map((o) => {
                const on = sel[f.id].includes(o);
                const n = countIf(f.id, o);
                const zero = !on && n === 0;
                return (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={on}
                    data-tap={o === "성수" && step === 0 ? "" : o === "주차" && step === 1 ? "" : undefined}
                    onClick={() => toggle(f.id, o)}
                    className={cx(
                      "rounded-full border px-2 py-0.5 text-[11px]",
                      on ? "border-accent bg-accent-soft font-semibold text-accent" : "border-line hover:bg-surface-2",
                      !bad && zero && "border-dashed text-muted",
                    )}
                  >
                    {o}
                    {/* 좋은 예: 고르면 몇 곳이 남는지 미리 보여 준다 */}
                    {!bad && <span className="ml-1 tabular-nums text-muted">{on ? results.length : n}</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {!bad && (
          <div className="flex min-h-6 flex-wrap items-center gap-1 text-[11px]">
            {applied.length === 0 ? (
              <span className="text-muted">적용한 필터 없음</span>
            ) : (
              <>
                {applied.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggle(sel.area.includes(a) ? "area" : "feature", a)}
                    aria-label={`${a} 필터 해제`}
                    className="rounded-full bg-fg px-2 py-0.5 text-bg"
                  >
                    {a} <span aria-hidden>×</span>
                  </button>
                ))}
                <button type="button" onClick={() => setUser(EMPTY)} className="px-1 text-accent underline">
                  모두 지우기
                </button>
              </>
            )}
          </div>
        )}
        <p role="status" className="mt-1 text-xs font-semibold">
          {bad ? "검색 결과" : `${results.length}곳`}
        </p>
        {step !== null ? (
          // 카드 미리보기: 목록 대신 한 줄 요약
          <p className="truncate text-[11px] text-muted">{results.map((p) => p.name).join(" · ")}</p>
        ) : (
        <ul className="mt-1 min-h-0 flex-1 space-y-1 overflow-hidden">
          {results.length === 0 ? (
            <li className="text-xs text-muted">조건에 맞는 곳이 없어요</li>
          ) : (
            results.map((p) => (
              <li key={p.name} className="truncate rounded-md bg-surface-2 px-2 py-1 text-xs">
                {p.name}
              </li>
            ))
          )}
        </ul>
        )}
      </div>
      <Tap show={step === 0} target="[data-tap]" />
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>{bad ? "하나를 고르면 앞의 선택이 풀리고, 몇 곳이 남을지 모릅니다" : "옆 숫자는 고르면 남을 곳의 수예요"}</Hint>
    </div>
  );
}
