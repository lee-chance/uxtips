"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { DemoButton, Hint, Tap, cx } from "@/components/demo/kit";

// 자동 재생: 기본 설정만 → '고급 설정' 누름 → 펼침 → 접힘
const SCRIPT = [900, 300, 1900, 600] as const;

const ADVANCED = ["페이지 범위 지정", "여백 없이 인쇄", "암호로 보호", "주석 포함"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-muted">{label}</span>
      {children}
    </div>
  );
}

export default function ProgressiveDisclosureDemo({ variant = "good" }: DemoProps) {
  const bad = variant === "bad";
  const step = useScript(SCRIPT, 2);
  const [userOpen, setUserOpen] = useState(false);
  const [format, setFormat] = useState("PDF");
  const open = step === null ? userOpen : step === 2;
  const regionId = useId();

  const basic = (
    <>
      <Field label="형식">
        <div role="radiogroup" aria-label="형식" className="flex rounded-md border border-line p-0.5">
          {["PDF", "CSV"].map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={format === f}
              onClick={() => setFormat(f)}
              className={cx("rounded px-2 py-0.5", format === f && "bg-accent text-accent-fg")}
            >
              {f}
            </button>
          ))}
        </div>
      </Field>
      {step === null && (
        <Field label="파일 이름">
          <span className="rounded border border-line px-2 py-0.5">3분기_보고서</span>
        </Field>
      )}
    </>
  );

  const checks = (items: string[]) =>
    items.map((a) => (
      <label key={a} className="flex items-center gap-2 text-xs">
        <input type="checkbox" className="accent-[var(--accent)]" />
        {a}
      </label>
    ));

  return (
    <div className={cx("flex h-full flex-col p-3", step === null ? "pb-8" : "pb-3")}>
      <h2 className="mb-1.5 text-sm font-bold">내보내기</h2>
      <div className="min-h-0 flex-1 space-y-2 overflow-hidden">
        {basic}
        {bad ? (
          // 나쁜 예: 거의 안 쓰는 설정까지 한꺼번에 늘어놓아 정작 중요한 버튼이 밀려난다
          <div className="grid grid-cols-1 gap-1 @md:grid-cols-2">
            {checks([...ADVANCED, "색상 프로필 변환", "글꼴 포함", "메타데이터 제거", "해상도 300dpi", "흑백으로", "페이지 번호"])}
          </div>
        ) : (
          <>
            <button
              type="button"
              data-tap
              aria-expanded={open}
              aria-controls={regionId}
              onClick={() => setUserOpen((o) => !o)}
              className="flex items-center gap-1 text-xs font-medium text-accent"
            >
              <motion.span aria-hidden animate={{ rotate: open ? 90 : 0 }} className="inline-block">
                ›
              </motion.span>
              고급 설정 {open ? "접기" : `(${ADVANCED.length})`}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={regionId}
                  role="region"
                  aria-label="고급 설정"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 rounded-lg bg-surface-2 p-2">{checks(step === null ? ADVANCED : ADVANCED.slice(0, 2))}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
      <DemoButton size="sm" className="mt-2 self-end">
        내보내기
      </DemoButton>
      <Tap show={step === 1} target="[data-tap]" />
      <Hint>{bad ? "설정 10개가 한꺼번에 보여 무엇이 중요한지 모르겠어요" : "자주 쓰는 것만 먼저, 나머지는 '고급 설정'에"}</Hint>
    </div>
  );
}
