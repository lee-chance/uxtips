"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { searchPatterns } from "@/content/patterns";
import { useSearch } from "./SearchProvider";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <span aria-hidden className="grid size-6 place-items-center rounded-md bg-accent text-xs text-accent-fg">
            UX
          </span>
          <span className="hidden sm:inline">패턴 도감</span>
          <span className="sr-only sm:hidden">UX 패턴 도감</span>
        </Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-1 text-sm">
          <NavLink href="/" active={pathname === "/"}>
            도감
          </NavLink>
          <NavLink href="/pairs" active={pathname === "/pairs"}>
            헷갈리는 짝
          </NavLink>
        </nav>
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2">
          <SearchBox />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        "whitespace-nowrap rounded-md px-2 py-1.5 " +
        (active ? "bg-surface-2 font-medium text-fg" : "text-muted hover:text-fg")
      }
    >
      {children}
    </Link>
  );
}

/**
 * 검색 상자. 홈에서는 카드 그리드를 바로 거르고,
 * 다른 페이지에서는 결과 목록(listbox)을 펼친다.
 */
function SearchBox() {
  const { query, setQuery } = useSearch();
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const results = query.trim() ? searchPatterns(query).slice(0, 8) : [];
  const showList = !onHome && open && query.trim().length > 0;

  // 페이지를 옮기면 목록을 닫는다
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // "/" 키로 검색창 포커스
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (slug: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/patterns/${slug}`);
  };

  return (
    <div className="relative w-full max-w-64">
      <label htmlFor="site-search" className="sr-only">
        패턴 검색 (한국어, 영문, 별칭)
      </label>
      <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted">
        <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="m14 14 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        id="site-search"
        type="search"
        autoComplete="off"
        placeholder="토스트, toast, snackbar…"
        value={query}
        role={onHome ? undefined : "combobox"}
        aria-expanded={onHome ? undefined : showList}
        aria-controls={onHome ? undefined : listId}
        aria-autocomplete={onHome ? undefined : "list"}
        aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            if (showList) setOpen(false);
            else setQuery("");
            return;
          }
          if (!showList) {
            if (e.key === "Enter" && onHome) {
              document.getElementById("results")?.scrollIntoView({ block: "start" });
            }
            return;
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && results[active]) {
            e.preventDefault();
            go(results[active].slug);
          }
        }}
        className="h-9 w-full rounded-lg border border-line bg-surface pl-8 pr-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none focus-visible:outline-2"
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="검색 결과"
          className="absolute right-0 top-11 z-50 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-xl"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted">맞는 패턴이 없어요</li>
          ) : (
            results.map((p, i) => (
              <li
                key={p.slug}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  go(p.slug);
                }}
                onMouseEnter={() => setActive(i)}
                className={
                  "flex cursor-pointer items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-sm " +
                  (i === active ? "bg-accent-soft" : "")
                }
              >
                <span className="font-medium">{p.nameKo}</span>
                <span className="truncate text-xs text-muted">{p.nameEn}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
