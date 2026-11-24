# UX 패턴 도감

매일 보지만 이름을 몰랐던 UI 패턴을 **직접 눌러 보는 라이브 예시 + 정확한 이름**으로 보여 주는 정적 사이트.
로그인·DB·분석 도구 없이 링크 하나로 공유한다.

- Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion
- 모든 페이지를 빌드 때 정적으로 만든다(SSG). 외부 API·DB를 쓰지 않는다.

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 정적 생성 + 타입 검사
npm run typecheck  # 타입 검사만
```

Vercel에 저장소를 연결하면 별도 설정 없이 배포된다.

## 구조

```
content/
  types.ts               Pattern 스키마
  patterns.ts            전체 목록·카테고리·검색·헷갈리는 짝 계산
  patterns/loading.ts    카테고리별 패턴 데이터
  patterns/feedback.ts
  patterns/overlay.ts
demos/
  index.ts               slug → 데모 컴포넌트 등록부
  loading/ feedback/ overlay/
components/demo/
  context.tsx            useScript(자동 재생 타임라인), DemoProvider
  kit.tsx                Stage·Scrim·Tap·useFocusTrap 등 데모 공용 부품
  AutoplayPreview.tsx    카드 미리보기(자동 재생, 화면 밖 일시정지, reduced-motion 정지)
  Playground.tsx         상세 "직접 해보기"(좋은 예/나쁜 예 토글)
app/
  page.tsx               홈 카드 그리드
  patterns/[slug]/       패턴 상세
  pairs/                 헷갈리는 짝
```

## 패턴 추가 방법

### 1. 데이터 추가

`content/patterns/<카테고리>.ts` 배열에 항목을 하나 넣는다. 타입은 `content/types.ts`의 `Pattern`이고 모든 필드를 채운다.

```ts
{
  slug: "segmented-control",            // URL: /patterns/segmented-control
  category: "feedback",
  nameKo: "세그먼트 컨트롤",
  nameEn: "Segmented control",
  aliases: ["Segmented button", "세그먼트 버튼"],   // 검색에 쓰인다
  nameNote: "Apple은 Segmented control, Material 3는 Segmented button이라 부른다.", // 선택
  oneLiner: "한 줄 정의",
  whenToUse: ["언제 쓰는지 2~3개"],
  confusedWith: [{ slug: "tabs", difference: "차이 한 줄" }],
  antiPattern: { title: "나쁜 예 제목", description: "왜 나쁜지" },
  aiPrompt: "AI 코딩 도구에 붙여 넣을 한국어 요청 한두 줄",
  code: { language: "tsx", snippet: `...` },
  sources: [{ label: "Apple HIG — Segmented controls", url: "https://..." }],
}
```

- **출처 원칙**: 이름과 정의는 NN/g, Material Design, Apple HIG, ui-patterns.com, The Component Gallery 같은 공개 출처에 근거한다. 출처를 찾지 못한 이름은 넣지 말고 `// TODO: 출처 확인` 주석으로 남긴다.
- 출처마다 이름이 다르면 하나를 지어내지 말고 `aliases`와 `nameNote`로 차이를 보여 준다.
- 다른 사이트의 문구·이미지를 그대로 복사하지 않는다. 정의는 직접 쓴다.
- `confusedWith`에 넣은 짝은 "헷갈리는 짝" 페이지에 자동으로 생긴다(양쪽에 적어도 한 번만 나온다).

### 2. 데모 만들기

`demos/<카테고리>/<Name>.tsx`를 만들고 `demos/<카테고리>/index.ts`에 slug로 등록한다.
데모 하나가 **자동 재생(카드)**과 **직접 조작(상세)** 두 모드를 모두 맡는다.

```tsx
"use client";
import { useState } from "react";
import { useScript, type DemoProps } from "@/components/demo/context";
import { DemoButton, Tap } from "@/components/demo/kit";

// 단계별 머무는 시간(ms). 합이 2~4초가 되게. 모듈 최상단 상수로 둔다.
const SCRIPT = [800, 300, 1600, 600] as const;

export default function MyDemo({ variant = "good" }: DemoProps) {
  const step = useScript(SCRIPT, 2); // 2 = reduced-motion일 때 보여 줄 대표 단계
  const [open, setOpen] = useState(false);
  const shown = step === null ? open : step === 2; // null이면 사용자가 조작하는 모드

  return (
    <>
      <DemoButton onClick={() => setOpen((v) => !v)}>열기</DemoButton>
      <Tap show={step === 1} x="50%" y="60%" />  {/* 자동 재생 때 누르는 손가락 */}
      {shown && <div>{variant === "bad" ? "나쁜 예" : "좋은 예"}</div>}
    </>
  );
}
```

규칙:
- 오버레이는 `fixed`가 아니라 무대(Stage) 기준 `absolute`로 띄운다.
- 키보드만으로 조작할 수 있어야 한다. 다이얼로그류는 `useFocusTrap`(첫 요소 포커스, Tab 가두기, Esc 닫기, 포커스 되돌리기)을 쓴다.
- 알맞은 aria 속성(role, aria-live, aria-expanded 등)을 단다.
- 색은 `app/globals.css`의 토큰(`bg-surface`, `text-muted`, `bg-accent` …)만 쓴다. 라이트·다크가 자동으로 맞춰진다.
- GIF·MP4를 쓰지 않는다.

데이터와 데모를 추가하면 홈 카드, 상세 페이지, 검색, 헷갈리는 짝 페이지에 자동으로 반영된다.
데모를 아직 만들지 않았으면 카드에 "데모 준비 중"이 보인다.
