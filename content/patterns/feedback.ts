import type { Pattern } from "../types";

export const feedbackPatterns: Pattern[] = [
  {
    slug: "toast",
    category: "feedback",
    nameKo: "토스트",
    nameEn: "Toast",
    aliases: ["Snackbar", "스낵바", "Toast message", "토스트 메시지"],
    nameNote:
      "The Component Gallery는 Toast의 다른 이름으로 Snackbar를 든다. Material Design은 Snackbar라는 이름만 쓰고 Toast를 따로 두지 않는다. 국내 실무에서는 버튼 없이 잠깐 떴다 사라지는 것을 토스트, 액션 버튼이 있는 것을 스낵바로 나눠 부르기도 한다.",
    oneLiner: "작업 결과를 화면 가장자리에 잠깐 띄웠다가 스스로 사라지는 짧은 메시지.",
    whenToUse: [
      "저장·복사·전송처럼 방금 한 일이 잘 됐다고 가볍게 알릴 때",
      "사용자가 하던 일을 끊지 않아도 되는, 놓쳐도 괜찮은 정보일 때",
      "읽을 시간을 주도록 몇 초(대개 3~5초) 머문 뒤 사라지게 할 때",
    ],
    confusedWith: [
      {
        slug: "snackbar",
        difference: "토스트는 알리기만 하고, 스낵바는 '실행 취소' 같은 액션 버튼을 하나 함께 준다.",
      },
      {
        slug: "banner",
        difference: "토스트는 잠깐 떴다 사라지고, 배너는 사용자가 닫거나 상황이 바뀔 때까지 화면 위쪽에 머문다.",
      },
    ],
    antiPattern: {
      title: "오류를 금방 사라지는 토스트로 띄우기",
      description:
        "결제 실패처럼 사용자가 꼭 읽고 고쳐야 하는 오류를 1초 남짓 떴다 사라지는 토스트로 보여 주면, 읽기 전에 사라지고 무엇을 고쳐야 하는지도 남지 않는다. 오류는 문제가 난 자리 가까이에 남아 있는 메시지로 보여 준다.",
    },
    aiPrompt:
      "저장 버튼을 누르면 화면 아래 가운데에 '저장했어요' 토스트를 3초 동안 띄웠다가 사라지게 해 줘. role=\"status\"로 스크린리더가 읽게 하고, 오류 메시지에는 토스트를 쓰지 마.",
    code: {
      language: "tsx",
      snippet: `function useToast(ms = 3000) {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), ms);
    return () => clearTimeout(t);
  }, [msg, ms]);
  return { msg, show: setMsg };
}

// 렌더링: 영역은 항상 두고 내용만 바꾼다(스크린리더가 변화를 읽음)
<div role="status" aria-live="polite" className="fixed inset-x-0 bottom-6 flex justify-center">
  {msg && <div className="rounded-full bg-black px-4 py-2 text-white">{msg}</div>}
</div>`,
    },
    sources: [
      { label: "The Component Gallery — Toast", url: "https://component.gallery/components/toast/" },
      { label: "Material Design 3 — Snackbar", url: "https://m3.material.io/components/snackbar/overview" },
    ],
  },
  {
    slug: "snackbar",
    category: "feedback",
    nameKo: "스낵바",
    nameEn: "Snackbar",
    aliases: ["Toast", "토스트", "Snackbar with action", "액션 스낵바"],
    nameNote:
      "Material Design은 화면 아래에 잠깐 뜨는 짧은 메시지를 Snackbar라고 부르고, 액션 버튼은 하나까지 둘 수 있다. Material에는 Toast라는 컴포넌트가 따로 없다. 국내 실무에서는 액션 버튼이 있으면 스낵바, 없으면 토스트로 나눠 부르기도 한다.",
    oneLiner: "방금 한 일을 화면 아래에 잠깐 알리면서, '실행 취소' 같은 액션 하나를 함께 주는 메시지.",
    whenToUse: [
      "삭제·보관·이동처럼 되돌릴 수 있는 작업 직후에 '실행 취소'를 줄 때",
      "알림과 함께 바로 할 수 있는 일이 딱 하나 있을 때(액션은 하나까지)",
      "액션을 누를 시간이 있도록 충분히 머물게 하고, 키보드로도 닿게 할 때",
    ],
    confusedWith: [
      { slug: "toast", difference: "스낵바는 액션 버튼 하나를 주고, 토스트는 알리기만 한다." },
      { slug: "undo", difference: "되돌리기는 기능(무엇을 할 수 있나)이고, 스낵바는 그 기능을 자주 담는 그릇(어디에 보이나)이다." },
    ],
    antiPattern: {
      title: "액션이 둘이고 누르기 전에 사라지는 스낵바",
      description:
        "액션 버튼을 여러 개 넣거나 1초 남짓 만에 사라지게 하면, 사용자는 '실행 취소'를 누를 틈이 없다. 특히 키보드·스크린리더 사용자는 버튼에 닿기도 전에 놓친다.",
    },
    aiPrompt:
      "항목을 삭제하면 화면 아래에 '삭제했어요' 스낵바와 '실행 취소' 버튼 하나를 6초 동안 보여 주고, 실행 취소를 누르면 항목을 원래 자리에 되돌려 줘. 스낵바 영역은 role=\"status\"로 해 줘.",
    code: {
      language: "tsx",
      snippet: `const [snack, setSnack] = useState<{ item: Item; index: number } | null>(null);

function remove(index: number) {
  const item = items[index];
  setItems((xs) => xs.filter((_, i) => i !== index));
  setSnack({ item, index });
}

function undo() {
  if (!snack) return;
  setItems((xs) => [...xs.slice(0, snack.index), snack.item, ...xs.slice(snack.index)]);
  setSnack(null);
}

useEffect(() => {
  if (!snack) return;
  const t = setTimeout(() => setSnack(null), 6000);
  return () => clearTimeout(t);
}, [snack]);

<div role="status" aria-live="polite">
  {snack && (
    <div className="snackbar">
      삭제했어요 <button onClick={undo}>실행 취소</button>
    </div>
  )}
</div>`,
    },
    sources: [
      { label: "Material Design 3 — Snackbar", url: "https://m3.material.io/components/snackbar/overview" },
      { label: "The Component Gallery — Toast (also known as Snackbar)", url: "https://component.gallery/components/toast/" },
    ],
  },
  {
    slug: "banner",
    category: "feedback",
    nameKo: "배너",
    nameEn: "Banner",
    aliases: ["Notification banner", "Alert banner", "공지 배너", "알림 배너", "Callout", "Alert"],
    nameNote:
      "The Component Gallery는 이 패턴을 Alert 항목에 넣고 Notification, Message, Banner, Callout을 다른 이름으로 든다. 이 도감의 '알럿'은 확인을 받는 대화상자(Apple HIG의 Alert)를 뜻하므로, 화면 안에 머무는 알림은 '배너'로 부른다.",
    oneLiner: "화면 위쪽에 자리를 차지하고 머물면서, 지금 화면 전체에 걸린 중요한 상태를 알리는 메시지.",
    whenToUse: [
      "오프라인·점검 예정·결제 수단 만료처럼 사용자가 알아야 하고 상황이 풀릴 때까지 유효한 정보일 때",
      "읽고 나서 사용자가 직접 닫거나, 상황이 바뀌면 사라지게 할 때",
      "한 화면에 하나만, 꼭 필요한 때만 쓸 때",
    ],
    confusedWith: [
      { slug: "toast", difference: "배너는 닫거나 상황이 바뀔 때까지 머물고, 토스트는 몇 초 뒤 스스로 사라진다." },
      { slug: "modal", difference: "배너는 하던 일을 막지 않고 알리기만 하고, 모달은 답할 때까지 다른 조작을 막는다." },
    ],
    antiPattern: {
      title: "사소한 소식을 닫을 수 없는 배너로 쌓기",
      description:
        "'프로필이 바뀌었어요' 같은 가벼운 소식을 닫기 버튼 없는 배너로 여러 개 쌓으면 본문이 밀려나고, 정말 중요한 배너가 떴을 때 사용자가 무시하게 된다.",
    },
    aiPrompt:
      "네트워크가 끊기면 화면 상단에 '오프라인이에요. 연결되면 자동으로 보내요' 배너를 보여 주고, 닫기 버튼(aria-label=\"알림 닫기\")과 연결이 돌아오면 저절로 사라지게 해 줘.",
    code: {
      language: "tsx",
      snippet: `function OfflineBanner() {
  const [online, setOnline] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const update = () => { setOnline(navigator.onLine); setDismissed(false); };
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online || dismissed) return null;
  return (
    <div role="region" aria-label="연결 상태 알림" className="banner">
      <p><strong>오프라인이에요.</strong> 연결되면 자동으로 보내요.</p>
      <button aria-label="알림 닫기" onClick={() => setDismissed(true)}>×</button>
    </div>
  );
}`,
    },
    sources: [
      { label: "Material Design 2 — Banners", url: "https://m2.material.io/components/banners" },
      { label: "The Component Gallery — Alert (also known as Banner)", url: "https://component.gallery/components/alert/" },
      { label: "GOV.UK Design System — Notification banner", url: "https://design-system.service.gov.uk/components/notification-banner/" },
    ],
  },
  {
    slug: "inline-validation",
    category: "feedback",
    nameKo: "인라인 검증",
    nameEn: "Inline validation",
    aliases: ["Inline form validation", "실시간 유효성 검사", "Field validation", "입력 검증", "Live validation"],
    oneLiner: "폼을 다 내기 전에, 입력한 칸 바로 옆에서 맞고 틀림을 알려 주는 방식.",
    whenToUse: [
      "이메일·비밀번호·아이디처럼 형식이 정해져 있어 바로 판단할 수 있는 칸",
      "사용자가 칸을 떠난 뒤(blur)에 검사하고, 오류가 난 칸은 고치는 즉시 다시 검사할 때",
      "긴 폼에서 제출 후 한꺼번에 오류를 몰아 보여 주는 일을 줄이고 싶을 때",
    ],
    confusedWith: [
      { slug: "error-message", difference: "인라인 검증은 '언제·어디서' 검사해 알릴지의 방식이고, 오류 메시지는 그때 보여 주는 문장 자체다." },
    ],
    antiPattern: {
      title: "다 쓰기도 전에 첫 글자부터 오류 띄우기",
      description:
        "이메일 첫 글자를 치자마자 '잘못된 이메일!'이 뜨면, 아직 쓰는 중인 사용자를 혼내는 셈이다. 칸을 떠난 뒤에 검사하고, 문구에는 무엇을 어떻게 고칠지를 쓴다.",
    },
    aiPrompt:
      "이메일 입력칸에 인라인 검증을 넣어 줘. 칸을 떠날 때 처음 검사하고, 그 뒤로는 입력할 때마다 다시 검사해. 틀리면 aria-invalid와 aria-describedby로 연결한 '예: name@example.com' 안내를 칸 아래에 보여 줘.",
    code: {
      language: "tsx",
      snippet: `const [value, setValue] = useState("");
const [touched, setTouched] = useState(false);
const valid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(value);
const showError = touched && value !== "" && !valid;

<label htmlFor="email">이메일</label>
<input
  id="email"
  type="email"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onBlur={() => setTouched(true)}      // 칸을 떠난 뒤부터 검사
  aria-invalid={showError}
  aria-describedby="email-msg"
/>
<p id="email-msg" aria-live="polite">
  {showError && "이메일 형식이 아니에요. 예: name@example.com"}
</p>`,
    },
    sources: [
      { label: "NN/g — 10 Design Guidelines for Reporting Errors in Forms", url: "https://www.nngroup.com/articles/errors-forms-design-guidelines/" },
      { label: "NN/g — Indicators, Validations, and Notifications", url: "https://www.nngroup.com/articles/indicators-validations-notifications/" },
    ],
  },
  {
    slug: "badge",
    category: "feedback",
    nameKo: "배지",
    nameEn: "Badge",
    aliases: ["뱃지", "Notification badge", "Count badge", "Dot", "카운트 배지", "Tag"],
    nameNote:
      "Material Design 3의 Badge는 아이콘 귀퉁이에 붙는 점이나 숫자를 말한다. 디자인 시스템에 따라 'New' 같은 짧은 라벨(태그)도 Badge라 부르는데, 여기서는 알림 수를 보여 주는 쪽을 다룬다.",
    oneLiner: "아이콘이나 메뉴 귀퉁이에 붙어 새 소식이 있음이나 그 개수를 알려 주는 작은 점·숫자.",
    whenToUse: [
      "읽지 않은 메시지·알림처럼 확인하면 줄어드는 개수를 보여 줄 때",
      "개수가 크게 중요하지 않으면 숫자 없이 점(dot)만 쓸 때",
      "큰 숫자는 '99+'처럼 줄이고, 숫자를 읽어 줄 수 있게 접근성 이름에 넣을 때",
    ],
    confusedWith: [
      { slug: "banner", difference: "배지는 '뭔가 있다'는 신호만 아이콘에 붙이고, 배너는 무슨 일인지 문장으로 화면에 띄운다." },
    ],
    antiPattern: {
      title: "모든 메뉴에 큰 숫자 배지, 봐도 줄지 않음",
      description:
        "탭마다 '999+', '87' 같은 배지를 붙이고 눌러 봐도 숫자가 그대로면, 사용자는 배지를 소음으로 여기고 정말 새로운 것도 놓친다.",
    },
    aiPrompt:
      "알림 아이콘 버튼 오른쪽 위에 읽지 않은 개수 배지를 붙여 줘. 0이면 숨기고 99가 넘으면 '99+'로 보여 주고, 버튼의 aria-label에 '알림, 읽지 않은 알림 3개'처럼 개수를 넣어 줘.",
    code: {
      language: "tsx",
      snippet: `function NotificationButton({ count, onOpen }: { count: number; onOpen: () => void }) {
  const label = count > 0 ? \`알림, 읽지 않은 알림 \${count}개\` : "알림";
  return (
    <button aria-label={label} onClick={onOpen} className="relative">
      <BellIcon aria-hidden />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-red-600 px-1 text-[10px] text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}`,
    },
    sources: [
      { label: "Material Design 3 — Badges", url: "https://m3.material.io/components/badges/overview" },
      { label: "The Component Gallery — Badge", url: "https://component.gallery/components/badge/" },
    ],
  },
  {
    slug: "tooltip",
    category: "feedback",
    nameKo: "툴팁",
    nameEn: "Tooltip",
    aliases: ["Hint", "말풍선 도움말", "툴 팁", "Plain tooltip"],
    oneLiner: "요소에 마우스를 올리거나 포커스하면 잠깐 나타나, 그 요소가 무엇인지 짧게 설명하는 작은 글상자.",
    whenToUse: [
      "아이콘만 있는 버튼에 이름을 덧붙여 줄 때",
      "알면 좋지만 없어도 일할 수 있는 짧은 보충 설명일 때(꼭 알아야 하는 정보는 화면에 그대로 쓴다)",
      "마우스 올리기뿐 아니라 키보드 포커스에도 뜨고, Esc로 닫히게 할 때",
    ],
    confusedWith: [
      { slug: "popover", difference: "툴팁은 짧은 글만 잠깐 보여 주고, 팝오버는 눌러서 열고 버튼·입력 같은 조작할 내용을 담는다." },
    ],
    antiPattern: {
      title: "꼭 알아야 할 조건을 마우스 툴팁에만 숨기기",
      description:
        "비밀번호 조건처럼 입력에 꼭 필요한 정보를 마우스를 올려야만 보이는 툴팁에 넣으면, 키보드와 터치 사용자는 볼 방법이 없다. 필수 정보는 칸 아래에 늘 보이게 둔다.",
    },
    aiPrompt:
      "아이콘 버튼에 툴팁을 붙여 줘. 마우스를 올리고 0.3초 뒤, 또는 키보드로 포커스하면 바로 보이고, Esc를 누르거나 포커스가 떠나면 닫혀. role=\"tooltip\"과 aria-describedby로 연결해 줘.",
    code: {
      language: "tsx",
      snippet: `function IconButtonWithTooltip({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <span className="relative">
      <button
        aria-label={label}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </button>
      {open && <span id={id} role="tooltip" className="tooltip">{label}</span>}
    </span>
  );
}`,
    },
    sources: [
      { label: "NN/g — Tooltip Guidelines", url: "https://www.nngroup.com/articles/tooltip-guidelines/" },
      { label: "Material Design 3 — Tooltips", url: "https://m3.material.io/components/tooltips/overview" },
      { label: "The Component Gallery — Tooltip", url: "https://component.gallery/components/tooltip/" },
    ],
  },
  {
    slug: "undo",
    category: "feedback",
    nameKo: "되돌리기",
    nameEn: "Undo",
    aliases: ["실행 취소", "Undo action", "언두", "되돌리기 버튼"],
    oneLiner: "방금 한 작업을 바로 원래대로 돌릴 수 있게 해, 미리 묻는 확인창 없이도 실수를 고칠 수 있게 하는 방식.",
    whenToUse: [
      "삭제·보관·이동처럼 자주 하고, 시스템이 되돌릴 수 있는 작업일 때",
      "매번 '정말 하시겠습니까?'를 묻는 대신 일단 실행하고 되돌릴 길을 줄 때",
      "되돌릴 수 없는 작업(영구 삭제·송금)에는 쓰지 말고 확인을 받을 때",
    ],
    confusedWith: [
      { slug: "snackbar", difference: "되돌리기는 실수를 고칠 수 있게 하는 기능이고, 스낵바는 그 버튼을 잠깐 보여 주는 자리 중 하나다." },
      { slug: "alert", difference: "되돌리기는 먼저 실행하고 나중에 고치게 하고, 알럿은 실행 전에 멈춰 세워 묻는다." },
    ],
    antiPattern: {
      title: "되돌릴 수 있는 일마다 확인창으로 묻기",
      description:
        "보관처럼 가볍고 되돌릴 수 있는 일에도 매번 '정말 보관하시겠습니까?'를 띄우면 흐름이 끊기고, 사용자는 습관처럼 '확인'을 눌러 정작 중요한 확인도 읽지 않게 된다.",
    },
    aiPrompt:
      "목록에서 '보관'을 누르면 확인창 없이 바로 보관하고, 그 자리에 '보관했어요 · 되돌리기' 줄을 남겨 줘. 되돌리기를 누르면 항목을 원래 자리로 돌려놓고, 상태 변화는 aria-live로 알려 줘.",
    code: {
      language: "tsx",
      snippet: `const [items, setItems] = useState(initial);
const [archived, setArchived] = useState<Set<string>>(new Set());

const archive = (id: string) => setArchived((s) => new Set(s).add(id));
const undo = (id: string) =>
  setArchived((s) => {
    const next = new Set(s);
    next.delete(id);
    return next;
  });

<ul aria-live="polite">
  {items.map((m) =>
    archived.has(m.id) ? (
      <li key={m.id}>보관했어요 <button onClick={() => undo(m.id)}>되돌리기</button></li>
    ) : (
      <li key={m.id}>{m.title} <button onClick={() => archive(m.id)}>보관</button></li>
    ),
  )}
</ul>`,
    },
    sources: [
      { label: "NN/g — User Control and Freedom (Usability Heuristic #3)", url: "https://www.nngroup.com/articles/user-control-and-freedom/" },
      { label: "Material Design 3 — Snackbar (undo action)", url: "https://m3.material.io/components/snackbar/overview" },
    ],
  },
  {
    slug: "success-state",
    category: "feedback",
    nameKo: "성공 상태",
    nameEn: "Success state",
    aliases: ["Success message", "Confirmation", "Confirmation page", "완료 화면", "완료 메시지", "성공 메시지"],
    nameNote:
      "GOV.UK Design System은 일을 마친 뒤 보여 주는 화면을 Confirmation page라고 부르고, 화면 안의 짧은 성공 알림은 Notification banner의 success 종류로 둔다. 'Success state'는 이 둘을 묶어 부르는 설명적인 이름이다.",
    oneLiner: "작업이 끝났다는 사실과 결과 내용, 그리고 다음에 할 수 있는 일을 분명하게 보여 주는 상태.",
    whenToUse: [
      "송금·주문·신청처럼 결과가 중요해 '정말 됐나?'가 궁금한 작업이 끝났을 때",
      "무엇이 됐는지(금액·받는 사람·번호)와 다음 행동(영수증·한 번 더)을 함께 줄 때",
      "화면이 바뀌면 제목으로 포커스를 옮겨 스크린리더도 결과를 바로 읽게 할 때",
    ],
    confusedWith: [
      { slug: "toast", difference: "성공 상태는 결과와 다음 행동을 화면에 남기고, 토스트는 '됐어요'만 잠깐 알리고 사라진다." },
    ],
    antiPattern: {
      title: "'완료' 한 마디 뒤 폼만 비우기",
      description:
        "송금을 마쳤는데 잠깐 '완료'만 깜빡이고 폼이 빈 채로 돌아오면, 사용자는 얼마가 누구에게 갔는지 확인할 수 없고 다시 보내야 하나 불안해진다.",
    },
    aiPrompt:
      "송금이 끝나면 폼 대신 완료 화면을 보여 줘. 체크 아이콘, '30,000원을 보냈어요' 제목, 받는 사람·거래번호, '영수증 보기'·'한 번 더 보내기' 버튼을 넣고, 화면이 바뀌면 제목에 포커스를 옮겨 줘.",
    code: {
      language: "tsx",
      snippet: `function SuccessView({ amount, to, txId }: { amount: number; to: string; txId: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <section aria-labelledby="done-title" className="text-center">
      <CheckIcon aria-hidden />
      <h2 id="done-title" ref={headingRef} tabIndex={-1}>
        {amount.toLocaleString()}원을 보냈어요
      </h2>
      <p>{to} · 거래번호 {txId}</p>
      <a href={\`/receipts/\${txId}\`}>영수증 보기</a>
      <a href="/send">한 번 더 보내기</a>
    </section>
  );
}`,
    },
    sources: [
      { label: "GOV.UK Design System — Confirmation pages", url: "https://design-system.service.gov.uk/patterns/confirmation-pages/" },
      { label: "GOV.UK Design System — Notification banner", url: "https://design-system.service.gov.uk/components/notification-banner/" },
      { label: "NN/g — Visibility of System Status", url: "https://www.nngroup.com/articles/visibility-system-status/" },
    ],
  },
  {
    slug: "error-message",
    category: "feedback",
    nameKo: "오류 메시지",
    nameEn: "Error message",
    aliases: ["에러 메시지", "Error state", "Validation error", "오류 안내", "에러 문구"],
    oneLiner: "무엇이 잘못됐는지와 어떻게 고치면 되는지를, 문제가 난 자리 가까이에 사람의 말로 알려 주는 메시지.",
    whenToUse: [
      "제출했는데 입력이 틀렸거나 작업이 실패해 사용자가 고쳐야 할 때",
      "문제가 난 칸 바로 옆에, 색만이 아니라 글과 아이콘으로 함께 보여 줄 때",
      "코드 번호 대신 원인과 해결 방법을 쓰고, 오류가 난 칸으로 포커스를 옮길 때",
    ],
    confusedWith: [
      { slug: "inline-validation", difference: "오류 메시지는 무엇을 말할지(문장)이고, 인라인 검증은 언제 어디서 검사해 보여 줄지(방식)다." },
      { slug: "toast", difference: "오류는 고칠 때까지 자리에 남아야 하고, 토스트는 금방 사라지므로 오류에 맞지 않는다." },
    ],
    antiPattern: {
      title: "멀리 떨어진 모호한 문구, 빨간색만으로 표시",
      description:
        "화면 위쪽에 '오류가 발생했습니다 (코드 0x80070057)'만 띄우고 칸 테두리만 빨갛게 하면, 어느 칸이 왜 틀렸는지 알 수 없고 색을 구분하기 어려운 사람은 오류를 알아채지도 못한다.",
    },
    aiPrompt:
      "결제 폼에서 카드 번호가 16자리가 아니면 칸 바로 아래에 '카드 앞면의 16자리 숫자를 모두 입력해 주세요' 오류를 아이콘과 함께 보여 줘. aria-invalid·aria-describedby를 연결하고, 제출할 때 그 칸으로 포커스를 옮겨 줘.",
    code: {
      language: "tsx",
      snippet: `const [error, setError] = useState<string | null>(null);
const inputRef = useRef<HTMLInputElement>(null);

function onSubmit(e: FormEvent) {
  e.preventDefault();
  const digits = card.replace(/\\D/g, "");
  if (digits.length !== 16) {
    setError(\`카드 번호가 \${digits.length}자리예요. 앞면의 16자리 숫자를 모두 입력해 주세요.\`);
    inputRef.current?.focus();
    return;
  }
  setError(null);
}

<input
  ref={inputRef}
  id="card"
  aria-invalid={!!error}
  aria-describedby={error ? "card-error" : undefined}
/>
{error && (
  <p id="card-error" role="alert">
    <ErrorIcon aria-hidden /> {error}
  </p>
)}`,
    },
    sources: [
      { label: "NN/g — Error-Message Guidelines", url: "https://www.nngroup.com/articles/error-message-guidelines/" },
      { label: "GOV.UK Design System — Error message", url: "https://design-system.service.gov.uk/components/error-message/" },
      { label: "NN/g — 10 Design Guidelines for Reporting Errors in Forms", url: "https://www.nngroup.com/articles/errors-forms-design-guidelines/" },
    ],
  },
];
