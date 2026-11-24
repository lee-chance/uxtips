import type { Pattern } from "../types";

export const navigationPatterns: Pattern[] = [
  {
    slug: "tabs",
    category: "navigation",
    nameKo: "탭",
    nameEn: "Tabs",
    aliases: ["Tab bar(상단)", "Tabbed interface", "탭 메뉴", "Top tabs", "탭 UI"],
    nameNote:
      "The Component Gallery는 Tabs의 다른 이름으로 Tabbed interface를 든다. Apple HIG의 'Tab bar'는 화면 아래 앱 전체 내비게이션을 뜻하므로, 이 도감에서는 그것을 '하단 탭 바'로 따로 다룬다.",
    oneLiner: "같은 화면 안에서 관련된 내용 묶음을 나란히 두고, 하나씩 골라 보게 하는 전환 버튼 줄.",
    whenToUse: [
      "상품정보·리뷰·문의처럼 성격이 다른 내용을 같은 맥락에서 번갈아 볼 때",
      "사용자가 여러 묶음을 동시에 비교할 필요가 없을 때(동시에 봐야 하면 한 화면에 나열)",
      "탭이 한 줄에 다 들어갈 만큼 적고(대개 2~6개), 이름이 짧고 분명할 때",
    ],
    confusedWith: [
      { slug: "segmented-control", difference: "탭은 보이는 내용 영역을 바꾸고, 세그먼트 컨트롤은 같은 내용의 보기 방식이나 값을 고른다." },
      { slug: "tab-bar", difference: "탭은 한 화면 안의 내용 묶음을 바꾸고, 하단 탭 바는 앱의 최상위 화면 사이를 오간다." },
      { slug: "accordion", difference: "탭은 한 번에 한 묶음만 보여 주고, 아코디언은 여러 묶음을 세로로 쌓아 두고 필요한 것만 펼친다." },
    ],
    antiPattern: {
      title: "순서가 있는 단계를 탭으로 만들기",
      description:
        "약관 → 본인확인 → 결제처럼 차례대로 해야 하는 일을 탭 7개로 늘어놓으면, 아무 단계나 먼저 누를 수 있고 뒤쪽 탭은 화면 밖으로 밀려 보이지 않는다. 순서가 있으면 단계 표시를 쓴다.",
    },
    aiPrompt:
      "상품 상세에 '상품정보·리뷰·문의' 탭을 만들어 줘. role=tablist/tab/tabpanel과 aria-selected를 쓰고, ← → 키로 탭을 옮기고 선택된 탭만 Tab 키로 들어가게(roving tabindex) 해 줘.",
    code: {
      language: "tsx",
      snippet: `const [sel, setSel] = useState(0);
const tabs = ["상품정보", "리뷰", "문의"];

<div role="tablist" aria-label="상품 상세" onKeyDown={(e) => {
  if (e.key === "ArrowRight") setSel((sel + 1) % tabs.length);
  if (e.key === "ArrowLeft") setSel((sel - 1 + tabs.length) % tabs.length);
}}>
  {tabs.map((t, i) => (
    <button key={t} role="tab" id={\`tab-\${i}\`}
      aria-selected={i === sel} aria-controls="panel"
      tabIndex={i === sel ? 0 : -1} onClick={() => setSel(i)}>
      {t}
    </button>
  ))}
</div>
<div role="tabpanel" id="panel" aria-labelledby={\`tab-\${sel}\`} tabIndex={0}>
  {/* 선택된 탭의 내용 */}
</div>`,
    },
    sources: [
      { label: "NN/g — Tabs, Used Right", url: "https://www.nngroup.com/articles/tabs-used-right/" },
      { label: "Material Design 3 — Tabs", url: "https://m3.material.io/components/tabs/overview" },
      { label: "The Component Gallery — Tabs", url: "https://component.gallery/components/tabs/" },
      { label: "WAI-ARIA APG — Tabs Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" },
    ],
  },
  {
    slug: "tab-bar",
    category: "navigation",
    nameKo: "하단 탭 바",
    nameEn: "Tab bar (bottom navigation)",
    aliases: ["Tab bar", "Bottom navigation", "Navigation bar", "바텀 내비게이션", "하단 내비게이션", "탭바", "바텀 탭"],
    nameNote:
      "Apple HIG는 Tab bar, Material Design 3는 Navigation bar(Material 2에서는 Bottom navigation)라고 부른다. 한 화면 안의 내용 묶음을 바꾸는 '탭'과는 다른 패턴이다.",
    oneLiner: "앱 화면 맨 아래에 늘 붙어 있으면서 최상위 화면 몇 개 사이를 한 번에 오가게 하는 메뉴.",
    whenToUse: [
      "홈·검색·내 정보처럼 자주 오가는 최상위 목적지가 3~5개일 때",
      "어느 화면에 있든 주요 화면으로 바로 돌아갈 수 있어야 할 때",
      "아이콘만으로는 뜻이 모호하니, 아이콘과 짧은 이름을 함께 둘 때",
    ],
    confusedWith: [
      { slug: "tabs", difference: "하단 탭 바는 앱의 최상위 화면을 오가고, 탭은 한 화면 안의 내용 묶음을 바꾼다." },
      { slug: "drawer", difference: "하단 탭 바는 주요 목적지를 늘 보여 주고, 드로어는 메뉴를 숨겨 두었다가 열어야 보인다." },
    ],
    antiPattern: {
      title: "이름 없는 아이콘 7개를 몰아넣기",
      description:
        "홈·검색·찜·장바구니·알림·설정·내 정보를 아이콘만으로 한 줄에 넣으면, 누를 곳이 작아지고 무엇이 무엇인지 기억해야 한다. 최상위 목적지만 3~5개 두고 이름을 함께 쓴다.",
    },
    aiPrompt:
      "모바일 화면 하단에 홈·검색·찜·내 정보 4개짜리 탭 바를 고정해 줘. 아이콘 아래에 이름을 쓰고, nav 요소 안에서 지금 화면에는 aria-current=\"page\"를 달아 줘.",
    code: {
      language: "tsx",
      snippet: `const items = [
  { href: "/", label: "홈", icon: <HomeIcon /> },
  { href: "/search", label: "검색", icon: <SearchIcon /> },
  { href: "/likes", label: "찜", icon: <HeartIcon /> },
  { href: "/me", label: "내 정보", icon: <UserIcon /> },
];

<nav aria-label="주 메뉴" className="fixed inset-x-0 bottom-0 border-t bg-white pb-[env(safe-area-inset-bottom)]">
  <ul className="flex">
    {items.map((it) => (
      <li key={it.href} className="flex-1">
        <Link href={it.href} aria-current={pathname === it.href ? "page" : undefined}
          className="flex flex-col items-center gap-0.5 py-2 text-xs">
          {it.icon}
          {it.label}
        </Link>
      </li>
    ))}
  </ul>
</nav>`,
    },
    sources: [
      { label: "Apple HIG — Tab bars", url: "https://developer.apple.com/design/human-interface-guidelines/tab-bars" },
      { label: "Material Design 3 — Navigation bar", url: "https://m3.material.io/components/navigation-bar/overview" },
    ],
  },
  {
    slug: "breadcrumb",
    category: "navigation",
    nameKo: "브레드크럼",
    nameEn: "Breadcrumb",
    aliases: ["Breadcrumbs", "Breadcrumb trail", "경로 표시", "이동 경로", "빵부스러기 메뉴"],
    oneLiner: "지금 페이지가 사이트 구조의 어디쯤인지 위 단계부터 차례로 보여 주고, 위 단계로 바로 올라가게 하는 링크 줄.",
    whenToUse: [
      "카테고리 → 하위 카테고리 → 상품처럼 단계가 깊은 위계 구조일 때",
      "검색이나 외부 링크로 깊은 페이지에 바로 들어온 사람이 위치를 알아야 할 때",
      "주 메뉴를 대신하지 않고 보조 길잡이로 페이지 위쪽에 둘 때",
    ],
    confusedWith: [
      { slug: "stepper", difference: "브레드크럼은 사이트 구조 속 '위치'를, 단계 표시는 할 일의 '진행 순서'를 보여 준다." },
    ],
    antiPattern: {
      title: "위계가 아니라 방문 기록을 보여 주기",
      description:
        "'노트북 > 운동화 > 쿠폰함 > 노트북'처럼 지나온 순서를 늘어놓으면 지금 어디에 있는지 알 수 없다. 뒤로 가기는 브라우저가 이미 해 준다. 브레드크럼은 사이트 구조상의 위 단계를 보여 준다.",
    },
    aiPrompt:
      "상품 페이지 위에 '홈 > 가전 > 노트북 > 13인치 노트북' 브레드크럼을 만들어 줘. nav aria-label=\"이동 경로\" 안에 ol로 쓰고, 마지막 항목은 링크가 아닌 aria-current=\"page\"로 해 줘.",
    code: {
      language: "tsx",
      snippet: `const trail = [
  { href: "/", label: "홈" },
  { href: "/c/appliances", label: "가전" },
  { href: "/c/laptops", label: "노트북" },
  { label: "13인치 노트북" }, // 현재 페이지
];

<nav aria-label="이동 경로">
  <ol className="flex flex-wrap gap-1 text-sm">
    {trail.map((c, i) => (
      <li key={c.label} className="flex items-center gap-1">
        {c.href ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
        {i < trail.length - 1 && <span aria-hidden>›</span>}
      </li>
    ))}
  </ol>
</nav>`,
    },
    sources: [
      { label: "NN/g — Breadcrumbs: 11 Design Guidelines", url: "https://www.nngroup.com/articles/breadcrumbs/" },
      { label: "The Component Gallery — Breadcrumbs", url: "https://component.gallery/components/breadcrumbs/" },
    ],
  },
  {
    slug: "pagination",
    category: "navigation",
    nameKo: "페이지네이션",
    nameEn: "Pagination",
    aliases: ["Paging", "Pager", "페이지 번호", "페이징", "쪽 번호"],
    oneLiner: "긴 목록을 정해진 개수씩 여러 쪽으로 나누고, 쪽 번호로 원하는 곳에 바로 가게 하는 방식.",
    whenToUse: [
      "검색 결과·게시판처럼 특정 항목을 찾아 다시 돌아오거나 위치를 공유해야 할 때",
      "목록의 전체 규모(모두 몇 쪽인지)를 알려 주고 싶을 때",
      "페이지 아래 바닥글(고객센터·약관)에 사용자가 닿아야 할 때",
    ],
    confusedWith: [
      { slug: "infinite-scroll", difference: "페이지네이션은 쪽을 나눠 위치를 기억하기 쉽고, 무한 스크롤은 끊김 없이 이어지지만 위치와 끝이 흐려진다." },
      { slug: "load-more", difference: "페이지네이션은 쪽을 바꾸면 목록이 갈리고, 더 보기는 지금 목록 아래에 이어 붙인다." },
    ],
    antiPattern: {
      title: "'이전·다음'만 있고 지금 쪽 표시가 없음",
      description:
        "이전·다음 버튼만 있으면 지금 몇 쪽인지, 모두 몇 쪽인지 알 수 없고 멀리 있는 쪽으로 가려면 수없이 눌러야 한다. 현재 쪽을 강조하고 쪽 번호를 함께 보여 준다.",
    },
    aiPrompt:
      "게시판 목록 아래에 페이지네이션을 만들어 줘. nav aria-label=\"페이지\" 안에 이전·쪽 번호·다음을 두고, 현재 쪽에 aria-current=\"page\"를 달고 쪽이 바뀌면 목록 제목으로 포커스를 옮겨 줘.",
    code: {
      language: "tsx",
      snippet: `function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  return (
    <nav aria-label="페이지">
      <ul className="flex gap-1">
        <li><button aria-label="이전 페이지" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button></li>
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <button aria-current={p === page ? "page" : undefined}
              aria-label={\`\${p}쪽\`} onClick={() => onChange(p)}>
              {p}
            </button>
          </li>
        ))}
        <li><button aria-label="다음 페이지" disabled={page === total} onClick={() => onChange(page + 1)}>›</button></li>
      </ul>
    </nav>
  );
}`,
    },
    sources: [
      { label: "ui-patterns.com — Pagination", url: "https://ui-patterns.com/patterns/Pagination" },
      { label: "The Component Gallery — Pagination", url: "https://component.gallery/components/pagination/" },
      { label: "NN/g — Infinite Scrolling: When to Use It, When to Avoid It", url: "https://www.nngroup.com/articles/infinite-scrolling/" },
    ],
  },
  {
    slug: "infinite-scroll",
    category: "navigation",
    nameKo: "무한 스크롤",
    nameEn: "Infinite scroll",
    aliases: ["Continuous scrolling", "Endless scrolling", "무한 스크롤링", "Infinite scrolling"],
    nameNote: "ui-patterns.com은 Continuous scrolling이라는 이름으로 다룬다.",
    oneLiner: "목록 끝에 가까워지면 다음 내용을 저절로 불러와 붙여서, 버튼 없이 계속 내려 보게 하는 방식.",
    whenToUse: [
      "SNS 피드·사진 둘러보기처럼 특정 항목을 찾기보다 훑어보는 게 목적일 때",
      "항목이 비슷한 무게로 끝없이 이어지고 순서가 크게 중요하지 않을 때",
      "바닥글에 꼭 닿아야 할 정보가 없을 때(있다면 더 보기나 페이지네이션을 쓴다)",
    ],
    confusedWith: [
      { slug: "pagination", difference: "무한 스크롤은 끊김 없이 이어 붙이고, 페이지네이션은 쪽을 나눠 위치를 기억하고 돌아오기 쉽게 한다." },
      { slug: "load-more", difference: "무한 스크롤은 다가가면 저절로 불러오고, 더 보기는 사용자가 버튼을 눌러야 불러온다." },
    ],
    antiPattern: {
      title: "닿을 수 없는 바닥글",
      description:
        "목록 아래에 고객센터·약관 같은 바닥글을 두고 무한 스크롤을 걸면, 바닥글에 다가갈 때마다 새 글이 붙어 영영 닿지 못한다. 바닥글이 필요하면 일정 개수 뒤 '더 보기'로 바꾸거나 끝을 보여 준다.",
    },
    aiPrompt:
      "피드 목록에 무한 스크롤을 넣어 줘. 목록 끝의 감시 요소를 IntersectionObserver로 보고 다음 20개를 불러오며, 불러오는 동안 aria-busy와 로딩 표시를 하고 끝에 닿으면 '모두 봤어요'를 보여 줘.",
    code: {
      language: "tsx",
      snippet: `const sentinel = useRef<HTMLDivElement>(null);

useEffect(() => {
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && hasMore && !loading) loadMore();
  }, { rootMargin: "200px" }); // 끝에 닿기 조금 전에 미리 불러온다
  if (sentinel.current) io.observe(sentinel.current);
  return () => io.disconnect();
}, [hasMore, loading, loadMore]);

<ul aria-busy={loading}>{items.map((it) => <Item key={it.id} {...it} />)}</ul>
<div ref={sentinel} />
{loading && <Spinner />}
{!hasMore && <p>모두 봤어요</p>}
<p role="status" className="sr-only">{announce /* 예: "20개를 더 불러왔어요" */}</p>`,
    },
    sources: [
      { label: "NN/g — Infinite Scrolling: When to Use It, When to Avoid It", url: "https://www.nngroup.com/articles/infinite-scrolling/" },
      { label: "NN/g — Infinite Scrolling Tips", url: "https://www.nngroup.com/articles/infinite-scrolling-tips/" },
      { label: "ui-patterns.com — Continuous Scrolling", url: "https://ui-patterns.com/patterns/ContinuousScrolling" },
    ],
  },
  {
    slug: "load-more",
    category: "navigation",
    nameKo: "더 보기 버튼",
    nameEn: "Load more button",
    aliases: ["Load more", "See more", "Show more", "더보기", "더 불러오기"],
    oneLiner: "목록 아래 버튼을 누를 때마다 다음 묶음을 지금 목록 밑에 이어 붙이는 방식.",
    whenToUse: [
      "훑어보는 목록이지만 바닥글에도 닿을 수 있어야 할 때",
      "사용자가 언제 더 볼지 스스로 정하게 하고 싶을 때",
      "'12개 중 6개'처럼 남은 양을 함께 보여 줄 수 있을 때",
    ],
    confusedWith: [
      { slug: "infinite-scroll", difference: "더 보기는 버튼을 눌러야 불러오고, 무한 스크롤은 끝에 다가가면 저절로 불러온다." },
      { slug: "pagination", difference: "더 보기는 지금 목록 아래에 이어 붙이고, 페이지네이션은 목록을 다른 쪽으로 갈아 끼운다." },
    ],
    antiPattern: {
      title: "누를 때마다 목록 맨 위로 튕겨 가기",
      description:
        "더 보기를 누른 뒤 스크롤이나 포커스가 목록 맨 위로 돌아가면, 방금 보던 자리와 새로 붙은 항목을 다시 찾아 내려가야 한다. 새로 붙은 첫 항목으로 포커스를 옮기고 스크롤 위치는 지킨다.",
    },
    aiPrompt:
      "목록 아래에 '더 보기 (6/12)' 버튼을 만들어 줘. 누르면 다음 6개를 이어 붙이고, 새로 붙은 첫 항목으로 포커스를 옮기며, 다 불러오면 버튼 대신 '모두 봤어요'를 보여 줘.",
    code: {
      language: "tsx",
      snippet: `const [count, setCount] = useState(6);
const firstNew = useRef<HTMLLIElement>(null);
const [newFrom, setNewFrom] = useState<number | null>(null);

useEffect(() => { firstNew.current?.focus(); }, [newFrom]);

<ul>
  {items.slice(0, count).map((it, i) => (
    <li key={it.id} tabIndex={-1} ref={i === newFrom ? firstNew : undefined}>{it.name}</li>
  ))}
</ul>
{count < items.length ? (
  <button onClick={() => { setNewFrom(count); setCount(count + 6); }}>
    더 보기 ({count}/{items.length})
  </button>
) : (
  <p>모두 봤어요</p>
)}`,
    },
    sources: [
      { label: "NN/g — Infinite Scrolling: When to Use It, When to Avoid It", url: "https://www.nngroup.com/articles/infinite-scrolling/" },
      { label: "NN/g — Infinite Scrolling Tips", url: "https://www.nngroup.com/articles/infinite-scrolling-tips/" },
    ],
  },
  {
    slug: "accordion",
    category: "navigation",
    nameKo: "아코디언",
    nameEn: "Accordion",
    aliases: ["Collapsible", "Collapse", "Disclosure", "Expander", "Expandable", "접고 펼치기", "폴딩"],
    nameNote:
      "The Component Gallery는 Collapse, Collapsible sections, Details, Disclosure, Expander 등을 다른 이름으로 든다. 제목 하나만 접고 펼치면 Disclosure라 부르기도 한다.",
    oneLiner: "제목 줄만 세로로 쌓아 두고, 누른 항목의 내용만 그 자리에서 펼쳐 보여 주는 목록.",
    whenToUse: [
      "FAQ처럼 사용자가 몇 개 항목만 골라 읽으면 되는 긴 내용일 때",
      "모바일처럼 좁은 화면에서 긴 페이지를 짧게 훑게 하고 싶을 때",
      "대부분의 사람이 모든 내용을 읽어야 한다면 접지 않고 펼쳐 둔다",
    ],
    confusedWith: [
      { slug: "tabs", difference: "아코디언은 여러 항목을 세로로 쌓아 함께 펼칠 수 있고, 탭은 한 번에 한 묶음만 보여 준다." },
    ],
    antiPattern: {
      title: "작은 화살표만 눌리고, 하나를 열면 나머지가 닫힘",
      description:
        "제목 줄 전체가 아니라 작은 화살표만 누를 수 있으면 맞히기 어렵다. 또 하나를 열 때마다 다른 항목이 저절로 닫히면 두 답을 비교하던 사람이 맥락을 잃는다.",
    },
    aiPrompt:
      "FAQ를 아코디언으로 만들어 줘. 질문 줄 전체를 button으로 하고 aria-expanded와 aria-controls로 답 영역과 연결하며, 여러 개를 동시에 펼칠 수 있게 해 줘.",
    code: {
      language: "tsx",
      snippet: `function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div>
      <h3>
        <button aria-expanded={open} aria-controls={\`\${id}-panel\`} id={\`\${id}-btn\`}
          onClick={() => setOpen(!open)} className="flex w-full justify-between">
          {q}
          <ChevronIcon aria-hidden className={open ? "rotate-180" : ""} />
        </button>
      </h3>
      <div id={\`\${id}-panel\`} role="region" aria-labelledby={\`\${id}-btn\`} hidden={!open}>
        {a}
      </div>
    </div>
  );
}`,
    },
    sources: [
      { label: "NN/g — Accordions on Desktop", url: "https://www.nngroup.com/articles/accordions-on-desktop/" },
      { label: "NN/g — Accordions Are Not Always the Answer for Complex Content", url: "https://www.nngroup.com/articles/accordions-complex-content/" },
      { label: "The Component Gallery — Accordion", url: "https://component.gallery/components/accordion/" },
      { label: "WAI-ARIA APG — Accordion Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" },
    ],
  },
  {
    slug: "carousel",
    category: "navigation",
    nameKo: "캐러셀",
    nameEn: "Carousel",
    aliases: ["Content slider", "Slider", "Slideshow", "슬라이드 배너", "롤링 배너", "슬라이더"],
    nameNote:
      "The Component Gallery는 Content slider를 다른 이름으로 든다. 국내에서는 '슬라이더'라고도 부르지만, 이 도감의 '슬라이더'는 값을 끌어 고르는 입력(Slider)을 뜻한다.",
    oneLiner: "같은 자리에 여러 장의 콘텐츠를 겹쳐 두고, 한 장씩 옆으로 넘겨 보여 주는 영역.",
    whenToUse: [
      "같은 무게의 사진·상품 몇 장을 좁은 공간에서 차례로 보여 줄 때",
      "사용자가 직접 넘기는 것이 기본이고, 이전·다음과 '몇 번째 / 전체'를 보여 줄 수 있을 때",
      "자동으로 넘긴다면 충분히 느리게, 멈춤 버튼을 두고 마우스·포커스가 있으면 멈출 때",
    ],
    confusedWith: [
      { slug: "tabs", difference: "캐러셀은 같은 종류의 콘텐츠를 차례로 넘겨 보고, 탭은 성격이 다른 묶음을 이름으로 골라 본다." },
    ],
    antiPattern: {
      title: "멈출 수 없이 빠르게 넘어가는 자동 회전",
      description:
        "1.5초마다 넘어가고 멈춤·이전·다음 버튼도 없으면 글을 다 읽기 전에 사라지고, 원하는 장으로 돌아갈 수 없다. 움직임에 민감한 사람에게도 부담이다.",
    },
    aiPrompt:
      "홈 상단 배너를 캐러셀로 만들어 줘. 이전·다음·멈춤 버튼과 '1 / 3' 표시를 두고, aria-roledescription=\"carousel\"과 각 장에 \"slide\"를 달며, 자동 넘김은 5초 간격에 마우스·포커스가 있으면 멈추게 해 줘.",
    code: {
      language: "tsx",
      snippet: `const [i, setI] = useState(0);
const [paused, setPaused] = useState(false);

useEffect(() => {
  if (paused) return;
  const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5000);
  return () => clearInterval(t);
}, [paused, slides.length]);

<section aria-roledescription="carousel" aria-label="이번 주 소식"
  onMouseEnter={() => setPaused(true)} onFocus={() => setPaused(true)}>
  <button onClick={() => setPaused(!paused)}>{paused ? "자동 넘김 시작" : "멈춤"}</button>
  <div aria-live={paused ? "polite" : "off"}>
    <div role="group" aria-roledescription="slide" aria-label={\`\${i + 1} / \${slides.length}\`}>
      {slides[i]}
    </div>
  </div>
  <button aria-label="이전 슬라이드" onClick={() => setI((i - 1 + slides.length) % slides.length)}>‹</button>
  <button aria-label="다음 슬라이드" onClick={() => setI((i + 1) % slides.length)}>›</button>
</section>`,
    },
    sources: [
      { label: "NN/g — Designing Effective Carousels", url: "https://www.nngroup.com/articles/designing-effective-carousels/" },
      { label: "The Component Gallery — Carousel", url: "https://component.gallery/components/carousel/" },
      { label: "WAI-ARIA APG — Carousel Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/" },
    ],
  },
  {
    slug: "mega-menu",
    category: "navigation",
    nameKo: "메가 메뉴",
    nameEn: "Mega menu",
    aliases: ["Mega dropdown", "대형 드롭다운 메뉴", "전체 메뉴", "Mega navigation"],
    oneLiner: "메뉴 하나를 열면 넓은 패널에 하위 카테고리를 묶음별 제목과 함께 한꺼번에 펼쳐 보여 주는 내비게이션.",
    whenToUse: [
      "쇼핑몰·포털처럼 하위 항목이 많아 일반 드롭다운으로는 길게 늘어질 때",
      "하위 항목을 '가전·주방·생활'처럼 묶음 제목으로 나눠 한눈에 훑게 하고 싶을 때",
      "누르면 열리고(마우스는 약간 늦게 열고 늦게 닫기), 키보드로도 열고 Esc로 닫을 수 있게 할 때",
    ],
    confusedWith: [
      {
        slug: "dropdown-menu",
        difference: "드롭다운 메뉴는 동작 몇 개를 세로 목록으로, 메가 메뉴는 이동할 곳 수십 개를 묶음별 넓은 패널로 보여 준다.",
      },
      {
        slug: "drawer",
        difference: "메가 메뉴는 데스크톱 상단 메뉴 아래로 넓게 펼쳐지고, 드로어는 화면 옆에서 밀려 나오는 패널이다.",
      },
    ],
    antiPattern: {
      title: "마우스를 올려야만 열리고, 옮기는 사이 닫히는 메가 메뉴",
      description:
        "마우스를 올리는 순간 열리고 벗어나는 순간 닫히면, 메뉴 바와 패널 사이를 대각선으로 지나가다 닫혀 버린다. 버튼이 아니라 글자라서 키보드 사용자는 아예 열 수 없다.",
    },
    aiPrompt:
      "상단 '카테고리' 버튼을 누르면 아래로 넓은 메가 메뉴 패널이 열리고, 묶음별 제목(h3)과 링크 목록을 3열로 보여 줘. 버튼에 aria-expanded를 달고, Esc나 바깥 클릭으로 닫히면 포커스를 버튼으로 돌려줘. 마우스 호버는 150ms 늦게 열고 350ms 늦게 닫아 줘.",
    code: {
      language: "tsx",
      snippet: `const [open, setOpen] = useState(false);
const t = useRef<number>();
const later = (fn: () => void, ms: number) => {
  clearTimeout(t.current);
  t.current = window.setTimeout(fn, ms);
};

<div
  onMouseEnter={() => later(() => setOpen(true), 150)}   // 늦게 열고
  onMouseLeave={() => later(() => setOpen(false), 350)}  // 더 늦게 닫는다
  onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
>
  <button aria-expanded={open} aria-controls="mega" onClick={() => setOpen(!open)}>
    카테고리
  </button>
  {open && (
    <div id="mega" className="absolute inset-x-0 top-full grid grid-cols-3">
      {groups.map((g) => (
        <section key={g.title}>
          <h3>{g.title}</h3>
          <ul>{g.links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
        </section>
      ))}
    </div>
  )}
</div>`,
    },
    sources: [
      { label: "NN/g — Mega Menus Work Well for Site Navigation", url: "https://www.nngroup.com/articles/mega-menus-work-well/" },
      { label: "WAI-ARIA APG — Menu Button Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" },
    ],
  },
  {
    slug: "page-control",
    category: "navigation",
    nameKo: "페이지 인디케이터",
    nameEn: "Page control",
    aliases: ["Page indicator", "Dot indicator", "Pagination dots", "점 인디케이터", "도트 인디케이터", "도트"],
    nameNote:
      "Apple HIG는 Page control이라고 부른다. 실무에서는 점 모양 때문에 도트, 페이지 인디케이터라고 많이 부른다. 번호를 눌러 페이지를 옮기는 페이지네이션과는 다른 패턴이다.",
    oneLiner: "넘겨 보는 화면이 몇 장이고 지금 몇 번째인지를 줄지어 놓인 점으로 알려 주는 표시.",
    whenToUse: [
      "온보딩 소개 화면, 사진 넘기기처럼 몇 장 안 되는 화면을 옆으로 넘겨 볼 때",
      "장 수가 적어(대략 열 장 아래) 점 하나하나가 구분될 때",
      "점만으로는 넘길 수 있다는 걸 알기 어려우니 끌기와 함께 이전·다음 버튼이나 키보드 방법도 줄 때",
    ],
    confusedWith: [
      {
        slug: "pagination",
        difference: "페이지 인디케이터는 몇 장 중 몇 번째인지 점으로 알려 주고, 페이지네이션은 번호를 눌러 많은 결과 페이지를 오간다.",
      },
      {
        slug: "carousel",
        difference: "캐러셀은 여러 장을 넘겨 보여 주는 영역 전체이고, 페이지 인디케이터는 그 안에서 위치를 알려 주는 점이다.",
      },
    ],
    antiPattern: {
      title: "구분되지 않는 작은 점 12개",
      description:
        "장 수가 많은데 작은 점을 그대로 늘어놓고 지금 위치도 흐리게 칠하면, 몇 번째인지 셀 수가 없다. 점을 누를 수도 없고 끌기만 되면 넘긴다는 사실조차 모른다.",
    },
    aiPrompt:
      "온보딩 화면 3장을 옆으로 끌어 넘기게 하고, 아래에 페이지 인디케이터 점을 넣어 줘. 지금 점은 길게 강조하고 aria-current를 달고, 점과 이전·다음 버튼을 눌러도 이동하며 ←/→ 키로도 넘기게 해 줘.",
    code: {
      language: "tsx",
      snippet: `function Dots({ count, index, onGo }: { count: number; index: number; onGo: (i: number) => void }) {
  return (
    <div className="flex gap-1.5" aria-label={\`\${count}장 중 \${index + 1}번째\`}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          aria-label={\`\${i + 1}번째 화면\`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => onGo(i)}
          className="grid size-6 place-items-center"   // 누르기 쉽게 터치 영역은 넉넉히
        >
          <span className={i === index ? "h-2 w-5 rounded-full bg-accent" : "size-2 rounded-full bg-gray-300"} />
        </button>
      ))}
    </div>
  );
}`,
    },
    sources: [
      { label: "Apple HIG — Page controls", url: "https://developer.apple.com/design/human-interface-guidelines/page-controls" },
      { label: "WAI-ARIA APG — Carousel Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/" },
    ],
  },
  {
    slug: "faceted-filter",
    category: "navigation",
    nameKo: "필터·패싯 검색",
    nameEn: "Faceted filters",
    aliases: ["Facets", "Faceted search", "Faceted navigation", "Filters", "필터", "패싯 내비게이션", "검색 필터"],
    nameNote:
      "NN/g는 필터(결과를 좁히는 조건 전반)와 패싯(지역·가격·편의처럼 항목의 속성에서 나온 여러 기준을 함께 고르는 필터)을 나눠 설명한다. 국내 실무에서는 대개 둘 다 '필터'라고 부른다.",
    oneLiner: "지역·가격·편의 같은 여러 기준을 함께 골라 결과 목록을 좁혀 가는 검색 방식.",
    whenToUse: [
      "상품·장소·매물처럼 속성이 여러 가지인 많은 결과를 좁혀야 할 때",
      "옵션 옆에 고르면 남을 개수를 보여 주어 결과가 0건이 되는 조합을 피하게 할 때",
      "적용한 조건을 칩으로 모아 보여 주고, 하나씩 또는 한꺼번에 지울 수 있게 할 때",
    ],
    confusedWith: [
      {
        slug: "chip",
        difference: "칩은 조건 하나를 켜고 끄는 작은 버튼이고, 패싯 필터는 그런 조건 여러 묶음으로 결과를 좁히는 검색 방식 전체다.",
      },
      {
        slug: "autocomplete",
        difference: "자동완성은 입력하는 글자로 후보를 좁히고, 패싯 필터는 미리 정해진 속성을 골라 결과를 좁힌다.",
      },
    ],
    antiPattern: {
      title: "고를 때마다 앞의 선택이 풀리고 결과 수를 모르는 필터",
      description:
        "하나를 고르면 다른 조건이 초기화되고, 옵션마다 몇 건이 남는지도 보이지 않으면 사용자는 '0건'을 만날 때까지 눌러 보며 헤맨다. 지금 어떤 조건이 걸렸는지 요약도 없다.",
    },
    aiPrompt:
      "장소 목록에 지역·편의 패싯 필터를 만들어 줘. 지역 안에서는 '또는', 묶음 사이는 '그리고'로 거르고, 옵션 옆에 고르면 남을 개수를 보여 줘. 적용한 조건은 지울 수 있는 칩과 '모두 지우기'로 보여 주고, 결과 수는 role=\"status\"로 알려 줘.",
    code: {
      language: "ts",
      snippet: `type Sel = { area: string[]; feature: string[] };

function match(p: Place, s: Sel) {
  const areaOk = s.area.length === 0 || s.area.includes(p.area);   // 같은 묶음: 또는
  const featOk = s.feature.every((f) => p.features.includes(f));   // 다른 묶음: 그리고
  return areaOk && featOk;
}

// 이 옵션을 더 고르면 몇 건이 남는지
function countIf(places: Place[], s: Sel, facet: keyof Sel, option: string) {
  const next = { ...s, [facet]: [...s[facet], option] };
  return places.filter((p) => match(p, next)).length;
}`,
    },
    sources: [
      { label: "NN/g — Filters vs. Facets: Definitions", url: "https://www.nngroup.com/articles/filters-vs-facets/" },
      { label: "NN/g — User Intent Affects Filter Design", url: "https://www.nngroup.com/articles/applying-filters/" },
    ],
  },
];
