import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-2xl font-bold">없는 페이지예요</h1>
      <p className="mt-2 text-muted">주소를 확인하거나 위 검색창에서 패턴 이름을 찾아 보세요.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-accent-fg">
        도감으로
      </Link>
    </div>
  );
}
