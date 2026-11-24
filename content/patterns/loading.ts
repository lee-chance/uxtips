import type { Pattern } from "../types";

const NNG_PROGRESS = {
  label: "NN/g — Progress Indicators Make a Slow System Less Insufferable",
  url: "https://www.nngroup.com/articles/progress-indicators/",
};
const M3_PROGRESS = {
  label: "Material Design 3 — Progress indicators",
  url: "https://m3.material.io/components/progress-indicators/overview",
};
const HIG_PROGRESS = {
  label: "Apple HIG — Progress indicators",
  url: "https://developer.apple.com/design/human-interface-guidelines/progress-indicators",
};

export const loadingPatterns: Pattern[] = [
  {
    slug: "skeleton",
    category: "loading",
    nameKo: "스켈레톤",
    nameEn: "Skeleton screen",
    aliases: ["Skeleton loader", "스켈레톤 UI", "스켈레톤 스크린", "Placeholder"],
    oneLiner: "콘텐츠가 들어올 자리를 회색 틀로 먼저 그려, 불러오는 동안 화면 구조를 미리 보여 주는 로딩 표시.",
    whenToUse: [
      "목록·카드·프로필처럼 레이아웃이 정해진 화면을 처음 불러올 때",
      "전체 화면 로딩이 대략 10초 안에 끝날 때(더 길면 진행률 표시를 함께 쓴다)",
      "1초도 안 걸리는 로딩에는 굳이 쓰지 않는다. 잠깐 번쩍이고 사라져 오히려 산만하다",
    ],
    confusedWith: [
      {
        slug: "spinner",
        difference: "스켈레톤은 '무엇이 어디에 올지'를 보여 주고, 스피너는 '일하는 중'이라는 사실만 알려 준다.",
      },
    ],
    antiPattern: {
      title: "실제 레이아웃과 다른 스켈레톤",
      description:
        "스켈레톤 모양이 실제 콘텐츠와 다르면 로딩이 끝나는 순간 요소들이 자리를 옮기며 화면이 튄다. 미리 보여 준 구조가 틀렸으니 스켈레톤을 쓰는 의미도 없어진다. 실제 콘텐츠와 같은 위치·크기로 그린다.",
    },
    aiPrompt:
      "피드 목록을 불러오는 동안 실제 카드와 같은 크기·배치의 스켈레톤을 보여 줘. 은은한 shimmer를 넣되 prefers-reduced-motion이면 멈추고, 목록 영역에 aria-busy를 걸어 줘.",
    code: {
      language: "tsx",
      snippet: `function PostSkeleton() {
  return (
    <div className="flex gap-3" aria-hidden>
      <div className="size-10 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-32 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

<section aria-busy={isLoading}>
  {isLoading
    ? Array.from({ length: 3 }, (_, i) => <PostSkeleton key={i} />)
    : posts.map((p) => <Post key={p.id} {...p} />)}
</section>`,
    },
    sources: [
      { label: "NN/g — Skeleton Screens 101", url: "https://www.nngroup.com/articles/skeleton-screens/" },
      { label: "The Component Gallery — Skeleton", url: "https://component.gallery/components/skeleton/" },
    ],
  },
  {
    slug: "spinner",
    category: "loading",
    nameKo: "스피너",
    nameEn: "Spinner",
    aliases: ["Activity indicator", "Loader", "Loading indicator", "로딩 인디케이터", "로더", "로딩 스피너"],
    nameNote:
      "Apple HIG는 Activity indicator, The Component Gallery는 Spinner(다른 이름 Loader, Loading)라고 부른다. NN/g는 끝을 모르는 반복 애니메이션을 묶어 looped animation이라고 한다.",
    oneLiner: "작업이 끝날 때까지 빙글빙글 돌며 '처리 중'이라는 사실만 알리는 반복 애니메이션.",
    whenToUse: [
      "2~10초 걸리는 짧은 작업에서 시스템이 멈추지 않았다고 알릴 때(NN/g)",
      "버튼 안이나 목록 끝처럼 작은 영역의 로딩을 표시할 때",
      "1초 미만이면 표시하지 않고, 10초를 넘기면 진행률 바처럼 얼마나 남았는지 보여 주는 표시로 바꾼다",
    ],
    confusedWith: [
      {
        slug: "skeleton",
        difference: "스피너는 '기다려'만 말하고, 스켈레톤은 곧 나타날 화면의 생김새까지 보여 준다.",
      },
      {
        slug: "circular-progress",
        difference: "스피너는 끝을 모른 채 계속 돌고, 원형 진행 표시는 0%에서 100%까지 차오르며 얼마나 됐는지 보여 준다.",
      },
    ],
    antiPattern: {
      title: "긴 작업을 스피너 하나로 버티게 하기",
      description:
        "20초 걸리는 업로드 동안 화면 전체를 스피너로 막으면, 사용자는 얼마나 남았는지도 멈춘 건지도 알 수 없고 취소할 수도 없다. 10초가 넘는 작업은 진행률과 취소 버튼을 보여 준다.",
    },
    aiPrompt:
      "보내기 버튼을 누르면 버튼 안에 작은 스피너와 '보내는 중' 문구를 보여 주고 버튼을 잠가 줘. 1초 안에 끝나면 스피너를 띄우지 말고, aria-busy와 role=\"status\"로 상태를 알려 줘.",
    code: {
      language: "tsx",
      snippet: `function Spinner({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={\`animate-spin \${className}\`}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor"
        strokeOpacity=".2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor"
        strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

<button disabled={sending} aria-busy={sending}>
  {sending ? <><Spinner /> 보내는 중</> : "보내기"}
</button>
<span role="status" className="sr-only">{sending ? "보내는 중" : ""}</span>`,
    },
    sources: [
      NNG_PROGRESS,
      { label: "The Component Gallery — Spinner", url: "https://component.gallery/components/spinner/" },
      HIG_PROGRESS,
    ],
  },
  {
    slug: "progress-bar",
    category: "loading",
    nameKo: "프로그레스 바",
    nameEn: "Progress bar (determinate)",
    aliases: ["진행률 바", "진행 바", "Linear progress indicator", "Determinate progress", "Percent-done indicator"],
    nameNote:
      "Material Design 3는 Linear progress indicator, Apple HIG는 Progress bar라고 부른다. NN/g는 얼마나 됐는지 보여 주는 표시를 percent-done indicator라고 한다.",
    oneLiner: "작업이 얼마나 진행됐는지 가로 막대가 왼쪽에서 오른쪽으로 차오르며 보여 주는 표시.",
    whenToUse: [
      "10초 이상 걸리는 작업에서 남은 양을 보여 줄 때(NN/g)",
      "10초보다 짧아도 '사진 10장 중 3장'처럼 처리할 개수가 정해져 있을 때",
      "오래 걸리는 작업이라면 취소 버튼과 남은 시간 안내를 함께 둔다",
    ],
    confusedWith: [
      {
        slug: "stepper",
        difference: "프로그레스 바는 시스템이 하는 작업의 진행률이고, 단계 표시는 사용자가 거쳐 가는 단계의 위치다.",
      },
      {
        slug: "indeterminate-progress",
        difference: "프로그레스 바는 얼마나 됐는지 알고 채워 가고, 비결정형 진행 표시는 끝을 몰라 같은 움직임을 반복한다.",
      },
    ],
    antiPattern: {
      title: "튀고 뒤로 가다 99%에서 멈추는 진행률",
      description:
        "막대가 들쭉날쭉 튀거나 뒤로 가거나 99%에서 한참 멈추면 진행률을 믿을 수 없게 된다. 숫자나 남은 시간 없이 막대만 있으면 얼마나 기다려야 할지도 알 수 없다. 진행은 한 방향으로만 가게 하고 숫자를 함께 보여 준다.",
    },
    aiPrompt:
      "사진 여러 장을 올릴 때 '10장 중 3장 · 30%'와 남은 시간을 보여 주는 프로그레스 바를 만들어 줘. role=\"progressbar\"와 aria-valuenow를 넣고, 취소 버튼도 붙여 줘.",
    code: {
      language: "tsx",
      snippet: `function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span id="upload-label">{label}</span>
        <span>{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby="upload-label"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-2 overflow-hidden rounded-full bg-gray-200"
      >
        <div className="h-full bg-indigo-600 transition-[width]" style={{ width: \`\${pct}%\` }} />
      </div>
    </div>
  );
}`,
    },
    sources: [NNG_PROGRESS, M3_PROGRESS, HIG_PROGRESS],
  },
  {
    slug: "circular-progress",
    category: "loading",
    nameKo: "원형 진행 표시",
    nameEn: "Circular progress",
    aliases: ["Progress ring", "Circular progress indicator", "원형 프로그레스", "원형 진행률"],
    nameNote:
      "Material Design 3는 Circular progress indicator라고 부르고, 결정형(진행률 표시)과 비결정형(계속 돎) 두 가지를 둔다. 여기서는 진행률이 있는 결정형을 말한다.",
    oneLiner: "원 둘레가 0%에서 100%까지 차오르며 진행률을 보여 주는 동그란 표시.",
    whenToUse: [
      "내려받기 버튼, 카드 모서리처럼 가로 막대를 둘 자리가 좁을 때",
      "진행률을 알 수 있는 작업을 아이콘 크기로 보여 줄 때(가운데 숫자나 완료 표시를 함께)",
      "몇 초 안에 끝나지 않는 작업이라 얼마나 남았는지 알려야 할 때",
    ],
    confusedWith: [
      {
        slug: "spinner",
        difference: "원형 진행 표시는 차오르며 진행률을 말하고, 스피너는 같은 속도로 돌기만 한다.",
      },
      {
        slug: "progress-bar",
        difference: "같은 정보를 원으로 보여 주느냐 막대로 보여 주느냐의 차이다. 좁은 자리에는 원, 넓은 자리에는 막대가 읽기 쉽다.",
      },
    ],
    antiPattern: {
      title: "다 찼다가 다시 처음부터 채우는 가짜 진행률",
      description:
        "실제 진행과 상관없이 원을 채웠다 비웠다 반복하면 진행률처럼 보이지만 아무 정보도 없다. 사용자는 거의 끝났다고 믿었다가 다시 0으로 돌아가는 것을 보고 실망한다. 진행률을 모르면 스피너를 쓰고, 알면 실제 값만 보여 준다.",
    },
    aiPrompt:
      "지도 내려받기 버튼 옆에 진행률이 차오르는 원형 진행 표시를 SVG stroke-dashoffset으로 만들어 줘. 가운데에 퍼센트를, 끝나면 체크 아이콘을 보여 주고 role=\"progressbar\"를 넣어 줘.",
    code: {
      language: "tsx",
      snippet: `const R = 26;
const C = 2 * Math.PI * R;

function ProgressRing({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div role="progressbar" aria-label="내려받기" aria-valuemin={0}
      aria-valuemax={100} aria-valuenow={pct} className="relative size-16">
      <svg viewBox="0 0 64 64" className="-rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={R} fill="none" strokeWidth="6" stroke="#e5e7eb" />
        <circle cx="32" cy="32" r={R} fill="none" strokeWidth="6" stroke="#4f46e5"
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - value)} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm">{pct}%</span>
    </div>
  );
}`,
    },
    sources: [M3_PROGRESS, NNG_PROGRESS],
  },
  {
    slug: "indeterminate-progress",
    category: "loading",
    nameKo: "비결정형 진행 표시",
    nameEn: "Indeterminate progress",
    aliases: ["Indeterminate progress bar", "Indeterminate progress indicator", "무한 로딩 바", "Looped animation"],
    nameNote:
      "Material Design 3와 Apple HIG는 진행 표시를 결정형(determinate)과 비결정형(indeterminate)으로 나눈다. NN/g는 끝을 모르는 반복 표시를 looped animation이라고 부른다.",
    oneLiner: "얼마나 걸릴지 모를 때, 막대 안에서 같은 움직임을 반복하며 작업 중임을 알리는 진행 표시.",
    whenToUse: [
      "남은 양을 계산할 수 없는 짧은 작업(대략 2~10초)일 때(NN/g)",
      "페이지 위쪽 얇은 막대처럼 화면을 가리지 않고 로딩을 알리고 싶을 때",
      "진행률을 알게 되면 그때부터 결정형 프로그레스 바로 바꾼다",
    ],
    confusedWith: [
      {
        slug: "progress-bar",
        difference: "비결정형은 끝을 몰라 반복하고, 프로그레스 바는 실제 진행률만큼 채운다.",
      },
      {
        slug: "spinner",
        difference: "둘 다 끝을 모르는 표시다. 막대 모양은 페이지·영역 가장자리에, 스피너는 버튼·작은 영역에 어울린다.",
      },
    ],
    antiPattern: {
      title: "끝을 알 수 없는 긴 작업에 무한 바 쓰기",
      description:
        "몇십 초 걸리는 보고서 내보내기에 같은 움직임만 반복하는 바를 쓰면, 사용자는 멈춘 건지 진행 중인지 구분할 수 없어 기다리다 포기한다. 10초가 넘는 작업은 진행률이나 단계, 예상 시간을 보여 준다.",
    },
    aiPrompt:
      "검색 중일 때 상단 바 바로 아래에 얇은 비결정형 진행 바를 보여 줘. role=\"progressbar\"에 aria-valuenow를 넣지 말고, prefers-reduced-motion이면 움직임 없이 일부만 채운 막대로 보여 줘.",
    code: {
      language: "css",
      snippet: `/* <div role="progressbar" aria-label="불러오는 중" class="track"><div class="bar"></div></div> */
.track {
  position: relative;
  height: 4px;
  overflow: hidden;
  background: #e0e7ff;
}
.bar {
  position: absolute;
  inset: 0;
  background: #4f46e5;
  transform-origin: left;
  animation: indeterminate 1.3s ease-in-out infinite;
}
@keyframes indeterminate {
  0%   { transform: translateX(-100%) scaleX(0.4); }
  60%  { transform: translateX(60%) scaleX(0.6); }
  100% { transform: translateX(120%) scaleX(0.4); }
}
@media (prefers-reduced-motion: reduce) {
  .bar { animation: none; width: 40%; }
}`,
    },
    sources: [M3_PROGRESS, HIG_PROGRESS, NNG_PROGRESS],
  },
  {
    slug: "pull-to-refresh",
    category: "loading",
    nameKo: "당겨서 새로고침",
    nameEn: "Pull to refresh",
    aliases: ["Swipe to refresh", "Refresh control", "풀투리프레시", "풀 투 리프레시"],
    nameNote:
      "Material Design 2는 Swipe to refresh, Apple은 Refresh control이라는 이름의 컨트롤로 제공한다. ui-patterns.com은 Pull to refresh라고 부른다.",
    oneLiner: "목록 맨 위에서 아래로 끌어당겼다 놓으면 새 내용을 불러오는 동작.",
    whenToUse: [
      "최신 항목이 위에 쌓이는 피드·알림·메일 목록을 사용자가 직접 갱신하게 할 때",
      "터치 화면에서 버튼을 따로 찾지 않고도 갱신할 수 있게 할 때",
      "키보드·마우스 사용자를 위해 새로고침 버튼 같은 다른 방법도 함께 둔다",
    ],
    confusedWith: [
      {
        slug: "spinner",
        difference: "당겨서 새로고침은 사용자가 시작하는 갱신 동작이고, 그 뒤에 보이는 스피너는 갱신 중이라는 표시일 뿐이다.",
      },
    ],
    antiPattern: {
      title: "당겨도 아무 표시가 없는 새로고침",
      description:
        "당기는 동안 화살표나 '놓으면 새로고침' 같은 표시가 없으면 얼마나 당겨야 하는지 알 수 없고, 새로고침이 됐는지도 모른다. 내용이 조용히 바뀌면 사용자는 같은 동작을 반복한다. 문턱을 넘었는지, 지금 불러오는 중인지, 끝났는지 보여 준다.",
    },
    aiPrompt:
      "알림 목록을 맨 위에서 아래로 당기면 '당겨서 새로고침 → 놓으면 새로고침' 표시가 나오고, 문턱을 넘겨 놓으면 스피너와 함께 새 글을 불러오게 해 줘. 키보드 사용자를 위해 상단에 새로고침 버튼도 둬 줘.",
    code: {
      language: "tsx",
      snippet: `const THRESHOLD = 64;
const [pull, setPull] = useState(0);
const startY = useRef<number | null>(null);

<div
  className="h-full touch-none overflow-y-auto"
  style={{ transform: \`translateY(\${refreshing ? 48 : pull}px)\` }}
  onPointerDown={(e) => {
    if (e.currentTarget.scrollTop > 0) return;
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }}
  onPointerMove={(e) => {
    if (startY.current !== null)
      setPull(Math.max(0, (e.clientY - startY.current) * 0.5));
  }}
  onPointerUp={() => {
    startY.current = null;
    if (pull >= THRESHOLD) refresh();
    setPull(0);
  }}
>
  {children}
</div>`,
    },
    sources: [
      { label: "ui-patterns.com — Pull to refresh", url: "https://ui-patterns.com/patterns/pull-to-refresh" },
      {
        label: "Material Design 2 — Swipe to refresh",
        url: "https://m2.material.io/design/platform-guidance/android-swipe-to-refresh.html",
      },
    ],
  },
  {
    slug: "stepper",
    category: "loading",
    nameKo: "단계 표시",
    nameEn: "Stepper",
    aliases: ["Steps", "Progress tracker", "Step indicator", "Wizard 진행 표시", "스텝퍼", "스텝 인디케이터"],
    nameNote:
      "Material Design 2는 Steppers라고 부른다. The Component Gallery는 이 패턴을 Progress indicator(다른 이름 Progress tracker, Stepper, Steps)로 분류하고, 정작 Stepper 항목은 +/− 버튼으로 숫자를 바꾸는 입력 컨트롤을 가리킨다. 이름이 겹치니 검색할 때 주의한다.",
    oneLiner: "여러 단계로 나뉜 과정에서 지금 몇 번째 단계에 있고 몇 단계가 남았는지 보여 주는 표시.",
    whenToUse: [
      "주문·가입·신청처럼 순서가 정해진 3~5단계 과정을 안내할 때",
      "각 단계의 이름을 미리 보여 줘 남은 일을 가늠하게 할 때",
      "단계가 너무 많거나 순서가 없으면 쓰지 않는다. 한 화면으로 합치는 편이 낫다",
    ],
    confusedWith: [
      {
        slug: "progress-bar",
        difference: "단계 표시는 사용자가 거쳐 가는 단계의 위치이고, 프로그레스 바는 시스템이 하는 작업의 진행률이다.",
      },
      {
        slug: "quantity-stepper",
        difference: "둘 다 Stepper라 불리지만, 단계 표시는 여러 단계 중 지금 위치를 보여 주고, 수량 조절은 +/− 버튼으로 숫자를 바꾼다.",
      },
    ],
    antiPattern: {
      title: "이름 없는 점만 늘어놓은 단계 표시",
      description:
        "단계 이름 없이 비슷한 점 7개만 있으면 지금 어디인지, 다음에 무엇을 하는지, 얼마나 남았는지 알 수 없다. 단계마다 이름을 쓰고 현재 단계와 끝낸 단계를 뚜렷하게 구분한다.",
    },
    aiPrompt:
      "주문 과정 위에 '장바구니 → 배송지 → 결제 → 완료' 4단계 단계 표시를 만들어 줘. 끝낸 단계는 체크, 지금 단계는 강조하고 <ol>과 aria-current=\"step\"을 써 줘.",
    code: {
      language: "tsx",
      snippet: `const STEPS = ["장바구니", "배송지", "결제", "완료"];

<ol className="flex" aria-label="주문 단계">
  {STEPS.map((label, i) => (
    <li
      key={label}
      aria-current={i === current ? "step" : undefined}
      className="flex flex-1 flex-col items-center gap-1"
    >
      <span className={i <= current ? "bg-indigo-600 text-white" : "border text-gray-500"}>
        {i < current ? "✓" : i + 1}
      </span>
      <span className={i === current ? "font-semibold" : "text-gray-500"}>
        {label}
        {i < current && <span className="sr-only"> (완료)</span>}
      </span>
    </li>
  ))}
</ol>`,
    },
    sources: [
      { label: "Material Design 2 — Steppers", url: "https://m2.material.io/components/steppers" },
      {
        label: "The Component Gallery — Progress indicator",
        url: "https://component.gallery/components/progress-indicator/",
      },
    ],
  },
  {
    slug: "optimistic-ui",
    category: "loading",
    nameKo: "낙관적 업데이트",
    nameEn: "Optimistic UI",
    aliases: ["Optimistic update", "낙관적 UI", "Optimistic rendering"],
    nameNote:
      "React 공식 문서는 useOptimistic 훅을 '낙관적으로(optimistically) UI를 업데이트'하는 방법으로 설명한다. 디자인 시스템보다는 개발 쪽에서 굳어진 이름이다.",
    oneLiner: "서버 응답을 기다리지 않고 성공할 것이라 보고 화면을 먼저 바꾼 뒤, 실패하면 되돌리는 방식.",
    whenToUse: [
      "좋아요·체크·즐겨찾기처럼 거의 항상 성공하고 결과가 단순한 동작일 때",
      "응답을 기다리는 몇백 ms의 지연도 굼떠 보이는 자주 쓰는 동작일 때",
      "실패하면 원래대로 되돌리고 이유를 알려 줄 수 있을 때만 쓴다. 결제처럼 실패 비용이 큰 동작에는 쓰지 않는다",
    ],
    confusedWith: [
      {
        slug: "spinner",
        difference: "낙관적 업데이트는 기다리는 시간을 아예 보여 주지 않고, 스피너는 기다리는 동안을 보여 준다.",
      },
      {
        slug: "undo",
        difference: "낙관적 업데이트는 시스템이 실패를 되돌리고, 되돌리기는 사용자가 자기 동작을 취소한다.",
      },
    ],
    antiPattern: {
      title: "실패해도 되돌리지 않는 낙관적 업데이트",
      description:
        "화면은 이미 '좋아요'로 바뀌었는데 서버 저장이 실패한 뒤에도 그대로 두면, 사용자는 반영됐다고 믿지만 새로고침하면 사라진다. 실패하면 원래 상태로 되돌리고 무엇이 안 됐는지 알려 준다.",
    },
    aiPrompt:
      "좋아요 버튼을 누르면 서버 응답을 기다리지 말고 하트와 숫자를 바로 바꿔 줘. React useOptimistic을 쓰고, 서버 요청이 실패하면 원래대로 되돌린 뒤 '반영하지 못했어요' 메시지를 role=\"status\"로 보여 줘.",
    code: {
      language: "tsx",
      snippet: `function LikeButton({ liked, onLike }: { liked: boolean; onLike: (v: boolean) => Promise<void> }) {
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      setError("");
      setOptimisticLiked(!optimisticLiked); // 화면 먼저
      try {
        await onLike(!optimisticLiked); // 성공하면 부모가 liked를 갱신
      } catch {
        setError("좋아요를 반영하지 못했어요."); // 전환이 끝나면 원래 값으로 돌아간다
      }
    });

  return (
    <>
      <button aria-pressed={optimisticLiked} onClick={toggle}>♥</button>
      <p role="status">{error}</p>
    </>
  );
}`,
    },
    sources: [{ label: "React — useOptimistic", url: "https://react.dev/reference/react/useOptimistic" }],
  },
];
