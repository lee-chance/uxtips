import Link from "next/link";
import { PatternGrid } from "@/components/ui/PatternGrid";
import { categories, patterns } from "@/content/patterns";

export default function Home() {
  return (
    <>
      <section className="pt-10 sm:pt-14">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          매일 보지만 이름은 몰랐던 UI 패턴
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          카드가 저절로 움직이며 패턴을 보여 줍니다. 눌러서 직접 조작해 보고, 정확한 이름과 출처를 확인하세요.
          지금 {patterns.length}개가 있습니다. 비슷해서 헷갈린다면{" "}
          <Link href="/pairs" className="font-medium text-accent underline-offset-4 hover:underline">
            헷갈리는 짝
          </Link>
          을 보세요.
        </p>
        <nav aria-label="카테고리 바로가기" className="mt-6">
          <ul className="flex flex-wrap gap-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <a
                  href={`#cat-${c.id}`}
                  className="block rounded-full border border-line bg-surface px-3 py-1.5 hover:border-accent/50"
                >
                  {c.nameKo}
                  <span className="ml-1.5 text-muted">
                    {patterns.filter((p) => p.category === c.id).length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>
      <PatternGrid />
    </>
  );
}
