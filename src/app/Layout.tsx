import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { chapters } from '@/content/project';
import { SiteHeader } from '@/components/navigation/SiteHeader';
import { NextChapter } from '@/components/navigation/NextChapter';
import { ScrollTrigger } from '@/lib/gsap';

const titles: Record<string, string> = Object.fromEntries(chapters.map((c) => [c.path, c.title]));

export function Layout() {
  const { pathname } = useLocation();
  const chapter = chapters.find((c) => c.path === pathname);

  // New page: update the title and re-measure scroll animations once laid out.
  useEffect(() => {
    document.title = titles[pathname] ? `${titles[pathname]} · Entre Hilos y Territorios` : 'Entre Hilos y Territorios · La Guajira 2026';
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <>
      <SiteHeader />
      <main id="contenido" key={pathname} lang={chapter?.lang ?? 'es'} className="page-enter">
        <Outlet />
        {chapter && <NextChapter from={chapter.id} />}
      </main>
      <ScrollRestoration />
    </>
  );
}
