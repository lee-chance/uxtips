export type CategoryId =
  | "loading"
  | "feedback"
  | "overlay"
  | "input"
  | "navigation"
  | "content"
  | "motion";

export interface Category {
  id: CategoryId;
  nameKo: string;
  nameEn: string;
  description: string;
}

export interface Source {
  /** 예: "NN/g — Skeleton Screens 101" */
  label: string;
  url: string;
}

export interface ConfusedWith {
  /** 헷갈리는 짝 패턴의 slug */
  slug: string;
  /** 차이를 한 줄로 */
  difference: string;
}

export interface Pattern {
  slug: string;
  category: CategoryId;
  /** 국내 실무에서 흔히 쓰는 한국어 이름 */
  nameKo: string;
  /** 대표 영문 이름 */
  nameEn: string;
  /** 다른 이름들. 검색에 쓰인다. */
  aliases: string[];
  /** 출처마다 이름이 다를 때 그 차이를 설명한다(선택) */
  nameNote?: string;
  /** 한 줄 정의 */
  oneLiner: string;
  /** 언제 쓰는지 2~3개 */
  whenToUse: string[];
  confusedWith: ConfusedWith[];
  /** 나쁜 예. 데모는 같은 컴포넌트의 variant="bad"로 보여 준다. */
  antiPattern: { title: string; description: string };
  /** AI 코딩 도구에 붙여 넣을 한국어 요청 한두 줄 */
  aiPrompt: string;
  /** 핵심 구현 코드 */
  code: { language: "tsx" | "ts" | "css"; snippet: string };
  /** 이름과 정의의 출처. 최소 1개 */
  sources: Source[];
}
