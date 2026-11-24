import type { Metadata, Viewport } from "next";
import { Header } from "@/components/ui/Header";
import { SearchProvider } from "@/components/ui/SearchProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "UX 패턴 도감",
    template: "%s · UX 패턴 도감",
  },
  description: "매일 보지만 이름을 몰랐던 UI 패턴을 직접 눌러 보는 예시와 정확한 이름으로.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d10" },
  ],
};

// 첫 페인트 전에 테마를 정해 깜빡임을 막는다
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only z-50 rounded bg-accent px-3 py-2 text-accent-fg focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          본문으로 건너뛰기
        </a>
          <SearchProvider>
            <Header />
            <main id="main" className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
              {children}
            </main>
          </SearchProvider>
        <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-muted sm:px-6">
          이름과 정의는 NN/g, Material Design, Apple HIG, The Component Gallery 등 공개 출처를 근거로 했습니다. 각 패턴 페이지 아래에 출처 링크가 있습니다.
        </footer>
      </body>
    </html>
  );
}
