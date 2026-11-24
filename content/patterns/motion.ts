import type { Pattern } from "../types";

export const motionPatterns: Pattern[] = [
  {
    slug: "parallax",
    category: "motion",
    nameKo: "패럴랙스 스크롤",
    nameEn: "Parallax scrolling",
    aliases: ["Parallax", "시차 스크롤", "패럴렉스", "패럴랙스"],
    oneLiner: "스크롤할 때 배경과 앞쪽 요소가 서로 다른 속도로 움직여 깊이감을 주는 효과.",
    whenToUse: [
      "이야기를 보여 주는 소개·캠페인 페이지의 표지처럼, 분위기가 정보보다 중요한 곳에서 한두 군데만",
      "배경 그림만 느리게 움직이고 글자와 버튼은 보통 속도로 두어 읽기를 방해하지 않을 때",
      "동작 줄이기(prefers-reduced-motion) 설정이면 효과를 끄고 평범한 스크롤로 보여 줄 때",
    ],
    confusedWith: [
      {
        slug: "carousel",
        difference: "패럴랙스는 스크롤에 따라 층마다 속도가 다른 효과이고, 캐러셀은 여러 장의 콘텐츠를 한 자리에서 넘겨 보는 컴포넌트다.",
      },
      {
        slug: "hide-on-scroll",
        difference: "둘 다 스크롤에 반응하지만, 패럴랙스는 장식 효과이고 숨는 헤더는 화면 공간을 내주기 위한 기능이다.",
      },
    ],
    antiPattern: {
      title: "글자까지 제각각 움직이는 과한 패럴랙스",
      description:
        "제목과 목록까지 다른 속도·방향으로 움직이면 읽기 어렵고 어지럼증을 일으킬 수 있다. 동작 줄이기 설정도 무시하면 전정 장애가 있는 사용자에게 특히 해롭다. 효과는 배경 한 층에만 약하게 준다.",
    },
    aiPrompt:
      "페이지 표지 배경만 스크롤 속도의 절반으로 움직이는 패럴랙스 효과를 넣어 줘. 글자는 움직이지 말고, prefers-reduced-motion이면 효과를 꺼 줘.",
    code: {
      language: "tsx",
      snippet: `import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

function Hero() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  // 스크롤 400px 동안 배경은 200px만 움직인다(절반 속도)
  const y = useTransform(scrollY, [0, 400], [0, reduce ? 0 : 200]);

  return (
    <section className="relative h-80 overflow-hidden">
      <motion.img src="/hero.jpg" alt="" style={{ y }} className="absolute inset-0 h-[130%] w-full object-cover" />
      <h1 className="relative">제주 동쪽 한 바퀴</h1>{/* 글자는 보통 속도 */}
    </section>
  );
}`,
    },
    sources: [
      { label: "NN/g — What Parallax Lacks", url: "https://www.nngroup.com/articles/parallax-usability/" },
      { label: "NN/g — The Role of Animation and Motion in UX", url: "https://www.nngroup.com/articles/animation-purpose-ux/" },
    ],
  },
  {
    slug: "sticky-header",
    category: "motion",
    nameKo: "고정 헤더",
    nameEn: "Sticky header",
    aliases: ["Persistent header", "Fixed header", "스티키 헤더", "Sticky section header", "상단 고정"],
    nameNote:
      "NN/g는 스크롤해도 늘 보이는 헤더를 persistent header(지속 헤더)라고 부르고, 개발에서는 CSS position: sticky에서 온 sticky header라는 말을 많이 쓴다.",
    oneLiner: "스크롤해도 화면 위쪽에 붙어 있어 제목·검색·주요 메뉴를 늘 쓸 수 있게 하는 헤더.",
    whenToUse: [
      "긴 목록이나 문서에서 검색·필터·메뉴를 자주 다시 써야 할 때",
      "높이를 낮게 유지해 내용이 가려지지 않을 때(작은 화면이면 더 낮게)",
      "스크롤된 뒤에는 그림자나 선으로 헤더와 내용의 경계를 보여 줄 때",
    ],
    confusedWith: [
      {
        slug: "hide-on-scroll",
        difference: "고정 헤더는 항상 보이고, 숨는 헤더는 내릴 때 사라졌다가 올릴 때 다시 나타난다.",
      },
      {
        slug: "tab-bar",
        difference: "고정 헤더는 위에서 현재 화면의 제목·도구를 붙잡아 두고, 하단 탭 바는 아래에서 앱의 주요 구역을 오간다.",
      },
    ],
    antiPattern: {
      title: "화면 절반을 차지하는 고정 헤더",
      description:
        "로고 배너, 광고 띠, 검색창, 탭까지 모두 고정하면 작은 화면에서는 내용이 몇 줄밖에 보이지 않는다. 늘 필요한 것만 남기고 높이를 줄인다.",
    },
    aiPrompt:
      "목록 화면의 헤더를 position: sticky로 위에 고정해 줘. 높이는 44px 정도로 낮게 하고, 스크롤되면 아래쪽에 옅은 그림자를 보여 줘.",
    code: {
      language: "tsx",
      snippet: `function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={\`sticky top-0 z-10 h-11 bg-white \${scrolled ? "shadow-sm" : ""}\`}
    >
      <h1>메모</h1>
      <button aria-label="메모 검색"><SearchIcon /></button>
    </header>
  );
}`,
    },
    sources: [
      { label: "NN/g — Sticky Headers: 5 Ways to Make Them Better", url: "https://www.nngroup.com/articles/sticky-headers/" },
      { label: "Material Design 3 — Top app bar", url: "https://m3.material.io/components/top-app-bar/overview" },
    ],
  },
  {
    slug: "hide-on-scroll",
    category: "motion",
    nameKo: "스크롤 시 숨는 헤더",
    nameEn: "Hide-on-scroll header",
    aliases: ["Partially persistent header", "Quick return", "Scroll-away app bar", "스크롤 반응 헤더", "숨는 헤더"],
    nameNote:
      "NN/g는 이것을 partially persistent header(부분 지속 헤더)라고 부른다. Material 3의 Top app bar는 스크롤할 때 막대가 어떻게 반응하는지를 다룬다. Quick return은 개발자들 사이에서 쓰는 비공식 이름이다.",
    oneLiner: "아래로 스크롤하면 헤더가 숨어 내용 공간을 넓히고, 조금만 위로 올려도 다시 나타나는 헤더.",
    whenToUse: [
      "작은 화면에서 내용을 넓게 보여 주면서도 메뉴는 곧바로 다시 꺼낼 수 있어야 할 때",
      "위로 조금만 스크롤해도(맨 위까지 가지 않아도) 헤더가 돌아오게 할 때",
      "숨고 나타나는 움직임을 짧고 부드럽게(0.2초 안팎) 할 때",
    ],
    confusedWith: [
      {
        slug: "sticky-header",
        difference: "숨는 헤더는 내릴 때 사라지고 올릴 때 돌아오며, 고정 헤더는 언제나 그 자리에 있다.",
      },
    ],
    antiPattern: {
      title: "맨 위까지 올라가야만 돌아오는 헤더",
      description:
        "한번 숨은 헤더가 페이지 맨 위에 닿아야만 다시 나타나면, 메뉴를 쓰려는 사용자가 긴 페이지를 끝까지 거슬러 올라가야 한다. 위로 스크롤하는 순간 바로 보여 준다.",
    },
    aiPrompt:
      "아래로 스크롤하면 상단 헤더가 위로 숨고, 위로 조금이라도 스크롤하면 바로 다시 내려오게 해 줘. 맨 위 근처에서는 항상 보이게 하고, 움직임은 0.2초로 짧게 해 줘.",
    code: {
      language: "tsx",
      snippet: `function useHideOnScroll(threshold = 44) {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - last.current;
      last.current = y;
      if (y < threshold) setHidden(false);
      else if (d > 4) setHidden(true);   // 내릴 때 숨김
      else if (d < -4) setHidden(false); // 조금만 올려도 다시 보임
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return hidden;
}

<header className={\`fixed top-0 transition-transform duration-200 \${hidden ? "-translate-y-full" : ""}\`} />`,
    },
    sources: [
      { label: "NN/g — Sticky Headers: 5 Ways to Make Them Better (Partially Persistent Headers)", url: "https://www.nngroup.com/articles/sticky-headers/" },
      { label: "Material Design 3 — Top app bar", url: "https://m3.material.io/components/top-app-bar/overview" },
    ],
  },
  {
    slug: "back-to-top",
    category: "motion",
    nameKo: "맨 위로 버튼",
    nameEn: "Back to top button",
    aliases: ["Scroll to top", "Top button", "탑 버튼", "맨 위로 가기", "Back-to-top link"],
    oneLiner: "긴 페이지를 한참 내려간 뒤 나타나, 누르면 페이지 맨 위로 한 번에 돌려보내는 버튼.",
    whenToUse: [
      "화면 여러 장(대략 4~5화면 이상)에 걸치는 긴 페이지나 목록",
      "어느 정도 내려간 뒤에만 나타나게 해 처음 화면을 가리지 않을 때",
      "구석에 작게 두고, 누른 뒤에는 키보드 포커스도 맨 위로 옮길 때",
    ],
    confusedWith: [
      {
        slug: "fab",
        difference: "둘 다 떠 있는 둥근 버튼이지만, 맨 위로 버튼은 위치를 옮기는 탐색용이고 FAB는 화면의 주된 행동(새로 만들기 등)을 한다.",
      },
      {
        slug: "infinite-scroll",
        difference: "무한 스크롤로 길어진 목록에서 맨 위로 버튼이 함께 쓰이는 경우가 많다. 하나는 내용을 이어 붙이고, 다른 하나는 처음으로 돌아간다.",
      },
    ],
    antiPattern: {
      title: "처음부터 떠서 내용을 가리는 큰 버튼",
      description:
        "스크롤하지 않았는데도 커다란 버튼이 떠 있으면 내용을 가리고, 눌러도 키보드 포커스가 아래에 남아 있으면 스크린리더 사용자는 맨 위로 갔는지 알 수 없다.",
    },
    aiPrompt:
      "스크롤이 화면 높이의 2배를 넘으면 오른쪽 아래에 '맨 위로' 버튼(aria-label 포함)을 보여 줘. 누르면 부드럽게 맨 위로 스크롤하고(reduced-motion이면 즉시), 페이지 제목에 포커스를 옮겨 줘.",
    code: {
      language: "tsx",
      snippet: `function BackToTop({ topRef }: { topRef: RefObject<HTMLElement> }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 2);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <button
      aria-label="맨 위로"
      className="fixed bottom-6 right-6 size-11 rounded-full"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        topRef.current?.focus({ preventScroll: true }); // h1 tabIndex={-1}
      }}
    >↑</button>
  );
}`,
    },
    sources: [
      { label: "NN/g — Back-to-Top Button Design Guidelines", url: "https://www.nngroup.com/articles/back-to-top/" },
    ],
  },
  {
    slug: "container-transform",
    category: "motion",
    nameKo: "컨테이너 트랜스폼",
    nameEn: "Container transform",
    aliases: ["Shared element transition", "공유 요소 전환", "Hero animation", "Morph transition", "카드 확장 전환"],
    nameNote:
      "Material Design은 전환 패턴 중 하나로 container transform이라 부른다. 안드로이드의 shared element transition, Flutter의 hero animation은 같은 생각을 구현하는 개발 쪽 이름이다.",
    oneLiner: "누른 카드나 버튼이 그 자리에서 커지며 다음 화면이 되어, 두 화면이 이어져 있음을 보여 주는 전환.",
    whenToUse: [
      "목록의 카드를 눌러 그 항목의 상세 화면으로 들어갈 때",
      "닫으면 같은 길로 원래 카드 자리로 돌아가 사용자가 위치를 잃지 않게 할 때",
      "움직임을 짧게(0.3~0.5초) 하고, 동작 줄이기 설정이면 단순한 페이드로 바꿀 때",
    ],
    confusedWith: [
      {
        slug: "modal",
        difference: "컨테이너 트랜스폼은 '어떻게 열리는지'에 대한 전환이고, 모달은 '흐름을 막는 창'이라는 구조다. 모달도 이 전환으로 열 수 있다.",
      },
      {
        slug: "fullscreen-overlay",
        difference: "전체 화면 오버레이는 화면 전체를 덮는 층 자체이고, 컨테이너 트랜스폼은 작은 요소가 그 크기로 자라나는 움직임이다.",
      },
    ],
    antiPattern: {
      title: "누른 카드와 상관없이 옆에서 밀려 오는 전환",
      description:
        "어떤 카드를 눌러도 상세 화면이 오른쪽에서 느리게 밀려 들어오면, 두 화면의 관계가 보이지 않고 기다리는 시간만 길어진다. 누른 요소에서 시작해 그 자리로 돌아가게 한다.",
    },
    aiPrompt:
      "앨범 카드를 누르면 그 카드가 커지며 상세 화면이 되는 container transform 전환을 motion의 layoutId로 만들어 줘. 상세 화면은 role=\"dialog\"로 하고, 뒤로 버튼과 Esc로 닫으면 원래 카드로 줄어들게 해 줘.",
    code: {
      language: "tsx",
      snippet: `import { AnimatePresence, motion } from "motion/react";

function Albums({ albums }: { albums: Album[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const album = albums.find((a) => a.id === open);

  return (
    <>
      {albums.map((a) => (
        <motion.button key={a.id} layoutId={a.id} onClick={() => setOpen(a.id)}>
          {a.title}
        </motion.button>
      ))}
      <AnimatePresence>
        {album && (
          // 같은 layoutId → 카드가 이 자리까지 자라난다
          <motion.div layoutId={album.id} role="dialog" aria-modal="true" className="fixed inset-0">
            <button onClick={() => setOpen(null)} aria-label="뒤로">←</button>
            <h2>{album.title}</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}`,
    },
    sources: [
      { label: "Material Design 3 — Transition patterns (Container transform)", url: "https://m3.material.io/styles/motion/transitions/transition-patterns" },
      { label: "NN/g — The Role of Animation and Motion in UX", url: "https://www.nngroup.com/articles/animation-purpose-ux/" },
    ],
  },
  {
    slug: "ripple",
    category: "motion",
    nameKo: "눌림 효과",
    nameEn: "Ripple (state layer)",
    aliases: ["Ripple effect", "Ink ripple", "State layer", "리플 효과", "Press state", "Touch feedback", "물결 효과"],
    nameNote:
      "Material 3는 누름·마우스 올림·포커스 같은 상태를 요소 위에 얹는 반투명 층(state layer)으로 표현하고, 누를 때 그 자리에서 퍼지는 물결(ripple)을 함께 쓴다. Apple은 물결 대신 살짝 어두워지거나 밝아지는 강조(highlight)를 쓴다.",
    oneLiner: "버튼이나 목록을 누르는 순간 그 자리에 물결이나 옅은 색 층을 보여 '눌렸다'고 바로 알려 주는 피드백.",
    whenToUse: [
      "누른 뒤 결과가 나오기까지 아주 잠깐이라도 틈이 있는 버튼·목록 줄",
      "터치 화면처럼 손가락이 버튼을 가려 눌렸는지 보기 어려울 때",
      "물결은 거들 뿐, 체크 표시·화면 이동 같은 실제 결과도 함께 보여 줄 때",
    ],
    confusedWith: [
      {
        slug: "optimistic-ui",
        difference: "둘 다 즉시 반응하지만, 눌림 효과는 '눌렸다'는 표시이고 낙관적 업데이트는 '결과'를 서버 응답 전에 미리 보여 주는 것이다.",
      },
      {
        slug: "toggle-switch",
        difference: "눌림 효과는 어떤 버튼에도 붙는 순간 피드백이고, 토글 스위치는 켬·끔 상태를 계속 보여 주는 컨트롤이다.",
      },
    ],
    antiPattern: {
      title: "누른 표시가 없고 반응도 늦은 버튼",
      description:
        "눌러도 아무 표시가 없고 결과가 1초 가까이 늦게 나오면, 사용자는 안 눌린 줄 알고 다시 누른다. 그 결과 설정이 두 번 바뀌어 원래대로 돌아가 버리기도 한다.",
    },
    aiPrompt:
      "목록 줄을 누르면 누른 자리에서 원이 퍼지는 ripple과, 누르는 동안 옅게 어두워지는 state layer를 넣어 줘. 키보드로 누르면 가운데에서 퍼지게 하고, reduced-motion이면 물결 없이 색만 바뀌게 해 줘.",
    code: {
      language: "tsx",
      snippet: `function RippleButton({ children, onClick }: Props) {
  const [waves, setWaves] = useState<{ id: number; x: number; y: number }[]>([]);
  return (
    <button
      className="relative overflow-hidden active:bg-black/10" // state layer
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const kb = e.detail === 0; // 키보드로 누름
        const x = kb ? r.width / 2 : e.clientX - r.left;
        const y = kb ? r.height / 2 : e.clientY - r.top;
        setWaves((w) => [...w, { id: Date.now(), x, y }]);
        onClick?.();
      }}
    >
      {children}
      {waves.map((w) => (
        <span key={w.id} className="ripple" style={{ left: w.x, top: w.y }}
          onAnimationEnd={() => setWaves((all) => all.filter((x) => x.id !== w.id))} />
      ))}
    </button>
  );
}
/* .ripple { position:absolute; width:8px; height:8px; border-radius:50%;
   background:currentColor; opacity:.25; transform:translate(-50%,-50%) scale(0);
   animation: ripple .5s ease-out forwards }
   @keyframes ripple { to { transform:translate(-50%,-50%) scale(40); opacity:0 } } */`,
    },
    sources: [
      { label: "Material Design 3 — States", url: "https://m3.material.io/foundations/interaction/states/overview" },
      { label: "Material Design 3 — State layers", url: "https://m3.material.io/foundations/interaction/states/state-layers" },
    ],
  },
  {
    slug: "splash-screen",
    category: "motion",
    nameKo: "스플래시 화면",
    nameEn: "Splash screen",
    aliases: ["Launch screen", "Launch image", "런치 스크린", "스플래시", "시작 화면"],
    nameNote:
      "Apple HIG는 Launch screen이라 부르고, 앱이 빨리 뜨는 것처럼 느끼도록 첫 화면과 거의 같은 모습으로 만들라고 권한다. 브랜드 광고처럼 쓰는 것은 권하지 않는다.",
    oneLiner: "앱을 켠 직후 첫 화면이 준비될 때까지 잠깐 보이는 시작 화면.",
    whenToUse: [
      "앱이 실행되는 아주 짧은 시간을 채워야 할 때(가능한 한 짧게)",
      "첫 화면의 뼈대(상단 막대, 하단 탭)와 똑같이 만들어 준비되면 내용만 채워지게 할 때",
      "글자·광고를 넣지 않아 다국어·다크 모드에서도 어색하지 않게 할 때",
    ],
    confusedWith: [
      {
        slug: "skeleton",
        difference: "스플래시 화면은 앱을 켤 때 한 번 보이는 시작 화면이고, 스켈레톤은 화면 안에서 내용이 오기 전 자리를 잡아 두는 회색 틀이다.",
      },
      {
        slug: "fullscreen-overlay",
        difference: "스플래시는 앱 실행 중에만 잠깐 보이는 화면이고, 전체 화면 오버레이는 사용하는 도중에 띄워 작업을 맡기는 층이다.",
      },
    ],
    antiPattern: {
      title: "몇 초씩 붙잡아 두는 브랜드 광고 스플래시",
      description:
        "로고와 슬로건, 광고를 몇 초 동안 보여 준 뒤 전혀 다른 배치의 첫 화면으로 툭 바뀌면, 앱이 느리게 느껴지고 화면이 끊겨 보인다.",
    },
    aiPrompt:
      "앱 시작 화면을 첫 화면과 같은 뼈대(상단 막대와 하단 탭, 글자 없음)로 만들고, 데이터가 준비되면 그 위에 내용만 서서히 나타나게 해 줘. 광고나 로딩 시간을 일부러 늘리지 마.",
    code: {
      language: "tsx",
      snippet: `// 웹 앱이라면: 첫 HTML에 앱 뼈대를 그대로 그려 두고, 준비되면 내용만 채운다
function App() {
  const { data, isLoading } = useFeed();
  return (
    <div className="app">
      <header className="h-11 border-b">{!isLoading && "오늘의 레시피"}</header>
      <main>{isLoading ? null : <Feed items={data} />}</main>
      <nav className="h-12 border-t">{!isLoading && <Tabs />}</nav>
    </div>
  );
}

// iOS: Info.plist의 UILaunchScreen 또는 LaunchScreen.storyboard에
// 첫 화면과 같은 배경색·막대만 두고 글자는 넣지 않는다.`,
    },
    sources: [
      { label: "Apple HIG — Launching", url: "https://developer.apple.com/design/human-interface-guidelines/launching" },
    ],
  },
];
