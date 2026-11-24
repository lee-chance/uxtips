"use client";

import Link from "next/link";
import { AutoplayPreview } from "@/components/demo/AutoplayPreview";
import { categories, patterns, searchPatterns, type Pattern } from "@/content/patterns";
import { useSearch } from "./SearchProvider";

export function PatternGrid() {
  const { query } = useSearch();
  const results = searchPatterns(query);
  const q = query.trim();

  return (
    <div id="results" className="scroll-mt-20">
      <p aria-live="polite" className="sr-only">
        {q ? `${results.length}개 패턴` : ""}
      </p>
      {q && results.length === 0 && (
        <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-muted">
          &lsquo;{q}&rsquo;에 맞는 패턴이 없어요. 한국어 이름, 영문 이름, 별칭으로 찾아 보세요.
        </p>
      )}
      {categories.map((cat) => {
        const items = results.filter((p) => p.category === cat.id);
        if (items.length === 0) return null;
        const total = patterns.filter((p) => p.category === cat.id).length;
        return (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="mt-16 first:mt-8">
            <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 id={`cat-${cat.id}`} className="scroll-mt-20 text-lg font-semibold">
                {cat.nameKo} <span className="font-normal text-muted">{cat.nameEn}</span>
              </h2>
              <span className="text-sm text-muted">
                {cat.description} · {q ? `${items.length}/${total}` : total}개
              </span>
            </div>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-8 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => (
                <li key={p.slug}>
                  <PatternCard pattern={p} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function PatternCard({ pattern: p }: { pattern: Pattern }) {
  return (
    <Link
      href={`/patterns/${p.slug}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md focus-visible:outline-offset-4"
    >
      <AutoplayPreview slug={p.slug} className="aspect-[4/3] border-b border-line" />
      <div className="px-4 py-3">
        <h3 className="font-semibold leading-tight">{p.nameKo}</h3>
        <p className="mt-0.5 truncate text-sm text-muted">{p.nameEn}</p>
      </div>
    </Link>
  );
}
