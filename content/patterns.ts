import type { Category, CategoryId, Pattern } from "./types";
import { loadingPatterns } from "./patterns/loading";
import { feedbackPatterns } from "./patterns/feedback";
import { overlayPatterns } from "./patterns/overlay";

export type { Category, CategoryId, Pattern } from "./types";

export const categories: Category[] = [
  {
    id: "loading",
    nameKo: "로딩·진행",
    nameEn: "Loading & Progress",
    description: "기다리는 동안 시스템이 일하고 있다고 알려 준다.",
  },
  {
    id: "feedback",
    nameKo: "피드백·알림",
    nameEn: "Feedback & Notification",
    description: "방금 일어난 일과 지금 상태를 알려 준다.",
  },
  {
    id: "overlay",
    nameKo: "오버레이",
    nameEn: "Overlays",
    description: "지금 화면 위에 다른 층을 띄운다.",
  },
];

/**
 * 모든 패턴. 카테고리별 파일(content/patterns/*.ts)에 항목을 추가하면
 * 홈·상세·검색·헷갈리는 짝 페이지에 자동으로 반영된다.
 */
export const patterns: Pattern[] = [
  ...loadingPatterns,
  ...feedbackPatterns,
  ...overlayPatterns,
];

export function getPattern(slug: string): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId): Category {
  return categories.find((c) => c.id === id)!;
}

export interface Pair {
  a: Pattern;
  b: Pattern;
  difference: string;
}

/** confusedWith에서 짝을 모은다. 같은 짝은 한 번만. */
export function getPairs(): Pair[] {
  const seen = new Set<string>();
  const pairs: Pair[] = [];
  for (const a of patterns) {
    for (const c of a.confusedWith) {
      const b = getPattern(c.slug);
      if (!b) continue;
      const key = [a.slug, b.slug].sort().join("--");
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ a, b, difference: c.difference });
    }
  }
  return pairs;
}

export function pairId(a: string, b: string) {
  return [a, b].sort().join("--");
}

/** 검색용 정규화: 소문자, 공백·하이픈·가운뎃점 제거 */
export function normalize(s: string) {
  return s.toLowerCase().replace(/[\s\-_·/().,]/g, "");
}

export function searchPatterns(query: string, list: Pattern[] = patterns) {
  const q = normalize(query);
  if (!q) return list;
  return list.filter((p) =>
    [p.nameKo, p.nameEn, p.slug, ...p.aliases].some((t) =>
      normalize(t).includes(q),
    ),
  );
}
