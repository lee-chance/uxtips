import type { Pattern } from "../types";

export const contentPatterns: Pattern[] = [
  {
    slug: "empty-state",
    category: "content",
    nameKo: "빈 상태",
    nameEn: "Empty state",
    aliases: ["Zero state", "Blank slate", "엠티 스테이트", "데이터 없음 화면", "빈 화면"],
    oneLiner: "보여 줄 내용이 아직 없을 때, 왜 비었는지와 무엇을 하면 채워지는지를 알려 주는 화면.",
    whenToUse: [
      "처음 써서 목록이 비어 있을 때 이 화면이 무엇을 하는 곳인지 알려 주고 첫 행동으로 이끌 때",
      "검색·필터 결과가 없을 때 조건을 바꾸거나 지우는 길을 줄 때",
      "할 일을 다 끝내 비었을 때 '다 했다'는 것을 알려 줄 때",
    ],
    confusedWith: [
      { slug: "skeleton", difference: "스켈레톤은 내용이 '오는 중'일 때, 빈 상태는 불러왔는데 '없을' 때 보여 준다." },
      { slug: "error-message", difference: "빈 상태는 정상적으로 내용이 없는 것이고, 오류 메시지는 불러오기가 실패한 것이다." },
    ],
    antiPattern: {
      title: "'데이터가 없습니다'만 덩그러니",
      description:
        "회색 글자 한 줄만 있으면 사용자는 오류인지, 아직 안 불러온 건지, 무엇을 해야 하는지 알 수 없다. 왜 비었는지와 다음에 누를 버튼을 함께 둔다.",
    },
    aiPrompt:
      "즐겨찾기 목록이 비었을 때 아이콘, '아직 즐겨찾기한 장소가 없어요' 제목, 한 줄 설명, '장소 둘러보기' 버튼이 있는 빈 상태를 보여 줘. 검색 결과가 없을 때는 '검색어 지우기' 버튼을 대신 보여 줘.",
    code: {
      language: "tsx",
      snippet: `function EmptyState({ title, body, action }: {
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <Icon aria-hidden className="size-12 text-accent" />
      <h2 className="mt-3 font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{body}</p>
      {action && (
        <button className="mt-4 btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

{places.length === 0
  ? <EmptyState title="아직 즐겨찾기한 장소가 없어요" body="별을 누르면 여기에 모여요."
      action={{ label: "장소 둘러보기", onClick: goExplore }} />
  : <PlaceList places={places} />}`,
    },
    sources: [
      { label: "NN/g — Designing Empty States in Complex Applications: 3 Guidelines", url: "https://www.nngroup.com/articles/empty-state-interface-design/" },
      { label: "The Component Gallery — Empty state", url: "https://component.gallery/components/empty-state/" },
    ],
  },
  {
    slug: "swipe-actions",
    category: "content",
    nameKo: "스와이프 액션",
    nameEn: "Swipe actions",
    aliases: ["Contextual swipe", "Swipe to delete", "밀어서 삭제", "Swipe gesture", "스와이프 삭제"],
    nameNote:
      "NN/g는 목록 항목을 옆으로 밀어 그 항목에 대한 동작을 꺼내는 방식을 '맥락 동작을 꺼내는 스와이프(swipe to trigger contextual actions)'로 다룬다(글 주소도 contextual-swipe). Apple HIG는 제스처 항목에서 스와이프를 다룬다. 국내에서는 흔히 '밀어서 삭제'라고 부른다.",
    oneLiner: "목록의 한 줄을 옆으로 밀면 그 항목에 쓸 수 있는 동작(보관·삭제 등)이 드러나는 방식.",
    whenToUse: [
      "메일·알림처럼 항목마다 같은 동작을 자주, 빠르게 반복하는 목록일 때",
      "밀기는 지름길일 뿐이므로, 같은 동작을 버튼이나 메뉴로도 할 수 있게 둘 때",
      "삭제처럼 되돌리기 어려운 동작에는 되돌리기나 확인을 함께 줄 때",
    ],
    confusedWith: [
      { slug: "action-sheet", difference: "스와이프 액션은 그 줄 옆에 바로 동작을 꺼내고, 액션시트는 화면 아래에 동작 목록 창을 띄운다." },
      { slug: "undo", difference: "스와이프는 동작을 빨리 하는 방법이고, 되돌리기는 그 동작을 취소할 기회를 주는 장치다." },
    ],
    antiPattern: {
      title: "밀어야만 지울 수 있고, 지우면 끝",
      description:
        "밀 수 있다는 표시도 다른 방법도 없으면 사용자는 기능을 찾지 못하고, 실수로 끝까지 밀면 되돌릴 수 없이 사라진다. 눈에 보이는 버튼과 되돌리기를 함께 둔다.",
    },
    aiPrompt:
      "메일 목록의 각 줄을 왼쪽으로 밀면 '보관', '삭제' 버튼이 드러나게 해 줘. 같은 동작을 줄 끝의 ··· 버튼으로도 열 수 있게 하고, 삭제하면 6초 동안 '되돌리기' 스낵바를 보여 줘.",
    code: {
      language: "tsx",
      snippet: `import { motion, useAnimationControls } from "motion/react";

function SwipeRow({ title, onDelete }: { title: string; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const controls = useAnimationControls();
  useEffect(() => { controls.start({ x: open ? -128 : 0 }); }, [open, controls]);

  return (
    <li className="relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 flex" aria-hidden={!open}>
        <button tabIndex={open ? 0 : -1} onClick={onDelete}>삭제</button>
      </div>
      <motion.div
        drag="x" dragConstraints={{ left: -128, right: 0 }} animate={controls}
        onDragEnd={(_, i) => { const o = i.offset.x < -48; setOpen(o); controls.start({ x: o ? -128 : 0 }); }}
        className="relative flex bg-white"
      >
        {title}
        {/* 밀기의 대안: 같은 동작을 여는 버튼 */}
        <button aria-expanded={open} aria-label={\`\${title} 동작 더 보기\`} onClick={() => setOpen(!open)}>···</button>
      </motion.div>
    </li>
  );
}`,
    },
    sources: [
      { label: "NN/g — Using Swipe to Trigger Contextual Actions", url: "https://www.nngroup.com/articles/contextual-swipe/" },
      { label: "Apple HIG — Gestures", url: "https://developer.apple.com/design/human-interface-guidelines/gestures" },
      { label: "WCAG 2.2 — Understanding 2.5.7 Dragging Movements", url: "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html" },
    ],
  },
  {
    slug: "drag-and-drop",
    category: "content",
    nameKo: "드래그 앤 드롭",
    nameEn: "Drag and drop",
    aliases: ["Drag to reorder", "Reorder", "끌어서 놓기", "순서 바꾸기", "드래그 정렬"],
    oneLiner: "항목을 잡아 끌어다 원하는 자리에 놓아 순서나 위치를 바꾸는 조작.",
    whenToUse: [
      "할 일·재생 목록처럼 사용자가 직접 순서를 정하는 목록일 때",
      "잡는 손잡이를 보여 주고, 끄는 동안 놓일 자리를 미리 보여 줄 때",
      "끌기가 어려운 사람을 위해 '위로·아래로' 버튼이나 키보드로도 옮길 수 있게 할 때(WCAG 2.5.7)",
    ],
    confusedWith: [
      { slug: "swipe-actions", difference: "드래그 앤 드롭은 항목을 다른 자리로 옮기고, 스와이프 액션은 제자리에서 밀어 동작을 꺼낸다." },
    ],
    antiPattern: {
      title: "끌기 말고는 방법이 없는 정렬",
      description:
        "마우스나 손가락으로 끌어야만 순서를 바꿀 수 있으면 키보드·스크린리더 사용자와 손이 불편한 사용자는 아예 쓸 수 없다. 손잡이 표시도 없으면 끌 수 있다는 것조차 모른다.",
    },
    aiPrompt:
      "할 일 목록을 손잡이로 끌어서 순서를 바꿀 수 있게 해 줘. 손잡이에서 Space로 집고 위아래 화살표로 옮긴 뒤 Space로 놓을 수 있게 하고, 각 줄에 '위로/아래로' 버튼도 두고, 바뀐 위치는 aria-live로 읽어 줘.",
    code: {
      language: "tsx",
      snippet: `import { Reorder, useDragControls } from "motion/react";

function Item({ item, onMove }: { item: string; onMove: (d: -1 | 1) => void }) {
  const controls = useDragControls();
  const [grabbed, setGrabbed] = useState(false);
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls}>
      <button
        aria-label={\`\${item} 옮기기\`} aria-pressed={grabbed}
        onPointerDown={(e) => controls.start(e)}      // 손잡이로만 끈다
        onKeyDown={(e) => {
          if (e.key === " ") { e.preventDefault(); setGrabbed(!grabbed); }
          if (grabbed && e.key === "ArrowUp") onMove(-1);
          if (grabbed && e.key === "ArrowDown") onMove(1);
        }}
      >⋮⋮</button>
      {item}
    </Reorder.Item>
  );
}

<Reorder.Group axis="y" values={items} onReorder={setItems}>
  {items.map((it) => <Item key={it} item={it} onMove={(d) => move(it, d)} />)}
</Reorder.Group>`,
    },
    sources: [
      { label: "NN/g — Drag–and–Drop: How to Design for Ease of Use", url: "https://www.nngroup.com/articles/drag-drop/" },
      { label: "WCAG 2.2 — Understanding 2.5.7 Dragging Movements", url: "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html" },
    ],
  },
  {
    slug: "coach-marks",
    category: "content",
    nameKo: "코치마크",
    nameEn: "Coach marks",
    aliases: ["Instructional overlay", "Product tour", "Onboarding tour", "온보딩 가이드", "튜토리얼 오버레이", "Coachmarks"],
    nameNote:
      "NN/g는 화면 위에 반투명 층을 깔고 기능을 짚어 설명하는 것을 instructional overlay라 부르고, ui-patterns.com은 Coachmarks라는 이름으로 다룬다. 여러 개를 차례로 넘기면 흔히 프로덕트 투어·온보딩 투어라고 한다.",
    oneLiner: "화면의 특정 버튼이나 영역을 짚어 가며, 그 기능이 무엇인지 말풍선으로 짧게 알려 주는 안내.",
    whenToUse: [
      "새 기능이나 눈에 잘 띄지 않는 버튼처럼 정말 설명이 필요한 곳 몇 군데만 짚을 때",
      "단계는 짧게(2~3개), 언제든 건너뛰거나 Esc로 닫을 수 있게 할 때",
      "처음 실행 때 몰아 보여 주기보다, 그 기능을 쓸 만한 때에 맞춰 보여 줄 때",
    ],
    confusedWith: [
      { slug: "tooltip", difference: "툴팁은 사용자가 가리킬 때 나오는 보조 설명이고, 코치마크는 앱이 먼저 띄워 기능을 짚어 주는 안내다." },
      { slug: "modal", difference: "모달은 하나의 일을 끝내라고 막는 창이고, 코치마크는 화면 위 특정 요소를 가리키며 설명만 한다." },
    ],
    antiPattern: {
      title: "건너뛸 수 없는 6단계 투어",
      description:
        "앱을 열자마자 긴 설명을 여섯 번 넘겨야 쓸 수 있게 하면, 사용자는 읽지 않고 '다음'만 누르고 정작 필요할 때는 기억하지 못한다. 짧게, 건너뛸 수 있게 만든다.",
    },
    aiPrompt:
      "새 기능 둘러보기를 코치마크 3단계로 만들어 줘. 짚는 버튼 주변만 밝게 하는 스포트라이트와 화살표 달린 말풍선, '1/3' 표시, '건너뛰기'와 '다음' 버튼을 두고 Esc로도 닫히게 해 줘.",
    code: {
      language: "tsx",
      snippet: `// 대상 요소 위치를 재서 스포트라이트와 말풍선을 놓는다
useLayoutEffect(() => {
  const el = document.querySelector(\`[data-tour="\${steps[i].target}"]\`);
  if (!el || !spot.current || !box.current) return;
  const r = el.getBoundingClientRect();
  Object.assign(spot.current.style, {
    left: \`\${r.left - 4}px\`, top: \`\${r.top - 4}px\`,
    width: \`\${r.width + 8}px\`, height: \`\${r.height + 8}px\`,
  });
  box.current.style.top = \`\${r.bottom + 12}px\`;
}, [i]);

<div ref={spot} className="fixed rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,.5)]" aria-hidden />
<div ref={box} role="dialog" aria-modal="true" aria-labelledby="tour-title" className="fixed">
  <h2 id="tour-title">{steps[i].title}</h2>
  <p>{steps[i].body}</p>
  <span>{i + 1}/{steps.length}</span>
  <button onClick={close}>건너뛰기</button>
  <button onClick={next} autoFocus>{i === steps.length - 1 ? "완료" : "다음"}</button>
</div>`,
    },
    sources: [
      { label: "NN/g — Instructional Overlays and Coach Marks for Mobile Apps", url: "https://www.nngroup.com/articles/mobile-instructional-overlay/" },
      { label: "ui-patterns.com — Coachmarks", url: "https://ui-patterns.com/patterns/coachmarks" },
      { label: "NN/g — Onboarding Tutorials vs. Contextual Help", url: "https://www.nngroup.com/articles/onboarding-tutorials/" },
    ],
  },
  {
    slug: "fab",
    category: "content",
    nameKo: "플로팅 액션 버튼",
    nameEn: "Floating action button",
    aliases: ["FAB", "플로팅 버튼", "Extended FAB", "확장형 FAB"],
    nameNote:
      "Material Design의 컴포넌트 이름이다. 아이콘만 있는 FAB와 글자가 함께 있는 Extended FAB를 나누며, 스크롤할 때 확장형을 아이콘형으로 줄이는 방식도 쓴다.",
    oneLiner: "화면 위에 떠 있는 둥근 버튼 하나로, 그 화면에서 가장 중요한 동작(새로 만들기 등)을 늘 누를 수 있게 하는 것.",
    whenToUse: [
      "메모 쓰기·새 메일처럼 그 화면의 대표 동작이 딱 하나일 때",
      "목록을 스크롤해도 대표 동작에 바로 닿게 하고 싶을 때(마지막 항목이 가리지 않게 아래 여백을 둔다)",
      "아이콘만으로 뜻이 모호하면 글자가 있는 확장형을 쓸 때",
    ],
    confusedWith: [
      { slug: "action-sheet", difference: "FAB는 대표 동작 하나를 바로 실행하는 버튼이고, 액션시트는 여러 동작 중 하나를 고르게 하는 목록 창이다." },
      { slug: "bottom-sheet", difference: "FAB는 화면에 늘 떠 있는 버튼이고, 바텀시트는 필요할 때 아래에서 올라오는 판이다." },
    ],
    antiPattern: {
      title: "FAB가 마지막 항목을 가리고, 두 개가 겹쳐 있음",
      description:
        "목록 아래에 여백이 없으면 FAB가 마지막 항목과 그 버튼을 덮는다. FAB를 두 개 이상 띄우면 무엇이 대표 동작인지 흐려진다. FAB는 한 화면에 하나만 둔다.",
    },
    aiPrompt:
      "메모 목록 오른쪽 아래에 '새 메모' 확장형 플로팅 액션 버튼을 두고, 목록을 내리면 + 아이콘만 남게 줄여 줘. 목록 아래에 여백을 둬서 마지막 메모가 가리지 않게 하고, 버튼에 aria-label을 붙여 줘.",
    code: {
      language: "tsx",
      snippet: `const [compact, setCompact] = useState(false);

<ul onScroll={(e) => setCompact(e.currentTarget.scrollTop > 8)}
    className="h-full overflow-y-auto pb-24">  {/* FAB 높이만큼 여백 */}
  {notes.map((n) => <li key={n.id}>{n.title}</li>)}
</ul>

<button
  aria-label="새 메모"
  onClick={createNote}
  className={\`fixed bottom-4 right-4 flex h-14 items-center gap-2 rounded-2xl
    bg-indigo-600 text-white shadow-lg transition-all \${compact ? "w-14 justify-center" : "px-5"}\`}
>
  <PlusIcon aria-hidden />
  {!compact && <span aria-hidden>새 메모</span>}
</button>`,
    },
    sources: [
      { label: "Material Design 3 — Floating action buttons", url: "https://m3.material.io/components/floating-action-button/overview" },
    ],
  },
  {
    slug: "dropdown-menu",
    category: "content",
    nameKo: "드롭다운 메뉴",
    nameEn: "Dropdown menu",
    aliases: ["Menu", "Menu button", "Overflow menu", "Kebab menu", "더보기 메뉴", "Select menu", "케밥 메뉴"],
    nameNote:
      "The Component Gallery는 Dropdown menu의 다른 이름으로 Select menu를 든다. Material Design 3는 Menus, Apple HIG는 Menus·pull-down button이라 부른다. 다만 값을 고르는 폼 요소(<select>)와 동작을 실행하는 메뉴는 쓰임이 다르므로, 여기서는 '동작 메뉴'를 다룬다.",
    oneLiner: "버튼을 누르면 아래로 펼쳐지는 동작 목록으로, 자주 쓰지 않는 동작들을 한곳에 접어 두는 메뉴.",
    whenToUse: [
      "이름 바꾸기·복제·삭제처럼 한 항목에 동작이 여럿인데 늘 펼쳐 둘 자리가 없을 때",
      "삭제 같은 위험한 동작은 구분선 아래 맨 끝에, 다른 색으로 둘 때",
      "동작이 1~2개뿐이면 메뉴에 숨기지 말고 버튼으로 바로 보여 줄 때",
    ],
    confusedWith: [
      { slug: "popover", difference: "드롭다운 메뉴는 고를 동작 목록만 담고, 팝오버는 폼·설명 같은 자유로운 내용을 담는다." },
      { slug: "action-sheet", difference: "드롭다운 메뉴는 누른 버튼 바로 옆에 펼쳐지고, 액션시트는 모바일 화면 아래에서 올라온다." },
      { slug: "autocomplete", difference: "드롭다운 메뉴는 버튼을 눌러 동작을 고르고, 자동완성은 입력하는 글자에 맞춰 값을 추천한다." },
    ],
    antiPattern: {
      title: "삭제가 맨 위에, 똑같은 모양으로",
      description:
        "위험한 '삭제'를 첫 항목에 다른 항목과 같은 모양으로 두면 무심코 누르기 쉽다. 화살표 키와 Esc가 먹지 않으면 키보드 사용자는 메뉴를 다루기 어렵다.",
    },
    aiPrompt:
      "문서 카드의 ⋮ 버튼에 WAI-ARIA 메뉴 버튼 패턴으로 드롭다운 메뉴를 만들어 줘. aria-haspopup=\"menu\", role=\"menu\"/\"menuitem\"을 쓰고 ↑↓·Home·End로 이동, Esc로 닫고 버튼으로 포커스를 돌려줘. '삭제'는 구분선 아래 빨간색으로 둬.",
    code: {
      language: "tsx",
      snippet: `<button
  ref={btn} aria-haspopup="menu" aria-expanded={open} aria-controls="doc-menu"
  onClick={() => setOpen(!open)}
  onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setActive(0); setOpen(true); } }}
>⋮</button>

{open && (
  <div id="doc-menu" role="menu" onKeyDown={(e) => {
    const last = items.length - 1;
    if (e.key === "ArrowDown") setActive((i) => (i === last ? 0 : i + 1));
    if (e.key === "ArrowUp") setActive((i) => (i === 0 ? last : i - 1));
    if (e.key === "Escape") { setOpen(false); btn.current?.focus(); }
  }}>
    {items.map((it, i) => (
      <button key={it.label} role="menuitem"
        ref={(el) => { if (i === active) el?.focus(); }}
        tabIndex={i === active ? 0 : -1}
        onClick={() => { it.run(); setOpen(false); btn.current?.focus(); }}
      >{it.label}</button>
    ))}
  </div>
)}`,
    },
    sources: [
      { label: "WAI-ARIA APG — Menu Button Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" },
      { label: "The Component Gallery — Dropdown menu", url: "https://component.gallery/components/dropdown-menu/" },
      { label: "Material Design 3 — Menus", url: "https://m3.material.io/components/menus/overview" },
      { label: "Apple HIG — Menus", url: "https://developer.apple.com/design/human-interface-guidelines/menus" },
    ],
  },
  {
    slug: "progressive-disclosure",
    category: "content",
    nameKo: "점진적 공개",
    nameEn: "Progressive disclosure",
    aliases: ["Staged disclosure", "Show more options", "고급 설정 숨기기", "단계적 노출", "고급 옵션"],
    oneLiner: "자주 쓰는 것만 먼저 보여 주고, 드물게 쓰는 고급 기능은 요청할 때 한 단계 더 펼쳐 보여 주는 설계 방식.",
    whenToUse: [
      "설정·폼에서 대부분은 기본값으로 충분하고 일부 사용자만 세부 옵션이 필요할 때",
      "처음 보는 사람이 화면을 덜 부담스럽게 느끼게 하면서 고급 기능도 남겨 두고 싶을 때",
      "숨긴 부분이 무엇인지 '고급 설정(4)'처럼 이름과 개수로 알 수 있게 하고, 단계는 한두 겹으로만 둘 때",
    ],
    confusedWith: [
      {
        slug: "accordion",
        difference: "아코디언은 접고 펼치는 UI 부품이고, 점진적 공개는 무엇을 먼저 보이고 무엇을 미룰지 정하는 설계 원칙이다(아코디언으로 구현하기도 한다).",
      },
    ],
    antiPattern: {
      title: "모든 설정을 한꺼번에 늘어놓기",
      description:
        "거의 쓰지 않는 옵션 열 개를 기본 옵션과 같은 자리에 늘어놓으면, 무엇이 중요한지 알 수 없고 정작 '내보내기' 버튼이 밀려난다. 반대로 꼭 필요한 옵션을 세 겹 아래에 숨기는 것도 실패다.",
    },
    aiPrompt:
      "내보내기 폼에 형식과 파일 이름만 먼저 보여 주고, 나머지 옵션은 '고급 설정 (4)' 버튼을 누르면 펼쳐지게 해 줘. 버튼에 aria-expanded와 aria-controls를 달고, 펼친 영역은 부드럽게 높이가 늘어나게 해 줘.",
    code: {
      language: "tsx",
      snippet: `const [open, setOpen] = useState(false);

<form>
  <FormatField />
  <FileNameField />

  <button type="button" aria-expanded={open} aria-controls="advanced" onClick={() => setOpen(!open)}>
    고급 설정 {open ? "접기" : "(4)"}
  </button>
  <div id="advanced" hidden={!open}>
    <label><input type="checkbox" /> 페이지 범위 지정</label>
    <label><input type="checkbox" /> 여백 없이 인쇄</label>
    <label><input type="checkbox" /> 암호로 보호</label>
    <label><input type="checkbox" /> 주석 포함</label>
  </div>

  <button type="submit">내보내기</button>
</form>`,
    },
    sources: [
      { label: "NN/g — Progressive Disclosure", url: "https://www.nngroup.com/articles/progressive-disclosure/" },
      { label: "ui-patterns.com — Progressive Disclosure", url: "https://ui-patterns.com/patterns/ProgressiveDisclosure" },
    ],
  },
];
