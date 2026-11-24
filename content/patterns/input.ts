import type { Pattern } from "../types";

const HIG = "https://developer.apple.com/design/human-interface-guidelines";

export const inputPatterns: Pattern[] = [
  {
    slug: "segmented-control",
    category: "input",
    nameKo: "세그먼트 컨트롤",
    nameEn: "Segmented control",
    aliases: ["Segmented button", "Toggle button group", "세그먼트 버튼", "세그먼티드 컨트롤"],
    nameNote:
      "Apple HIG는 Segmented control, Material Design 3는 Segmented buttons라고 부른다. The Component Gallery는 Segmented control의 다른 이름으로 Toggle button group을 든다.",
    oneLiner: "붙어 있는 몇 개의 칸 중 하나를 골라, 같은 내용을 다르게 보는 방법을 바꾸는 컨트롤.",
    whenToUse: [
      "일·주·월처럼 같은 데이터를 보는 방식을 2~5개 중에서 바꿀 때",
      "고를 수 있는 항목이 적고, 칸 이름이 짧게 들어갈 때",
      "고르면 바로 아래 화면이 바뀌어 결과를 즉시 볼 수 있을 때",
    ],
    confusedWith: [
      {
        slug: "tabs",
        difference: "세그먼트 컨트롤은 같은 내용을 보는 방식을 바꾸고, 탭은 서로 다른 내용 묶음 사이를 오간다.",
      },
      {
        slug: "toggle-switch",
        difference: "토글 스위치는 켬·끔 두 상태뿐이고, 세그먼트 컨트롤은 이름 붙은 여러 보기 중 하나를 고른다.",
      },
    ],
    antiPattern: {
      title: "칸을 너무 많이 넣고 선택 표시는 흐리게",
      description:
        "칸이 6개를 넘으면 글자가 잘리고, 선택된 칸이 배경과 거의 구분되지 않으면 지금 무엇을 보고 있는지 알 수 없다. 항목이 많으면 드롭다운이나 탭을 쓴다.",
    },
    aiPrompt:
      "차트 위에 '일 · 주 · 월' 세그먼트 컨트롤을 만들어 줘. role=\"radiogroup\"과 role=\"radio\"로 만들고 좌우 화살표 키로 옮기면 바로 차트 기간이 바뀌게 해 줘.",
    code: {
      language: "tsx",
      snippet: `const options = ["일", "주", "월"];
const [sel, setSel] = useState(0);

<div role="radiogroup" aria-label="기간" className="flex rounded-lg bg-gray-100 p-0.5"
  onKeyDown={(e) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (sel + d + options.length) % options.length;
    setSel(next);
    (e.currentTarget.children[next] as HTMLElement).focus();
  }}>
  {options.map((o, i) => (
    <button key={o} role="radio" aria-checked={i === sel} tabIndex={i === sel ? 0 : -1}
      onClick={() => setSel(i)}
      className={i === sel ? "flex-1 rounded-md bg-white shadow" : "flex-1 text-gray-500"}>
      {o}
    </button>
  ))}
</div>`,
    },
    sources: [
      { label: "Apple HIG — Segmented controls", url: `${HIG}/segmented-controls` },
      { label: "Material Design 3 — Segmented buttons", url: "https://m3.material.io/components/segmented-buttons/overview" },
      { label: "The Component Gallery — Segmented control", url: "https://component.gallery/components/segmented-control/" },
    ],
  },
  {
    slug: "toggle-switch",
    category: "input",
    nameKo: "토글 스위치",
    nameEn: "Toggle switch",
    aliases: ["Switch", "Toggle", "스위치", "토글", "Lightswitch", "Toggle button"],
    nameNote:
      "Apple HIG는 Toggle, Material Design 3는 Switch라고 부른다. The Component Gallery는 Toggle 항목에 Switch, Lightswitch, Toggle button을 다른 이름으로 든다.",
    oneLiner: "켬과 끔 두 상태를 오가며, 누르는 즉시 설정이 적용되는 스위치.",
    whenToUse: [
      "Wi-Fi·알림처럼 켜고 끄는 설정을 누르는 즉시 적용할 때",
      "저장·제출 버튼을 눌러야 반영되는 폼 안에서는 스위치 대신 체크박스를 쓴다(NN/g)",
      "이름은 켰을 때의 상태를 긍정형으로 쓴다('알림 받기', '알림 끄지 않기'가 아니라)",
    ],
    confusedWith: [
      {
        slug: "segmented-control",
        difference: "토글 스위치는 켬·끔 두 상태만 오가고, 세그먼트 컨트롤은 이름 붙은 여러 보기 중 하나를 고른다.",
      },
    ],
    antiPattern: {
      title: "켜도 '저장'을 눌러야 적용되는 스위치",
      description:
        "스위치는 실제 스위치처럼 누르는 순간 바뀐다고 기대된다. 따로 저장 버튼을 눌러야 적용되면 사용자는 켰다고 믿고 떠나 버린다. 이름까지 '끄지 않기' 같은 부정형이면 켬이 무엇을 뜻하는지 헷갈린다.",
    },
    aiPrompt:
      "설정 화면에 'Wi-Fi' 토글 스위치를 만들어 줘. role=\"switch\"와 aria-checked를 쓰고, 누르는 즉시 적용되며 저장 버튼은 두지 마.",
    code: {
      language: "tsx",
      snippet: `function Switch({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}   // 누르는 즉시 적용
        className={\`relative h-6 w-11 rounded-full \${checked ? "bg-indigo-600" : "bg-gray-300"}\`}
      >
        <span className={\`absolute top-0.5 size-5 rounded-full bg-white transition \${checked ? "left-5.5" : "left-0.5"}\`} />
      </button>
    </label>
  );
}`,
    },
    sources: [
      { label: "NN/g — Toggle-Switch Guidelines", url: "https://www.nngroup.com/articles/toggle-switch-guidelines/" },
      { label: "Apple HIG — Toggles", url: `${HIG}/toggles` },
      { label: "Material Design 3 — Switch", url: "https://m3.material.io/components/switch/overview" },
      { label: "WAI-ARIA APG — Switch Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/" },
    ],
  },
  {
    slug: "chip",
    category: "input",
    nameKo: "칩",
    nameEn: "Chip",
    aliases: ["Filter chip", "필터 칩", "Tag", "태그", "Pill", "알약 버튼"],
    nameNote:
      "Material Design 3는 칩을 쓰임에 따라 assist(도움), filter(필터), input(입력한 값), suggestion(추천) 네 가지로 나눈다. 여기서는 가장 흔한 필터 칩을 보여 준다. 디자인 시스템에 따라 Tag나 Pill이라고도 부른다.",
    oneLiner: "작은 알약 모양 버튼으로 필터를 켜고 끄거나, 입력한 값·추천 항목을 보여 주는 요소.",
    whenToUse: [
      "검색 결과를 '영업 중', '주차 가능'처럼 여러 조건으로 겹쳐 좁힐 때",
      "고른 칩은 체크 표시나 테두리로 분명히 구분하고, 다시 누르면 풀리게 할 때",
      "이메일 받는 사람처럼 입력한 값을 하나씩 덩어리로 보여 주고 지울 수 있게 할 때",
    ],
    confusedWith: [
      {
        slug: "badge",
        difference: "칩은 누르거나 지울 수 있는 조작 요소이고, 배지는 개수나 상태를 알려 주기만 하는 표시다.",
      },
      {
        slug: "segmented-control",
        difference: "필터 칩은 여러 개를 동시에 고를 수 있고, 세그먼트 컨트롤은 항상 하나만 고른다.",
      },
    ],
    antiPattern: {
      title: "선택 표시가 흐리고, 하나를 고르면 다른 선택이 풀리는 칩",
      description:
        "고른 칩과 안 고른 칩이 거의 같아 보이면 지금 걸린 필터를 알 수 없다. 겹쳐 고를 수 있어 보이는데 하나를 누를 때마다 다른 선택이 말없이 풀리면, 원하는 조건 조합을 만들 수 없다.",
    },
    aiPrompt:
      "검색 결과 위에 '영업 중', '주차 가능', '예약 가능' 필터 칩을 만들어 줘. 여러 개를 함께 고를 수 있고, 고른 칩에는 체크 아이콘과 강조 테두리, aria-pressed=true를 붙여 줘.",
    code: {
      language: "tsx",
      snippet: `const [selected, setSelected] = useState<string[]>([]);
const toggle = (c: string) =>
  setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

<div role="group" aria-label="필터" className="flex flex-wrap gap-2">
  {["영업 중", "주차 가능", "예약 가능"].map((c) => {
    const on = selected.includes(c);
    return (
      <button key={c} type="button" aria-pressed={on} onClick={() => toggle(c)}
        className={on
          ? "rounded-full border border-indigo-600 bg-indigo-50 px-3 py-1 text-indigo-700"
          : "rounded-full border px-3 py-1"}>
        {on && "✓ "}{c}
      </button>
    );
  })}
</div>`,
    },
    sources: [
      { label: "Material Design 3 — Chips", url: "https://m3.material.io/components/chips/overview" },
    ],
  },
  {
    slug: "slider",
    category: "input",
    nameKo: "슬라이더",
    nameEn: "Slider",
    aliases: ["Range slider", "Range input", "범위 슬라이더", "레인지 슬라이더"],
    nameNote: "The Component Gallery는 Slider의 다른 이름으로 Range input을 든다(HTML의 input type=\"range\").",
    oneLiner: "막대 위의 손잡이를 끌어 정해진 범위 안에서 값을 고르는 컨트롤.",
    whenToUse: [
      "밝기·음량처럼 정확한 숫자보다 '대략 이만큼'이 중요하고, 바뀌는 결과를 바로 볼 수 있을 때",
      "가격대처럼 범위의 양 끝을 고를 때(손잡이 두 개)",
      "지금 값을 숫자로도 보여 주고, 화살표 키로 한 칸씩 움직일 수 있게 할 때",
    ],
    confusedWith: [
      {
        slug: "quantity-stepper",
        difference: "슬라이더는 넓은 범위에서 대략의 값을 끌어서 고르고, 수량 조절은 작은 정수를 한 칸씩 정확히 맞춘다.",
      },
      {
        slug: "progress-bar",
        difference: "슬라이더는 사용자가 끌어서 값을 바꾸고, 프로그레스 바는 시스템이 진행 정도를 보여 주기만 한다.",
      },
    ],
    antiPattern: {
      title: "정확한 숫자를 값도 안 보이는 슬라이더로 고르게 하기",
      description:
        "나이처럼 정확한 숫자를 넓은 범위의 슬라이더로 고르게 하면, 원하는 값에 손잡이를 맞추기 어렵다. 지금 값까지 보이지 않으면 몇을 골랐는지조차 알 수 없다. 정확한 값은 숫자 입력칸으로 받는다.",
    },
    aiPrompt:
      "화면 밝기를 조절하는 슬라이더를 만들어 줘. input type=\"range\"(0~100, 5 단위)를 쓰고, 옆에 지금 값을 %로 보여 주고, 끄는 동안 미리보기가 바로 바뀌게 해 줘.",
    code: {
      language: "tsx",
      snippet: `const [value, setValue] = useState(40);

<label htmlFor="brightness" className="flex justify-between">
  밝기 <output htmlFor="brightness">{value}%</output>
</label>
<input
  id="brightness"
  type="range"
  min={0}
  max={100}
  step={5}
  value={value}
  aria-valuetext={\`\${value}%\`}
  onChange={(e) => setValue(Number(e.target.value))}
  className="w-full accent-indigo-600"
/>`,
    },
    sources: [
      { label: "Material Design 3 — Sliders", url: "https://m3.material.io/components/sliders/overview" },
      { label: "Apple HIG — Sliders", url: `${HIG}/sliders` },
      { label: "The Component Gallery — Slider", url: "https://component.gallery/components/slider/" },
      { label: "WAI-ARIA APG — Slider Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/" },
    ],
  },
  {
    slug: "quantity-stepper",
    category: "input",
    nameKo: "수량 조절",
    nameEn: "Stepper (number)",
    aliases: ["Stepper", "스텝퍼", "Number stepper", "Quantity input", "수량 선택", "Nudger", "Counter", "Spin button", "스핀 버튼"],
    nameNote:
      "이름이 겹친다. Apple HIG와 The Component Gallery는 이 −/+ 컨트롤을 Stepper라고 부른다(The Component Gallery의 다른 이름: Nudger, Quantity, Counter). 그런데 Material Design 2는 여러 단계 진행을 보여 주는 것을 Steppers라고 부르고, 이 도감에서는 그것을 '단계 표시(stepper)'로 따로 둔다. 웹 접근성(WAI-ARIA)에서는 이 컨트롤의 역할을 spinbutton이라고 한다.",
    oneLiner: "− / + 버튼으로 숫자를 한 칸씩 늘리고 줄이는 작은 입력 컨트롤.",
    whenToUse: [
      "장바구니 수량·인원수처럼 작은 범위의 정수를 조금씩 바꿀 때",
      "최솟값·최댓값에 닿으면 해당 버튼을 비활성화해 범위를 넘지 않게 할 때",
      "값이 크게 바뀔 수 있으면 숫자를 직접 칠 수 있게 입력칸도 열어 둘 때",
    ],
    confusedWith: [
      {
        slug: "stepper",
        difference: "둘 다 Stepper라 불리지만, 수량 조절은 숫자를 −/+로 바꾸는 입력이고, 단계 표시는 여러 단계 중 지금 위치를 보여 준다.",
      },
      {
        slug: "slider",
        difference: "수량 조절은 작은 정수를 한 칸씩 정확히 맞추고, 슬라이더는 넓은 범위에서 대략의 값을 끌어서 고른다.",
      },
    ],
    antiPattern: {
      title: "작은 버튼, 0개·음수 허용, 직접 입력 불가",
      description:
        "−/+ 버튼이 손가락보다 작으면 잘못 누르기 쉽다. 최솟값을 막지 않아 0개나 음수가 되면 합계가 이상해지고, 숫자를 직접 칠 수 없으면 30개를 담으려고 +를 29번 눌러야 한다.",
    },
    aiPrompt:
      "장바구니 상품에 수량 조절(−, 숫자, +)을 만들어 줘. 1~10으로 제한하고 끝에 닿으면 버튼을 비활성화해 줘. 가운데 숫자는 직접 입력할 수 있게 하고 role=\"spinbutton\"과 위아래 화살표 키를 지원해 줘.",
    code: {
      language: "tsx",
      snippet: `const MIN = 1, MAX = 10;
const [qty, setQty] = useState(1);
const set = (n: number) => setQty(Math.min(MAX, Math.max(MIN, n)));

<div className="flex items-center rounded-lg border">
  <button aria-label="수량 줄이기" disabled={qty <= MIN} onClick={() => set(qty - 1)}
    className="size-10">−</button>
  <input
    role="spinbutton" aria-label="수량"
    aria-valuenow={qty} aria-valuemin={MIN} aria-valuemax={MAX}
    inputMode="numeric" value={qty}
    onChange={(e) => set(Number(e.target.value.replace(/\\D/g, "")) || MIN)}
    onKeyDown={(e) => {
      if (e.key === "ArrowUp") { e.preventDefault(); set(qty + 1); }
      if (e.key === "ArrowDown") { e.preventDefault(); set(qty - 1); }
    }}
    className="w-10 text-center"
  />
  <button aria-label="수량 늘리기" disabled={qty >= MAX} onClick={() => set(qty + 1)}
    className="size-10">+</button>
</div>`,
    },
    sources: [
      { label: "Apple HIG — Steppers", url: `${HIG}/steppers` },
      { label: "The Component Gallery — Stepper (Nudger, Quantity, Counter)", url: "https://component.gallery/components/stepper/" },
      { label: "WAI-ARIA APG — Spinbutton Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/" },
    ],
  },
  {
    slug: "autocomplete",
    category: "input",
    nameKo: "자동완성",
    nameEn: "Autocomplete",
    aliases: ["Combobox", "콤보박스", "Autosuggest", "Typeahead", "검색어 자동완성", "추천 검색어"],
    nameNote:
      "The Component Gallery는 이 패턴을 Combobox 항목에 두고 Autocomplete, Autosuggest를 다른 이름으로 든다. 웹 접근성(WAI-ARIA)에서도 역할 이름은 combobox다.",
    oneLiner: "입력하는 동안 맞는 후보를 아래에 목록으로 보여 주고, 골라서 채울 수 있게 하는 입력칸.",
    whenToUse: [
      "도시·주소·상품명처럼 후보가 많아 처음부터 다 보여 주기 어려울 때",
      "철자를 다 기억하지 못해도 앞 몇 글자로 찾을 수 있게 할 때",
      "후보는 제안일 뿐, 사용자가 친 글자를 마음대로 바꾸지 않을 때",
    ],
    confusedWith: [
      {
        slug: "dropdown-menu",
        difference: "자동완성은 글자를 쳐서 후보를 좁히고, 드롭다운 메뉴는 정해진 항목 목록을 펼쳐서 고른다.",
      },
    ],
    antiPattern: {
      title: "친 글자를 첫 후보로 통째로 바꿔 버리기",
      description:
        "'부'를 치자마자 칸이 '부산'으로 바뀌면 '부천'을 칠 방법이 없다. 후보는 목록으로 제안만 하고, 사용자가 화살표나 클릭으로 고를 때만 채운다.",
    },
    aiPrompt:
      "도시 검색 입력칸에 자동완성을 넣어 줘. WAI-ARIA combobox 패턴(role=\"combobox\", listbox, aria-activedescendant)으로 만들고, 위아래 화살표로 후보를 옮기고 Enter로 고르고 Esc로 닫게 해 줘. 맞는 글자는 굵게 표시해 줘.",
    code: {
      language: "tsx",
      snippet: `const [q, setQ] = useState("");
const [open, setOpen] = useState(false);
const [active, setActive] = useState(-1);
const items = q ? CITIES.filter((c) => c.includes(q)) : [];

<input
  role="combobox" aria-expanded={open && items.length > 0}
  aria-controls="city-list" aria-autocomplete="list"
  aria-activedescendant={active >= 0 ? \`city-\${active}\` : undefined}
  value={q}
  onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
  onKeyDown={(e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter" && items[active]) { setQ(items[active]); setOpen(false); }
    if (e.key === "Escape") setOpen(false);
  }}
/>
{open && items.length > 0 && (
  <ul id="city-list" role="listbox">
    {items.map((c, i) => (
      <li key={c} id={\`city-\${i}\`} role="option" aria-selected={i === active}
        onMouseDown={(e) => { e.preventDefault(); setQ(c); setOpen(false); }}>{c}</li>
    ))}
  </ul>
)}`,
    },
    sources: [
      { label: "The Component Gallery — Combobox (Autocomplete, Autosuggest)", url: "https://component.gallery/components/combobox/" },
      { label: "WAI-ARIA APG — Combobox Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" },
    ],
  },
  {
    slug: "date-picker",
    category: "input",
    nameKo: "날짜 선택기",
    nameEn: "Date picker",
    aliases: ["Datepicker", "Calendar", "달력", "Datetime picker", "데이트 피커", "날짜 피커"],
    nameNote:
      "Material Design 3는 Date pickers, The Component Gallery는 Datepicker(다른 이름 Calendar, Datetime picker)라고 부른다. Apple HIG는 날짜를 포함한 여러 값을 고르는 컨트롤을 Pickers로 묶어 다룬다.",
    oneLiner: "달력에서 날짜를 눌러 고르게 해, 형식을 몰라도 날짜를 정확히 넣게 하는 입력 방식.",
    whenToUse: [
      "숙소 체크인·예약일처럼 가까운 날짜를 요일과 함께 보며 고를 때",
      "지난 날짜처럼 고를 수 없는 날은 미리 막아 둘 때",
      "생년월일처럼 먼 날짜는 달력 대신 연·월·일 입력칸으로 바로 치게 할 때",
    ],
    confusedWith: [
      {
        slug: "modal",
        difference: "날짜 선택기는 날짜 하나를 고르는 입력 컨트롤이고, 모달은 그런 컨트롤을 담아 띄울 수 있는 그릇이다.",
      },
      {
        slug: "bottom-sheet",
        difference: "모바일에서는 날짜 선택기를 바텀시트에 담아 띄우기도 한다. 바텀시트는 그릇, 날짜 선택기는 내용이다.",
      },
    ],
    antiPattern: {
      title: "생년월일을 이번 달 달력부터 고르게 하기",
      description:
        "생년월일 칸에 이번 달 달력을 띄우고 '이전 달' 버튼만 주면, 1990년까지 가려고 수백 번 눌러야 한다. 먼 날짜는 숫자 입력칸이나 연도를 먼저 고르는 방식으로 받는다.",
    },
    aiPrompt:
      "숙소 예약 폼에 체크인 날짜 선택기를 만들어 줘. 칸을 누르면 달력이 열리고, 화살표 키로 날짜를 옮기고 Enter로 고르고 Esc로 닫게 해 줘. 오늘 이전 날짜는 비활성화해 줘.",
    code: {
      language: "tsx",
      snippet: `// 한 달 달력 그리기. y, m은 보여 줄 연·월(m은 0부터)
const first = new Date(y, m, 1).getDay();        // 1일의 요일
const days = new Date(y, m + 1, 0).getDate();     // 그 달 날짜 수
const today = new Date(); today.setHours(0, 0, 0, 0);

<div role="grid" aria-label={\`\${y}년 \${m + 1}월\`} className="grid grid-cols-7">
  {Array.from({ length: first }, (_, i) => <span key={"b" + i} />)}
  {Array.from({ length: days }, (_, i) => {
    const date = new Date(y, m, i + 1);
    return (
      <button key={i} type="button"
        disabled={date < today}
        aria-label={\`\${m + 1}월 \${i + 1}일\`}
        aria-pressed={selected?.getTime() === date.getTime()}
        onClick={() => { onSelect(date); close(); }}>
        {i + 1}
      </button>
    );
  })}
</div>`,
    },
    sources: [
      { label: "Material Design 3 — Date pickers", url: "https://m3.material.io/components/date-pickers/overview" },
      { label: "The Component Gallery — Datepicker", url: "https://component.gallery/components/datepicker/" },
      { label: "Apple HIG — Pickers", url: `${HIG}/pickers` },
    ],
  },
  {
    slug: "select",
    category: "input",
    nameKo: "셀렉트 박스",
    nameEn: "Select",
    aliases: ["Dropdown", "Select input", "Dropdown list", "드롭다운", "셀렉트", "선택 상자", "콤보박스"],
    nameNote:
      "The Component Gallery는 Select의 다른 이름으로 Dropdown, Select input을 든다. 그런데 '드롭다운'은 명령을 실행하는 메뉴(드롭다운 메뉴)에도 쓰이는 말이다. 셀렉트는 폼에 넣을 값 하나를 고르고, 메뉴는 동작을 실행한다는 점이 다르다. 국내에서는 셀렉트를 '콤보박스'라고 부르기도 하지만, 엄밀히 콤보박스는 글자를 쳐서 거를 수 있는 입력(자동완성)을 말한다.",
    oneLiner: "접혀 있는 목록을 펼쳐 보기 중 하나를 고르고, 고른 값만 칸에 남겨 두는 폼 입력.",
    whenToUse: [
      "보기가 많고(대략 5개 이상) 그중 하나만 골라야 하는데 화면 자리가 좁을 때",
      "보기가 사용자에게 익숙해서 펼쳐 보지 않아도 무엇이 있을지 짐작될 때(지역, 은행 등)",
      "보기가 2~4개뿐이면 셀렉트 대신 라디오 버튼으로 모두 펼쳐 보여 줄 때",
    ],
    confusedWith: [
      { slug: "dropdown-menu", difference: "셀렉트는 폼에 들어갈 값을 고르고, 드롭다운 메뉴는 '삭제·공유' 같은 동작을 실행한다." },
      { slug: "autocomplete", difference: "셀렉트는 정해진 목록에서 고르기만 하고, 자동완성은 글자를 쳐서 목록을 좁혀 가며 고른다." },
      { slug: "radio-button", difference: "둘 다 하나를 고르지만, 셀렉트는 보기를 접어 두고 라디오 버튼은 모든 보기를 펼쳐 둔다." },
    ],
    antiPattern: {
      title: "보기 두 개를 셀렉트 안에 숨기기",
      description:
        "'택배 / 방문 수령'처럼 보기가 둘뿐인데 셀렉트에 넣으면, 사용자는 열어 보기 전까지 무엇을 고를 수 있는지 모르고 클릭도 한 번 더 해야 한다. 적은 보기는 라디오 버튼이나 세그먼트 컨트롤로 펼쳐 보여 준다.",
    },
    aiPrompt:
      "배송 요청사항을 고르는 셀렉트 박스를 만들어 줘. 네이티브 <select>와 <label>을 연결하고, 화살표 아이콘만 커스텀해 줘. 보기가 4개 이하라면 라디오 버튼으로 바꾸자고 알려 줘.",
    code: {
      language: "tsx",
      snippet: `<label htmlFor="memo">배송 요청사항</label>
<div className="relative">
  <select
    id="memo"
    value={memo}
    onChange={(e) => setMemo(e.target.value)}
    className="h-10 w-full appearance-none rounded-lg border px-3 pr-9"
  >
    <option>문 앞에 놓아 주세요</option>
    <option>경비실에 맡겨 주세요</option>
    <option>배송 전에 연락 주세요</option>
  </select>
  {/* 모양만 바꾸고 열고 닫기·키보드·모바일 휠은 브라우저에 맡긴다 */}
  <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-3" />
</div>`,
    },
    sources: [
      { label: "The Component Gallery — Select", url: "https://component.gallery/components/select/" },
      { label: "WAI-ARIA APG — Listbox Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" },
    ],
  },
  {
    slug: "checkbox",
    category: "input",
    nameKo: "체크박스",
    nameEn: "Checkbox",
    aliases: ["Check box", "Tick box", "체크 박스", "확인란"],
    oneLiner: "보기마다 따로 켜고 끄는 네모 칸. 여러 개를 함께 고를 수 있고, 하나도 안 골라도 된다.",
    whenToUse: [
      "약관 동의, 관심 분야처럼 여러 보기 중 몇 개든 고를 수 있을 때",
      "'로그인 상태 유지'처럼 하나짜리 선택을 폼과 함께 제출할 때(바로 적용되는 설정이면 스위치)",
      "하위 항목 일부만 골랐을 때 상위 칸을 중간 상태(–)로 보여 줄 때",
    ],
    confusedWith: [
      { slug: "radio-button", difference: "체크박스는 여러 개를 고를 수 있고, 라디오 버튼은 보기 중 딱 하나만 고른다." },
      { slug: "toggle-switch", difference: "체크박스는 '제출' 버튼을 눌러야 반영되는 폼에 쓰고, 스위치는 누르는 즉시 적용되는 설정에 쓴다." },
    ],
    antiPattern: {
      title: "하나만 골라야 하는 보기에 체크박스 쓰기",
      description:
        "배송 방법처럼 하나만 고를 수 있는 보기를 체크박스로 만들면 '택배'와 '방문 수령'을 동시에 고를 수 있어 결과가 모순된다. 서로 배타적인 보기는 라디오 버튼으로 만든다.",
    },
    aiPrompt:
      "회원가입 약관 동의를 체크박스로 만들어 줘. 맨 위 '전체 동의'는 하위 항목이 일부만 체크되면 indeterminate 상태가 되고, 누르면 전부 켜지거나 꺼지게 해 줘. 네이티브 <input type=\"checkbox\">와 <label>을 써 줘.",
    code: {
      language: "tsx",
      snippet: `const all = checked.every(Boolean);
const some = checked.some(Boolean) && !all;
const allRef = useRef<HTMLInputElement>(null);

// indeterminate는 HTML 속성이 없어 DOM 프로퍼티로 넣는다
useEffect(() => {
  if (allRef.current) allRef.current.indeterminate = some;
}, [some]);

<fieldset>
  <legend>약관 동의</legend>
  <label>
    <input ref={allRef} type="checkbox" checked={all}
      onChange={(e) => setChecked(checked.map(() => e.target.checked))} />
    전체 동의
  </label>
  {terms.map((t, i) => (
    <label key={t}>
      <input type="checkbox" checked={checked[i]}
        onChange={(e) => setChecked(checked.map((v, j) => (j === i ? e.target.checked : v)))} />
      {t}
    </label>
  ))}
</fieldset>`,
    },
    sources: [
      { label: "NN/g — Checkboxes vs. Radio Buttons", url: "https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/" },
      { label: "Material Design 3 — Checkbox", url: "https://m3.material.io/components/checkbox/overview" },
      { label: "The Component Gallery — Checkbox", url: "https://component.gallery/components/checkbox/" },
      { label: "WAI-ARIA APG — Checkbox Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/" },
    ],
  },
  {
    slug: "radio-button",
    category: "input",
    nameKo: "라디오 버튼",
    nameEn: "Radio button",
    aliases: ["Radio", "Radio group", "Option button", "라디오", "라디오 그룹"],
    oneLiner: "모두 펼쳐 놓은 보기 중 딱 하나만 고르게 하는 동그란 칸. 하나를 고르면 나머지는 저절로 풀린다.",
    whenToUse: [
      "배송 방법, 결제 수단처럼 서로 겹칠 수 없는 보기 2~6개 중 하나를 고를 때",
      "보기를 나란히 비교하며 골라야 해서 모두 펼쳐 보여 주는 편이 나을 때",
      "대부분이 고를 값이 있으면 그것을 기본으로 골라 둘 때",
    ],
    confusedWith: [
      { slug: "checkbox", difference: "라디오 버튼은 하나만, 체크박스는 여러 개를 고른다. 라디오는 다시 눌러도 해제되지 않는다." },
      { slug: "segmented-control", difference: "라디오 버튼은 폼에 값을 넣고, 세그먼트 컨트롤은 같은 화면을 보는 방식을 바로 바꾼다." },
    ],
    antiPattern: {
      title: "켜고 끄는 선택 하나를 라디오 버튼으로 만들기",
      description:
        "'뉴스레터 받기' 하나를 라디오 버튼으로 두면, 한 번 고른 뒤에는 다시 눌러도 꺼지지 않아 마음을 바꿀 방법이 없다. 하나짜리 켜기/끄기는 체크박스나 스위치로 만든다.",
    },
    aiPrompt:
      "배송 방법을 고르는 라디오 버튼 그룹을 만들어 줘. fieldset과 legend로 묶고, 각 보기에는 가격 설명을 덧붙이고, 기본값으로 '일반 배송'을 골라 둬. 화살표 키로 보기를 옮길 수 있게 네이티브 radio를 써 줘.",
    code: {
      language: "tsx",
      snippet: `<fieldset>
  <legend>배송 방법</legend>
  {options.map((o) => (
    <label key={o.value} className="flex items-center gap-2">
      <input
        type="radio"
        name="shipping"          // 같은 name이면 하나만 골라지고 ←/→ 키로 옮겨진다
        value={o.value}
        checked={shipping === o.value}
        onChange={() => setShipping(o.value)}
      />
      <span>{o.label}</span>
      <span className="text-muted">{o.desc}</span>
    </label>
  ))}
</fieldset>`,
    },
    sources: [
      { label: "NN/g — Checkboxes vs. Radio Buttons", url: "https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/" },
      { label: "Material Design 3 — Radio button", url: "https://m3.material.io/components/radio-button/overview" },
      { label: "The Component Gallery — Radio button", url: "https://component.gallery/components/radio-button/" },
      { label: "WAI-ARIA APG — Radio Group Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/" },
    ],
  },
  {
    slug: "floating-label",
    category: "input",
    nameKo: "플로팅 레이블",
    nameEn: "Floating label",
    aliases: ["Float label", "Animated label", "움직이는 레이블", "플로팅 라벨"],
    nameNote:
      "Material Design 3 텍스트 필드는 칸을 누르거나 값이 있으면 레이블이 칸 안에서 위쪽으로 올라간다. 이 동작을 흔히 플로팅 레이블이라 부른다. NN/g는 플레이스홀더를 레이블 대신 쓰면 입력하는 순간 사라진다고 지적하는데, 플로팅 레이블은 자리를 아끼면서도 레이블을 남겨 두는 절충안이다.",
    oneLiner: "칸 안에 있던 이름표가 입력을 시작하면 칸 위쪽으로 작게 올라가, 쓰는 동안에도 무슨 칸인지 보이게 하는 레이블.",
    whenToUse: [
      "모바일 로그인·가입 폼처럼 세로 공간이 좁아 레이블을 칸 위에 따로 두기 어려울 때",
      "칸 이름이 짧아서 작게 올라가도 읽힐 때",
      "형식 안내(예: '-' 없이)는 레이블이 아니라 칸 아래 도움말로 따로 남겨 둘 때",
    ],
    confusedWith: [
      { slug: "inline-validation", difference: "플로팅 레이블은 '무슨 칸인지'를 남겨 두고, 인라인 검증은 '맞게 썼는지'를 칸 옆에서 알려 준다." },
      { slug: "tooltip", difference: "플로팅 레이블은 항상 보이는 칸 이름이고, 툴팁은 가리키거나 포커스할 때만 뜨는 보조 설명이다." },
    ],
    antiPattern: {
      title: "플레이스홀더를 유일한 레이블로 쓰기",
      description:
        "칸 안의 흐린 안내 글자만 레이블로 쓰면, 한 글자를 치는 순간 무슨 칸이었는지와 형식 안내가 함께 사라진다. 흐린 글씨는 대비도 낮아 잘 안 보인다. 레이블은 입력 중에도 남아 있어야 한다.",
    },
    aiPrompt:
      "이메일 입력칸에 플로팅 레이블을 만들어 줘. <label>과 <input>을 htmlFor로 연결하고, 포커스되거나 값이 있으면 레이블이 칸 위쪽으로 작게 올라가게 해 줘. 플레이스홀더를 레이블 대신 쓰지는 마.",
    code: {
      language: "tsx",
      snippet: `const [focus, setFocus] = useState(false);
const up = focus || value !== "";

<div className="relative">
  <input
    id="email"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onFocus={() => setFocus(true)}
    onBlur={() => setFocus(false)}
    className="h-12 w-full rounded-lg border px-3 pt-5"
  />
  <label
    htmlFor="email"
    className={\`pointer-events-none absolute left-3 transition-all
      \${up ? "top-1.5 text-[11px]" : "top-3.5 text-sm"}\`}
  >
    이메일
  </label>
</div>`,
    },
    sources: [
      { label: "Material Design 3 — Text fields", url: "https://m3.material.io/components/text-fields/overview" },
      { label: "NN/g — Placeholders in Form Fields Are Harmful", url: "https://www.nngroup.com/articles/form-design-placeholders/" },
    ],
  },
  {
    slug: "password-toggle",
    category: "input",
    nameKo: "비밀번호 보기",
    nameEn: "Show password toggle",
    aliases: ["Password reveal", "Password visibility toggle", "Unmask password", "비밀번호 표시", "눈 아이콘", "비밀번호 보기 버튼"],
    oneLiner: "가려진 비밀번호 칸 옆의 눈 아이콘을 눌러, 친 글자를 잠깐 드러내 확인하게 하는 버튼.",
    whenToUse: [
      "비밀번호를 새로 만들거나 바꿀 때, 오타 없이 쳤는지 확인하게 할 때",
      "작은 화면 키보드처럼 오타가 잦은 환경에서 다시 치는 수고를 줄일 때",
      "'비밀번호 확인' 칸을 하나 더 두는 대신 보기 버튼 하나로 확인하게 할 때",
    ],
    confusedWith: [
      { slug: "toggle-switch", difference: "비밀번호 보기는 칸 하나의 표시 방식만 잠깐 바꾸고, 스위치는 설정 값을 켜고 끈다." },
      { slug: "inline-validation", difference: "비밀번호 보기는 사용자가 직접 확인하게 하고, 인라인 검증은 시스템이 규칙에 맞는지 알려 준다." },
    ],
    antiPattern: {
      title: "보기 버튼 없이 같은 비밀번호를 두 번 치게 하기",
      description:
        "입력한 글자를 볼 방법 없이 '비밀번호 확인' 칸만 두면, 두 칸이 다를 때 어디서 틀렸는지 알 수 없어 둘 다 지우고 다시 쳐야 한다. 눈 아이콘으로 직접 확인하게 하면 칸 하나로 충분하다.",
    },
    aiPrompt:
      "비밀번호 입력칸 오른쪽에 눈 아이콘 버튼을 넣어 줘. 누르면 type이 password↔text로 바뀌고, 버튼에는 aria-label=\"비밀번호 보기\"와 aria-pressed를 달아 줘. 비밀번호 확인 칸은 만들지 마.",
    code: {
      language: "tsx",
      snippet: `const [show, setShow] = useState(false);

<label htmlFor="pw">비밀번호</label>
<div className="relative">
  <input
    id="pw"
    type={show ? "text" : "password"}
    autoComplete="new-password"
    className="h-11 w-full rounded-lg border pl-3 pr-11"
  />
  <button
    type="button"
    aria-label="비밀번호 보기"
    aria-pressed={show}
    aria-controls="pw"
    onClick={() => setShow((s) => !s)}
    className="absolute right-1 top-1 size-9"
  >
    {show ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
  </button>
</div>`,
    },
    sources: [
      { label: "NN/g — Stop Password Masking", url: "https://www.nngroup.com/articles/stop-password-masking/" },
      { label: "Material Design 3 — Text fields", url: "https://m3.material.io/components/text-fields/overview" },
    ],
  },
  {
    slug: "file-upload",
    category: "input",
    nameKo: "파일 업로드",
    nameEn: "File upload",
    aliases: ["Dropzone", "File input", "File uploader", "드롭존", "첨부", "파일 첨부", "업로드 영역"],
    nameNote:
      "The Component Gallery는 File upload의 다른 이름으로 File input, File uploader, Dropzone을 든다. 드롭존은 파일을 끌어다 놓는 영역만 따로 가리킬 때 많이 쓴다.",
    oneLiner: "버튼을 눌러 고르거나 파일을 끌어다 놓아 올리고, 파일마다 진행률과 결과를 보여 주는 입력.",
    whenToUse: [
      "사진·서류처럼 기기에 있는 파일을 받아야 할 때",
      "여러 파일을 한꺼번에 올리고 파일마다 진행 상황을 보여 줘야 할 때",
      "받을 수 있는 형식과 크기를 올리기 전에 미리 알려 줄 때",
    ],
    confusedWith: [
      { slug: "drag-and-drop", difference: "파일 업로드는 기기 밖의 파일을 페이지로 들여오고, 드래그 앤 드롭은 페이지 안의 항목을 옮기거나 순서를 바꾼다." },
      { slug: "progress-bar", difference: "파일 업로드는 파일을 받는 입력 자체이고, 프로그레스 바는 그 올리기가 얼마나 됐는지 보여 주는 표시다." },
    ],
    antiPattern: {
      title: "끌어다 놓기만 되는 영역",
      description:
        "'여기로 끌어다 놓으세요' 영역만 있고 눌러서 고를 수 없으면, 키보드 사용자와 모바일 사용자는 파일을 올릴 방법이 없다. 받을 수 있는 형식·크기 안내가 없으면 올린 뒤에야 거절당한다. 드롭존은 눌러도 파일 선택 창이 열리는 버튼이어야 한다.",
    },
    aiPrompt:
      "사진 첨부용 파일 업로드를 만들어 줘. 드롭존 전체를 버튼으로 만들어 누르면 숨긴 <input type=\"file\">이 열리고, 끌어다 놓기도 되게 해 줘. 'JPG, PNG · 최대 10MB' 안내를 aria-describedby로 연결하고, 파일마다 진행률 바를 보여 줘.",
    code: {
      language: "tsx",
      snippet: `const inputRef = useRef<HTMLInputElement>(null);

<input ref={inputRef} type="file" multiple accept="image/png,image/jpeg"
  className="sr-only" tabIndex={-1}
  onChange={(e) => upload(Array.from(e.target.files ?? []))} />

<button
  type="button"
  aria-describedby="file-hint"
  onClick={() => inputRef.current?.click()}           // 눌러서 고르기
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {                                     // 끌어다 놓기
    e.preventDefault();
    upload(Array.from(e.dataTransfer.files));
  }}
  className="rounded-xl border-2 border-dashed p-4"
>
  파일 선택 또는 끌어다 놓기
  <span id="file-hint">JPG, PNG · 파일당 최대 10MB</span>
</button>`,
    },
    sources: [{ label: "The Component Gallery — File upload", url: "https://component.gallery/components/file-upload/" }],
  },
  {
    slug: "rating",
    category: "input",
    nameKo: "별점",
    nameEn: "Star rating",
    aliases: ["Rating", "Star rating", "평점", "별점 매기기", "레이팅"],
    oneLiner: "별 몇 개를 채우느냐로 만족도를 매기게 하는 입력. 고른 점수를 글자로도 함께 보여 준다.",
    whenToUse: [
      "후기·리뷰에서 만족도를 1~5처럼 몇 단계로 빠르게 받을 때",
      "평균 점수를 보여 주는 곳과 같은 모양으로 매기게 해 익숙함을 줄 때",
      "점수마다 '좋아요' 같은 짧은 말을 붙여 단계의 뜻을 분명히 할 때",
    ],
    confusedWith: [
      { slug: "slider", difference: "별점은 몇 개 안 되는 단계를 고르고, 슬라이더는 연속된 범위에서 값을 고른다." },
      { slug: "radio-button", difference: "별점은 모양만 다를 뿐 하나를 고르는 라디오 그룹과 같아서, 접근성도 라디오처럼 만든다." },
    ],
    antiPattern: {
      title: "마우스로만 되는 작은 별",
      description:
        "별을 div로 그려 마우스 올리기·클릭에만 반응하게 하면 키보드와 스크린리더로는 점수를 줄 수 없다. 별이 작고 지금 몇 점인지 글자로 알려 주지 않으면 눌렀는지도 헷갈린다.",
    },
    aiPrompt:
      "후기 작성 화면에 별점 입력을 만들어 줘. 별 다섯 개를 숨긴 라디오 버튼(fieldset+legend)으로 만들어 ←/→ 키로 바꿀 수 있게 하고, 고른 점수를 '4점 · 좋아요'처럼 글자로도 보여 줘.",
    code: {
      language: "tsx",
      snippet: `<fieldset>
  <legend>이 숙소는 어땠나요?</legend>
  {[1, 2, 3, 4, 5].map((n) => (
    <label key={n} className="has-[:focus-visible]:outline">
      <input
        type="radio"
        name="rating"
        value={n}
        checked={value === n}
        onChange={() => setValue(n)}
        className="sr-only"            // 모양은 별, 동작은 라디오
      />
      <span className="sr-only">{n}점</span>
      <Star aria-hidden filled={n <= value} />
    </label>
  ))}
</fieldset>
<p aria-live="polite">{value ? \`\${value}점 · \${words[value]}\` : "별을 눌러 주세요"}</p>`,
    },
    sources: [
      { label: "The Component Gallery — Rating", url: "https://component.gallery/components/rating/" },
      { label: "WAI-ARIA APG — Radio Group Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/" },
    ],
  },
];
