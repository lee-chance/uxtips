"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { cx, Hint } from "@/components/demo/kit";

const CITIES = ["제주시", "제주 애월", "제주 서귀포", "제천", "부산", "부천", "서울", "속초", "수원", "전주"];

// 자동 재생: 빈 칸 → '제' → '제주' + 목록 → 둘째 항목 강조 → 고름
const SCRIPT = [700, 450, 700, 600, 1100] as const;
const AUTO_TEXT = ["", "제", "제주", "제주", "제주 애월"];

function Highlight({ text, q }: { text: string; q: string }) {
  const i = q ? text.indexOf(q) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-semibold text-accent">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export default function AutocompleteDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 3);
  const bad = variant === "bad";
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const id = useId();
  const listId = `${id}-list`;

  const text = step === null ? value : AUTO_TEXT[step];
  const q = text.trim();
  const matches = q ? CITIES.filter((c) => c.includes(q)).slice(0, 5) : [];
  const isOpen = step === null ? open && matches.length > 0 && !bad : step === 2 || step === 3;
  const act = step === null ? active : step === 3 ? 1 : -1;

  const choose = (c: string) => {
    setValue(c);
    setOpen(false);
    setActive(-1);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (bad) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && isOpen && matches[active]) {
      e.preventDefault();
      choose(matches[active]);
    } else if (e.key === "Escape") {
      if (isOpen) setOpen(false);
      else setValue("");
    }
  };

  return (
    <div className={cx("flex h-full flex-col px-4 pt-4", step === null ? "pb-8" : "pb-3")}>
      <label htmlFor={id} className="mb-1.5 text-xs font-semibold text-muted">
        어디로 가세요?
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={isOpen && act >= 0 ? `${listId}-${act}` : undefined}
          placeholder="도시 이름"
          value={text}
          onChange={(e) => {
            const v = e.target.value;
            if (bad) {
              // 나쁜 예: 첫 후보로 칸을 통째로 바꿔 버린다. '부천'을 치려 해도 '부산'이 된다
              const hit = v.trim() && CITIES.find((c) => c.startsWith(v.trim()));
              setValue(hit || v);
              return;
            }
            setValue(v);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKey}
          className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-accent focus:outline-none focus-visible:outline-2"
        />
        {isOpen && (
          <ul
            id={listId}
            role="listbox"
            aria-label="추천 도시"
            className="absolute inset-x-0 top-11 z-20 overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-lg"
          >
            {matches.map((c, i) => (
              <li
                key={c}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === act}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(c);
                }}
                onMouseEnter={() => setActive(i)}
                className={cx("cursor-pointer rounded-md px-2.5 py-1.5 text-sm", i === act && "bg-accent-soft")}
              >
                <Highlight text={c} q={q} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {isOpen ? `추천 ${matches.length}개. 위아래 화살표로 고르세요.` : ""}
      </p>
      <Hint>
        {bad ? "'부천'을 치려 해도 첫 후보 '부산'으로 칸이 바뀌어 버려요" : "'제'나 '부'를 쳐 보세요. 화살표와 Enter로 골라요"}
      </Hint>
    </div>
  );
}
