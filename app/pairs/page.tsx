import type { Metadata } from "next";
import Link from "next/link";
import { AutoplayPreview } from "@/components/demo/AutoplayPreview";
import { getPairs, pairId, type Pair } from "@/content/patterns";

export const metadata: Metadata = {
  title: "헷갈리는 짝",
  description: "비슷해 보이는 두 패턴을 나란히 놓고 차이를 한 줄로.",
};

// 가장 자주 헷갈리는 짝을 먼저 보여 준다
const FEATURED = [
  pairId("toast", "snackbar"),
  pairId("modal", "bottom-sheet"),
  pairId("spinner", "skeleton"),
  pairId("progress-bar", "stepper"),
];

export default function PairsPage() {
  const pairs = getPairs().sort((x, y) => rank(x) - rank(y));

  return (
    <>
      <section className="pt-10">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">헷갈리는 짝</h1>
        <p className="mt-2 max-w-2xl text-muted">
          비슷해 보이지만 쓰임이 다른 두 패턴을 나란히 놓았습니다. 차이는 한 줄로 적었습니다.
        </p>
        <nav aria-label="짝 목록" className="mt-5">
          <ul className="flex flex-wrap gap-2 text-sm">
            {pairs.map((p) => (
              <li key={id(p)}>
                <a href={`#${id(p)}`} className="block rounded-full border border-line px-3 py-1 hover:border-accent/50">
                  {p.a.nameKo} · {p.b.nameKo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <div className="mt-10 space-y-10">
        {pairs.map((pair) => (
          <section
            key={id(pair)}
            id={id(pair)}
            aria-labelledby={`${id(pair)}-h`}
            className="scroll-mt-20 rounded-2xl border border-line bg-surface p-4 sm:p-5"
          >
            <h2 id={`${id(pair)}-h`} className="text-lg font-semibold">
              {pair.a.nameKo} <span className="text-muted">vs</span> {pair.b.nameKo}
            </h2>
            <p className="mt-1">{pair.difference}</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {[pair.a, pair.b].map((p) => (
                <Link
                  key={p.slug}
                  href={`/patterns/${p.slug}`}
                  className="group block overflow-hidden rounded-xl border border-line hover:border-accent/50"
                >
                  <AutoplayPreview slug={p.slug} className="aspect-[4/3] border-b border-line" />
                  <div className="flex items-baseline justify-between gap-2 px-3 py-2">
                    <span className="font-medium">
                      {p.nameKo} <span className="text-sm font-normal text-muted">{p.nameEn}</span>
                    </span>
                    <span className="shrink-0 text-sm text-accent">직접 해보기 →</span>
                  </div>
                  <p className="px-3 pb-3 text-sm text-muted">{p.oneLiner}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function id(p: Pair) {
  return pairId(p.a.slug, p.b.slug);
}

function rank(p: Pair) {
  const i = FEATURED.indexOf(id(p));
  return i === -1 ? FEATURED.length : i;
}
