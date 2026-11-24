import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Playground } from "@/components/demo/Playground";
import { CopyButton } from "@/components/ui/CopyButton";
import { getCategory, getPattern, pairId, patterns } from "@/content/patterns";

export const dynamicParams = false;

export function generateStaticParams() {
  return patterns.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPattern(slug);
  if (!p) return {};
  return { title: `${p.nameKo} (${p.nameEn})`, description: p.oneLiner };
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPattern(slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const siblings = patterns.filter((x) => x.category === p.category);
  const idx = siblings.findIndex((x) => x.slug === p.slug);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];

  return (
    <article className="pt-8">
      <nav aria-label="이동 경로" className="text-sm text-muted">
        <Link href="/" className="hover:text-fg">
          도감
        </Link>
        <span aria-hidden> / </span>
        <Link href={`/#cat-${cat.id}`} className="hover:text-fg">
          {cat.nameKo}
        </Link>
      </nav>

      <header className="mt-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {p.nameKo}
          <span className="ml-2 align-middle text-xl font-medium text-muted">{p.nameEn}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg">{p.oneLiner}</p>
        {p.aliases.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm">
            <span className="text-muted">다른 이름</span>
            <ul className="contents">
              {p.aliases.map((a) => (
                <li key={a} className="rounded-full bg-surface-2 px-2.5 py-0.5">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section aria-labelledby="try">
          <h2 id="try" className="mb-3 text-lg font-semibold">
            직접 해보기
          </h2>
          <Playground slug={p.slug} antiPattern={p.antiPattern} />
        </section>

        <div className="space-y-8">
          <section aria-labelledby="when">
            <h2 id="when" className="mb-2 text-lg font-semibold">
              언제 쓰나
            </h2>
            <ul className="space-y-2">
              {p.whenToUse.map((w) => (
                <li key={w} className="flex gap-2">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>

          {p.nameNote && (
            <section aria-labelledby="names">
              <h2 id="names" className="mb-2 text-lg font-semibold">
                이름이 출처마다 달라요
              </h2>
              <p className="text-muted">{p.nameNote}</p>
            </section>
          )}

          <section aria-labelledby="confused">
            <h2 id="confused" className="mb-2 text-lg font-semibold">
              헷갈리는 짝
            </h2>
            <ul className="space-y-2">
              {p.confusedWith.map((c) => {
                const other = getPattern(c.slug);
                if (!other) return null;
                return (
                  <li key={c.slug}>
                    <Link
                      href={`/pairs#${pairId(p.slug, c.slug)}`}
                      className="block rounded-xl border border-line p-3 hover:border-accent/50"
                    >
                      <span className="font-medium">
                        {p.nameKo} vs {other.nameKo}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted">{c.difference}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>

      <section aria-labelledby="ai" className="mt-12">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 id="ai" className="text-lg font-semibold">
            AI에게 이렇게 요청하기
          </h2>
          <CopyButton text={p.aiPrompt} label="프롬프트 복사" />
        </div>
        <blockquote className="rounded-xl border-l-4 border-accent bg-accent-soft/60 px-4 py-3">
          {p.aiPrompt}
        </blockquote>
      </section>

      <section aria-labelledby="code" className="mt-8">
        <h2 id="code" className="sr-only">
          코드
        </h2>
        <details className="group rounded-xl border border-line bg-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
            <span>
              핵심 구현 코드 <span className="text-sm font-normal text-muted">({p.code.language})</span>
            </span>
            <span aria-hidden className="text-muted transition group-open:rotate-180">
              ▾
            </span>
          </summary>
          <div className="border-t border-line">
            <div className="flex justify-end px-3 pt-3">
              <CopyButton text={p.code.snippet} label="코드 복사" />
            </div>
            <pre
              tabIndex={0}
              aria-label="코드"
              className="overflow-x-auto px-4 pb-4 pt-2 font-mono text-[13px] leading-relaxed"
            >
              <code>{p.code.snippet}</code>
            </pre>
          </div>
        </details>
      </section>

      <section aria-labelledby="src" className="mt-8">
        <h2 id="src" className="mb-2 text-lg font-semibold">
          출처
        </h2>
        <ul className="space-y-1">
          {p.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                {s.label}
                <span className="sr-only"> (새 창)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="같은 카테고리의 다른 패턴" className="mt-12 flex justify-between gap-4 border-t border-line pt-6 text-sm">
        {prev ? (
          <Link href={`/patterns/${prev.slug}`} className="hover:text-accent">
            ← {prev.nameKo}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/patterns/${next.slug}`} className="hover:text-accent">
            {next.nameKo} →
          </Link>
        )}
      </nav>
    </article>
  );
}
