import type { Pattern } from "../types";

export const overlayPatterns: Pattern[] = [
  {
    slug: "modal",
    category: "overlay",
    nameKo: "모달·다이얼로그",
    nameEn: "Modal / Dialog",
    aliases: ["Modal dialog", "Dialog", "Popup", "팝업", "Modal window", "대화상자", "모달"],
    nameNote:
      "The Component Gallery는 Modal의 다른 이름으로 Dialog, Popup, Modal window를 든다. Material Design 3는 Dialog라고 부른다. '모달'은 뒤 화면을 막는 성질을, '다이얼로그'는 사용자와 주고받는 창이라는 뜻을 강조한 말이다.",
    oneLiner: "뒤 화면을 막고 그 위에 띄운 창. 이 창을 끝내거나 닫기 전에는 다른 곳을 조작할 수 없다.",
    whenToUse: [
      "짧고 집중해야 하는 일 하나를 끝내야 다음으로 갈 수 있을 때(예: 저장할지 묻기)",
      "되돌릴 수 없는 실수를 막기 위해 한 번 더 확인받아야 할 때",
      "새 소식·이벤트처럼 꼭 필요하지 않은 정보에는 쓰지 않는다(NN/g)",
    ],
    confusedWith: [
      {
        slug: "bottom-sheet",
        difference: "모달은 화면 가운데에 떠서 흐름을 멈추고, 바텀시트는 아래에서 올라와 지금 화면과 이어진 내용을 보여 준다.",
      },
      {
        slug: "alert",
        difference: "모달은 무엇이든 담는 창이고, 알럿은 짧은 문장과 버튼 한두 개로 꼭 답해야 하는 경고·확인만 담는 모달이다.",
      },
      {
        slug: "fullscreen-overlay",
        difference: "모달은 뒤 화면이 비쳐 보이는 작은 창이고, 전체 화면 오버레이는 화면을 통째로 덮는다.",
      },
      {
        slug: "popover",
        difference: "모달은 뒤 화면을 막고, 팝오버는 막지 않아 바깥을 누르면 그냥 닫힌다.",
      },
    ],
    antiPattern: {
      title: "사소한 안내를 닫을 수 없는 모달로 띄우기",
      description:
        "들어오자마자 '새 기능' 안내 모달이 화면을 막고, 닫기 버튼·바깥 클릭·Esc가 모두 안 통한다. 사용자는 하려던 일을 못 하고 작은 글씨를 찾아 헤맨다. 꼭 필요한 일에만 모달을 쓰고, 언제나 닫을 방법을 분명히 둔다.",
    },
    aiPrompt:
      "'편집 끝내기'를 누르면 '변경 사항을 저장할까요?' 모달을 띄워 줘. role=\"dialog\", aria-modal, 제목 연결을 넣고, 열리면 포커스를 안으로 옮겨 가두고 Esc·바깥 클릭·닫기 버튼으로 닫히면 원래 버튼으로 포커스를 돌려줘.",
    code: {
      language: "tsx",
      snippet: `// 네이티브 <dialog>는 포커스 가두기·Esc·배경 막기를 기본으로 해 준다
function SaveDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button onClick={() => ref.current?.showModal()}>편집 끝내기</button>
      <dialog
        ref={ref}
        aria-labelledby="save-title"
        onClick={(e) => e.target === ref.current && ref.current.close()} // 바깥(backdrop) 클릭
        className="rounded-2xl p-4 backdrop:bg-black/40"
      >
        <h2 id="save-title">변경 사항을 저장할까요?</h2>
        <p>저장하지 않으면 마지막 수정 내용이 사라져요.</p>
        <form method="dialog">
          <button value="discard">저장 안 함</button>
          <button value="save" autoFocus>저장</button>
        </form>
      </dialog>
    </>
  );
}`,
    },
    sources: [
      { label: "NN/g — Modal & Nonmodal Dialogs", url: "https://www.nngroup.com/articles/modal-nonmodal-dialog/" },
      { label: "Material Design 3 — Dialogs", url: "https://m3.material.io/components/dialogs/overview" },
      { label: "The Component Gallery — Modal", url: "https://component.gallery/components/modal/" },
    ],
  },
  {
    slug: "alert",
    category: "overlay",
    nameKo: "알럿",
    nameEn: "Alert",
    aliases: ["Alert dialog", "경고창", "확인 대화상자", "Confirmation dialog", "얼럿", "컨펌창"],
    nameNote:
      "여기서 알럿은 Apple HIG의 Alert, 즉 중요한 정보나 확인을 위해 띄우는 작은 모달 대화상자다. The Component Gallery의 'Alert'는 화면 안에 놓이는 알림 메시지(배너에 가까운 것)를 뜻하므로 다른 것이다.",
    oneLiner: "짧은 제목·설명과 버튼 한두 개만 있는 작은 모달. 사용자가 답해야만 닫힌다.",
    whenToUse: [
      "삭제처럼 되돌릴 수 없는 동작을 하기 직전에 확인받을 때",
      "지금 바로 알아야 하는 문제(저장 실패, 연결 끊김)를 알릴 때",
      "자주 하는 일마다 띄우면 습관처럼 '확인'을 누르게 되니 드물게 쓴다(Apple HIG)",
    ],
    confusedWith: [
      {
        slug: "modal",
        difference: "알럿은 문장과 버튼만 있는 가장 작은 모달이고, 모달은 입력 폼 같은 더 많은 내용을 담는다.",
      },
      {
        slug: "action-sheet",
        difference: "알럿은 '할까요?'에 답을 받고, 액션시트는 사용자가 시작한 일에서 고를 선택지를 여러 개 보여 준다.",
      },
      {
        slug: "undo",
        difference: "알럿은 하기 전에 묻고, 되돌리기는 먼저 실행한 뒤 취소할 기회를 준다.",
      },
    ],
    antiPattern: {
      title: "'확인/취소'처럼 뜻이 흐린 버튼",
      description:
        "제목은 '알림', 내용은 '작업을 진행하시겠습니까?', 버튼은 '확인'과 '취소'. 무엇이 삭제되는지, '확인'이 무엇을 하는지 알 수 없다. 버튼에는 '삭제'처럼 동작을 적고, 파괴적인 버튼은 색으로 구분한다.",
    },
    aiPrompt:
      "메모 삭제 버튼을 누르면 role=\"alertdialog\" 확인창을 띄워 줘. 제목은 '메모를 삭제할까요?', 버튼은 '취소'와 빨간 '삭제'로 동작을 적고, 처음 포커스는 '취소'에 둬.",
    code: {
      language: "tsx",
      snippet: `<div
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="del-title"
  aria-describedby="del-desc"
>
  <h2 id="del-title">메모를 삭제할까요?</h2>
  <p id="del-desc">'여행 준비물 목록'이 삭제되며 되돌릴 수 없어요.</p>
  {/* 안전한 쪽에 먼저 포커스 */}
  <button autoFocus onClick={onCancel}>취소</button>
  <button className="text-red-600" onClick={onDelete}>삭제</button>
</div>`,
    },
    sources: [
      { label: "Apple HIG — Alerts", url: "https://developer.apple.com/design/human-interface-guidelines/alerts" },
      { label: "NN/g — Modal & Nonmodal Dialogs", url: "https://www.nngroup.com/articles/modal-nonmodal-dialog/" },
    ],
  },
  {
    slug: "bottom-sheet",
    category: "overlay",
    nameKo: "바텀시트",
    nameEn: "Bottom sheet",
    aliases: ["Sheet", "하단 시트", "Modal bottom sheet", "바텀 시트"],
    nameNote:
      "Material Design 3는 Bottom sheet라 부르고 뒤를 막는 modal과 막지 않는 standard로 나눈다. Apple HIG는 Sheet라고 부르며 높이를 단계(detent)로 조절한다.",
    oneLiner: "화면 아래에서 올라와 지금 화면과 관련된 내용이나 선택지를 보여 주는 판. 끌어내려 닫는다.",
    whenToUse: [
      "모바일에서 지금 화면에 딸린 보조 내용·설정(정렬, 필터, 상세 정보)을 보여 줄 때",
      "원래 화면을 일부 보이게 두어 맥락을 잃지 않게 하고 싶을 때(NN/g)",
      "위쪽에 손잡이를 두어 끌어서 닫을 수 있다는 걸 보여 주고, 닫기 버튼도 함께 둔다",
    ],
    confusedWith: [
      {
        slug: "modal",
        difference: "바텀시트는 아래에서 올라와 일부만 덮고, 모달은 가운데 떠서 흐름을 멈춘다.",
      },
      {
        slug: "action-sheet",
        difference: "바텀시트는 무엇이든 담는 판이고, 액션시트는 동작 버튼 목록과 취소 버튼만 담는다.",
      },
      {
        slug: "drawer",
        difference: "바텀시트는 아래에서, 드로어는 옆에서 나온다. 드로어는 주로 메뉴·보조 패널을 담는다.",
      },
    ],
    antiPattern: {
      title: "손잡이 없이 화면을 다 덮는 바텀시트",
      description:
        "시트가 화면 끝까지 올라와 원래 화면이 하나도 안 보이고, 손잡이도 없어 끌어 닫을 수 없으며, 바깥 클릭·Esc도 안 통한다. 그러면 바텀시트를 쓸 이유(맥락 유지)가 사라진다. 높이를 내용에 맞추고, 닫는 방법을 여러 개 둔다.",
    },
    aiPrompt:
      "정렬 버튼을 누르면 아래에서 바텀시트가 올라오게 해 줘. 위에 손잡이를 두고 아래로 80px 넘게 끌면 닫히며, 배경 클릭·Esc·'완료' 버튼으로도 닫히고 포커스는 시트 안에 가둬 줘.",
    code: {
      language: "tsx",
      snippet: `<motion.div
  role="dialog"
  aria-modal="true"
  aria-labelledby="sheet-title"
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={{ top: 0, bottom: 1 }}  // 아래로만 늘어나게
  onDragEnd={(_, info) => {
    if (info.offset.y > 80 || info.velocity.y > 500) onClose();
  }}
  className="fixed inset-x-0 bottom-0 rounded-t-2xl bg-white p-4"
>
  <div aria-hidden className="mx-auto h-1 w-9 rounded-full bg-gray-300" />
  <h2 id="sheet-title">정렬</h2>
  {children}
</motion.div>`,
    },
    sources: [
      { label: "Material Design 3 — Bottom sheets", url: "https://m3.material.io/components/bottom-sheets/overview" },
      { label: "NN/g — Bottom Sheets", url: "https://www.nngroup.com/articles/bottom-sheet/" },
      { label: "Apple HIG — Sheets", url: "https://developer.apple.com/design/human-interface-guidelines/sheets" },
    ],
  },
  {
    slug: "action-sheet",
    category: "overlay",
    nameKo: "액션시트",
    nameEn: "Action sheet",
    aliases: ["Action menu", "하단 선택 메뉴", "액션 시트"],
    nameNote:
      "Action sheet는 Apple HIG의 이름이다. Material Design에는 같은 이름의 컴포넌트가 없고, 비슷한 일을 바텀시트나 메뉴로 한다.",
    oneLiner: "사용자가 시작한 일에 대해 고를 수 있는 동작 목록을 아래에서 띄우고, 따로 떨어진 '취소'를 함께 주는 시트.",
    whenToUse: [
      "사진의 '더 보기'처럼 한 대상에 할 수 있는 동작 2~5개를 고르게 할 때",
      "삭제처럼 파괴적인 동작을 다른 선택지와 함께 보여 주되 빨간색으로 구분할 때",
      "언제나 '취소'를 목록과 떨어뜨려 두어 아무것도 안 하고 빠져나갈 수 있게 한다(Apple HIG)",
    ],
    confusedWith: [
      {
        slug: "bottom-sheet",
        difference: "액션시트는 동작 버튼 목록만 담고, 바텀시트는 폼·정보 등 무엇이든 담는다.",
      },
      {
        slug: "alert",
        difference: "액션시트는 여러 선택지 중 고르게 하고, 알럿은 '할까요?'에 예·아니오를 받는다.",
      },
      {
        slug: "popover",
        difference: "액션시트는 모바일에서 아래에 뜨는 모달이고, 팝오버는 누른 자리 옆에 붙어 뜨는 비모달 패널이다.",
      },
    ],
    antiPattern: {
      title: "삭제가 맨 위에, 구분 없이, 취소도 없이",
      description:
        "'사진 삭제'가 다른 선택지와 같은 모양으로 맨 위에 있고, 취소 버튼이 없어 실수로 누르기 쉽고 그냥 빠져나갈 방법도 없다. 파괴적인 동작은 빨간색으로 구분하고, 취소는 따로 떨어뜨려 둔다.",
    },
    aiPrompt:
      "사진 화면의 ··· 버튼을 누르면 아래에서 액션시트를 띄워 줘. '공유하기', '앨범에 추가', 빨간 '사진 삭제'를 묶고 그 아래 떨어진 '취소' 버튼을 두며, Esc와 배경 클릭으로도 닫혀야 해.",
    code: {
      language: "tsx",
      snippet: `<div role="dialog" aria-modal="true" aria-labelledby="as-title"
     className="fixed inset-x-0 bottom-0 space-y-2 p-2">
  <div className="overflow-hidden rounded-2xl bg-white">
    <p id="as-title" className="py-2 text-center text-xs text-gray-500">
      이 사진으로 할 일
    </p>
    <button onClick={onShare}>공유하기</button>
    <button onClick={onAddToAlbum}>앨범에 추가</button>
    <button className="text-red-600" onClick={onDelete}>사진 삭제</button>
  </div>
  {/* 취소는 목록과 떨어뜨린다 */}
  <button autoFocus className="w-full rounded-2xl bg-white font-semibold" onClick={onClose}>
    취소
  </button>
</div>`,
    },
    sources: [
      { label: "Apple HIG — Action sheets", url: "https://developer.apple.com/design/human-interface-guidelines/action-sheets" },
      { label: "Material Design 3 — Bottom sheets", url: "https://m3.material.io/components/bottom-sheets/overview" },
    ],
  },
  {
    slug: "drawer",
    category: "overlay",
    nameKo: "사이드시트·드로어",
    nameEn: "Side sheet / Drawer",
    aliases: [
      "Side sheet",
      "Navigation drawer",
      "Drawer",
      "Flyout",
      "Tray",
      "Off-canvas",
      "서랍 메뉴",
      "햄버거 메뉴 패널",
      "드로어",
      "사이드 시트",
    ],
    nameNote:
      "Material Design 3는 보조 내용을 담는 Side sheet와 내비게이션을 담는 Navigation drawer를 나눈다. The Component Gallery는 Drawer의 다른 이름으로 Tray, Flyout, Sheet를 든다.",
    oneLiner: "화면 옆에서 밀려 나오는 패널. 메뉴나 보조 내용을 담고, 끌거나 바깥을 눌러 닫는다.",
    whenToUse: [
      "자주 안 쓰는 보조 메뉴(설정, 공지, 고객센터)를 모아 둘 때",
      "목록을 보면서 한 항목의 상세나 필터를 옆에 펼칠 때(사이드시트)",
      "자주 쓰는 주요 메뉴는 드로어에 숨기지 말고 탭 바처럼 늘 보이게 둔다",
    ],
    confusedWith: [
      {
        slug: "bottom-sheet",
        difference: "드로어는 옆에서, 바텀시트는 아래에서 나온다. 드로어는 메뉴·보조 패널, 바텀시트는 지금 화면의 선택지에 주로 쓴다.",
      },
      {
        slug: "modal",
        difference: "드로어는 화면 가장자리에 붙어 일부만 덮고, 모달은 가운데 떠서 흐름을 멈춘다.",
      },
    ],
    antiPattern: {
      title: "주요 메뉴까지 드로어에 숨기기",
      description:
        "홈·검색·장바구니처럼 매번 쓰는 메뉴까지 햄버거 버튼 뒤 드로어에 넣으면, 사용자는 어디로 갈 수 있는지 보지 못하고 이동할 때마다 두 번 눌러야 한다. 주요 메뉴는 화면에 늘 보이게 두고 드로어에는 보조 메뉴만 넣는다.",
    },
    aiPrompt:
      "햄버거 버튼을 누르면 왼쪽에서 드로어가 밀려 나오게 해 줘. 버튼에 aria-expanded를 달고, 배경 클릭·Esc·왼쪽으로 끌기로 닫히며, 주요 메뉴는 하단 탭 바에 그대로 두고 드로어에는 설정·공지 같은 보조 메뉴만 넣어 줘.",
    code: {
      language: "tsx",
      snippet: `<button aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}>☰</button>

<AnimatePresence>
  {open && (
    <>
      <motion.div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <motion.nav
        role="dialog" aria-modal="true" aria-label="메뉴"
        initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 1, right: 0 }}
        onDragEnd={(_, i) => i.offset.x < -60 && setOpen(false)}
        className="fixed inset-y-0 left-0 w-72 bg-white"
      >
        {secondaryLinks}
      </motion.nav>
    </>
  )}
</AnimatePresence>`,
    },
    sources: [
      { label: "Material Design 3 — Side sheets", url: "https://m3.material.io/components/side-sheets/overview" },
      { label: "The Component Gallery — Drawer", url: "https://component.gallery/components/drawer/" },
    ],
  },
  {
    slug: "popover",
    category: "overlay",
    nameKo: "팝오버",
    nameEn: "Popover",
    aliases: ["Popup", "Flyout", "말풍선 패널", "팝업 메뉴"],
    nameNote:
      "Apple HIG와 The Component Gallery 모두 Popover라고 부른다. '팝업'은 모달·팝오버·새 창을 두루 가리키는 넓은 말이라 별칭으로만 둔다.",
    oneLiner: "누른 버튼 옆에 붙어 뜨는 작은 패널. 뒤 화면을 막지 않고, 바깥을 누르면 닫힌다.",
    whenToUse: [
      "누른 대상과 바로 이어지는 짧은 선택지·정보를 그 자리에서 보여 줄 때(공유 옵션, 짧은 설정)",
      "넓은 화면에서 모달보다 가볍게 띄우고 싶을 때(Apple HIG)",
      "내용이 길거나 입력이 많으면 바깥 클릭에 사라질 수 있으니 모달이나 새 화면을 쓴다",
    ],
    confusedWith: [
      {
        slug: "tooltip",
        difference: "툴팁은 올리거나 포커스하면 뜨는 짧은 설명 글이고, 팝오버는 눌러서 열며 버튼·링크처럼 누를 수 있는 내용을 담는다.",
      },
      {
        slug: "modal",
        difference: "팝오버는 뒤 화면을 막지 않고 누른 자리에 붙어 뜨며, 모달은 화면을 막고 가운데 뜬다.",
      },
    ],
    antiPattern: {
      title: "긴 입력 폼을 팝오버에 넣기",
      description:
        "배송지 입력처럼 칸이 많은 폼을 작은 팝오버에 넣으면, 안에서 스크롤해야 하고 실수로 바깥을 누르는 순간 입력한 내용이 모두 사라진다. 길거나 중요한 입력은 모달이나 별도 화면으로 옮긴다.",
    },
    aiPrompt:
      "'공유' 버튼을 누르면 버튼 아래에 붙는 팝오버로 '링크 복사·메일로 보내기·QR 코드 보기'를 보여 줘. aria-expanded·aria-controls를 달고 바깥 클릭과 Esc로 닫히며, Esc로 닫으면 포커스를 버튼으로 돌려줘.",
    code: {
      language: "tsx",
      snippet: `// HTML popover 속성: 바깥 클릭·Esc 닫기를 브라우저가 해 준다
<button popoverTarget="share" aria-haspopup="dialog">공유</button>
<div id="share" popover="auto" role="dialog" aria-label="공유 옵션"
     className="rounded-xl border bg-white p-2 shadow-xl">
  <button>링크 복사</button>
  <button>메일로 보내기</button>
  <button>QR 코드 보기</button>
</div>

/* 버튼 옆에 붙이기: CSS anchor positioning (지원 브라우저) */
/* #share { position-anchor: --share; top: anchor(bottom); right: anchor(right); } */`,
    },
    sources: [
      { label: "Apple HIG — Popovers", url: "https://developer.apple.com/design/human-interface-guidelines/popovers" },
      { label: "The Component Gallery — Popover", url: "https://component.gallery/components/popover/" },
    ],
  },
  {
    slug: "fullscreen-overlay",
    category: "overlay",
    nameKo: "전체 화면 오버레이",
    nameEn: "Full-screen overlay",
    aliases: ["Full-screen dialog", "Full-screen modal", "전체 화면 모달", "Takeover", "풀스크린 오버레이"],
    nameNote:
      "'Full-screen overlay'는 생김새를 설명한 이름이지 표준 컴포넌트 이름이 아니다. Material Design 3는 Dialogs 안에서 Full-screen dialog로, Apple HIG Modality는 전체 화면 모달 표시(full-screen modal)로 다룬다. 새 이름을 만들지 않고 이 별칭들로 함께 보여 준다.",
    oneLiner: "지금 화면을 통째로 덮고 한 가지 일에만 집중하게 하는 층. 위쪽에 닫기·취소가 있다.",
    whenToUse: [
      "모바일에서 검색처럼 입력과 결과에 화면 전체가 필요한 일을 할 때",
      "작은 화면에서 여러 칸을 채워야 하는 작업(일정 만들기 등)을 할 때(Material Full-screen dialog)",
      "언제나 위쪽에 '닫기'나 '취소'를 분명히 두어 원래 화면으로 돌아갈 수 있게 한다",
    ],
    confusedWith: [
      {
        slug: "modal",
        difference: "전체 화면 오버레이는 화면을 다 덮어 뒤가 안 보이고, 모달은 뒤 화면이 비쳐 보이는 작은 창이다.",
      },
      {
        slug: "bottom-sheet",
        difference: "바텀시트는 원래 화면을 일부 보이게 두고, 전체 화면 오버레이는 모두 덮는다.",
      },
    ],
    antiPattern: {
      title: "나갈 길이 안 보이는 전면 광고",
      description:
        "들어오자마자 화면 전체를 '앱 설치' 광고가 덮고, 닫기 버튼 없이 맨 아래 흐린 작은 글씨로만 빠져나갈 수 있다. 사용자는 갇혔다고 느끼고 떠난다. 전체 화면을 덮는다면 닫는 방법을 위쪽에 분명하게 둔다.",
    },
    aiPrompt:
      "검색창을 누르면 화면 전체를 덮는 검색 오버레이를 띄워 줘. 입력창에 바로 포커스를 주고 오른쪽 위 '취소'와 Esc로 닫히며, role=\"dialog\" aria-modal로 포커스를 안에 가둬 줘.",
    code: {
      language: "tsx",
      snippet: `{open && (
  <div
    role="dialog"
    aria-modal="true"
    aria-label="여행지 검색"
    className="fixed inset-0 z-50 flex flex-col bg-white"
    onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
  >
    <div className="flex items-center gap-2 border-b p-2">
      <input autoFocus aria-label="검색어" placeholder="어디로 떠나세요?" className="flex-1" />
      <button onClick={() => setOpen(false)}>취소</button>
    </div>
    <RecentSearches />
  </div>
)}`,
    },
    sources: [
      { label: "Material Design 3 — Dialogs (Full-screen dialog)", url: "https://m3.material.io/components/dialogs/overview" },
      { label: "Apple HIG — Modality", url: "https://developer.apple.com/design/human-interface-guidelines/modality" },
    ],
  },
  {
    slug: "context-menu",
    category: "overlay",
    nameKo: "컨텍스트 메뉴",
    nameEn: "Context menu",
    aliases: ["Contextual menu", "Right-click menu", "Long-press menu", "우클릭 메뉴", "길게 누르기 메뉴", "오른쪽 클릭 메뉴"],
    nameNote:
      "Apple HIG는 Context menu, NN/g는 Contextual menu라고 부른다. 데스크톱에서는 오른쪽 클릭, 모바일에서는 길게 누르기로 연다.",
    oneLiner: "항목을 오른쪽 클릭하거나 길게 누르면 그 자리에 그 항목에 쓸 수 있는 동작만 모아 띄우는 메뉴.",
    whenToUse: [
      "파일·사진·메시지처럼 항목마다 자주 쓰는 동작(공유, 이름 바꾸기, 삭제)을 빠르게 꺼내게 할 때",
      "숨은 손동작이라 모르는 사람이 많으니, 같은 동작을 '⋯' 버튼이나 다른 길로도 쓸 수 있게 할 때",
      "키보드로는 Shift+F10이나 메뉴 키로 열고, 화살표로 옮기고 Esc로 닫게 할 때",
    ],
    confusedWith: [
      {
        slug: "dropdown-menu",
        difference: "드롭다운 메뉴는 눈에 보이는 버튼을 눌러 열고, 컨텍스트 메뉴는 항목 자체를 오른쪽 클릭·길게 눌러 그 자리에서 연다.",
      },
      {
        slug: "action-sheet",
        difference: "액션시트는 버튼을 누르면 화면 아래에서 올라오는 선택지 목록이고, 컨텍스트 메뉴는 누른 항목 바로 옆에 뜬다.",
      },
    ],
    antiPattern: {
      title: "길게 눌러야만 나오는 동작",
      description:
        "삭제·공유 같은 동작을 길게 누르기로만 열 수 있으면, 그 손동작을 모르는 사용자와 키보드 사용자는 기능이 있다는 것조차 알 수 없다. 컨텍스트 메뉴는 지름길이어야지 유일한 길이면 안 된다.",
    },
    aiPrompt:
      "사진 격자에서 사진을 오른쪽 클릭하거나 0.5초 길게 누르면 그 위치에 role=\"menu\" 컨텍스트 메뉴(공유·즐겨찾기·이름 바꾸기·삭제)를 띄워 줘. 같은 메뉴를 사진 귀퉁이 '⋯' 버튼과 Shift+F10으로도 열고, 화살표로 이동, Esc로 닫으면 사진으로 포커스를 돌려줘.",
    code: {
      language: "tsx",
      snippet: `const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
const press = useRef<number>();

<button
  onContextMenu={(e) => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }); }}
  onPointerDown={(e) => {
    const { clientX: x, clientY: y } = e;
    press.current = window.setTimeout(() => setMenu({ x, y }), 500); // 길게 누르기
  }}
  onPointerUp={() => clearTimeout(press.current)}
  onKeyDown={(e) => {
    if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
      e.preventDefault();
      const r = e.currentTarget.getBoundingClientRect();
      setMenu({ x: r.left, y: r.bottom });
    }
  }}
>
  사진
</button>
<button aria-label="사진 더 보기" aria-haspopup="menu" onClick={openFromButton}>⋯</button>

{menu && (
  <div role="menu" style={{ position: "fixed", left: menu.x, top: menu.y }}>
    <button role="menuitem">공유</button>
    <button role="menuitem">삭제</button>
  </div>
)}`,
    },
    sources: [
      { label: "Apple HIG — Context menus", url: "https://developer.apple.com/design/human-interface-guidelines/context-menus" },
      { label: "NN/g — Contextual Menus: Delivering Relevant Tools for Tasks", url: "https://www.nngroup.com/articles/contextual-menus/" },
      { label: "WAI-ARIA APG — Menu Button Pattern", url: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" },
    ],
  },
  {
    slug: "share-sheet",
    category: "overlay",
    nameKo: "공유 시트",
    nameEn: "Share sheet",
    aliases: ["Activity view", "Share menu", "Native share", "공유하기", "공유 메뉴"],
    nameNote:
      "Apple HIG는 시스템 공유 화면을 Activity view라고 부르고, 흔히 share sheet라고 한다. 웹에서는 navigator.share()를 지원하는 기기에서 이 시스템 화면을 그대로 띄울 수 있다.",
    oneLiner: "공유 버튼을 누르면 아래에서 올라와 보낼 앱과 '링크 복사' 같은 동작을 한곳에 모아 보여 주는 시트.",
    whenToUse: [
      "글·사진·링크를 다른 앱이나 사람에게 보내게 할 때",
      "가능하면 운영체제의 공유 화면(navigator.share)을 쓰고, 지원하지 않을 때만 직접 만든 시트를 보여 줄 때",
      "어떤 환경에서도 되는 '링크 복사'를 항상 넣고, 무엇을 공유하는지 미리보기로 보여 줄 때",
    ],
    confusedWith: [
      {
        slug: "action-sheet",
        difference: "액션시트는 지금 항목에 할 동작을 고르고, 공유 시트는 보낼 곳(앱·사람)과 복사 같은 공유 동작을 고른다.",
      },
      {
        slug: "bottom-sheet",
        difference: "바텀시트는 아래에서 올라오는 판 전반이고, 공유 시트는 그 형태로 공유 대상을 모아 보여 주는 특정한 쓰임이다.",
      },
    ],
    antiPattern: {
      title: "이름 없는 작은 SNS 아이콘 12개",
      description:
        "가운데 팝업에 작은 소셜 아이콘만 잔뜩 늘어놓고 이름도 '링크 복사'도 없으면, 무엇을 눌러야 할지 모르고 정작 가장 많이 쓰는 링크 복사를 할 수 없다.",
    },
    aiPrompt:
      "공유 버튼을 누르면 navigator.share가 있으면 그걸 쓰고, 없으면 아래에서 올라오는 공유 시트를 보여 줘. 시트에는 공유할 글 미리보기, 앱 4개(이름 포함), '링크 복사' 버튼을 넣고, Esc·배경 클릭·아래로 끌기로 닫히게 해 줘.",
    code: {
      language: "ts",
      snippet: `async function share(data: { title: string; url: string }, openFallbackSheet: () => void) {
  if (navigator.share) {
    try {
      await navigator.share(data);      // 운영체제 공유 화면
      return;
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return; // 사용자가 닫음
    }
  }
  openFallbackSheet();                  // 직접 만든 공유 시트
}

async function copyLink(url: string) {
  await navigator.clipboard.writeText(url);
}`,
    },
    sources: [
      { label: "Apple HIG — Activity views", url: "https://developer.apple.com/design/human-interface-guidelines/activity-views" },
      { label: "Material Design 3 — Bottom sheets", url: "https://m3.material.io/components/bottom-sheets/overview" },
    ],
  },
];
