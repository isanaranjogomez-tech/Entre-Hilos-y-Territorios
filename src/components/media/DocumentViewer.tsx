import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { ui, type Lang } from '@/lib/i18n';

export interface ViewerItem {
  title: string;
  /** Resolved URL (already passed through asset()). */
  src: string;
  downloadSrc?: string;
  /** File name offered on download. */
  fileName?: string;
  kind: 'image' | 'pdf' | 'video';
  alt?: string;
}

interface Props {
  item: ViewerItem;
  open: boolean;
  onClose: () => void;
  lang?: Lang;
}

const MIN = 1;
const MAX = 5;

/**
 * Full-screen viewer for an original academic deliverable. Images: zoom
 * (buttons, wheel, +/−), drag to pan. PDFs: the browser's own viewer (pages,
 * zoom, full screen). Video: native controls. The page underneath never
 * scrolls, so closing returns to exactly the same place.
 */
export function DocumentViewer({ item, open, onClose, lang = 'es' }: Props) {
  const t = ui[lang];
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const zoom = useCallback((delta: number) => {
    setScale((s) => {
      const next = Math.min(MAX, Math.max(MIN, +(s + delta).toFixed(2)));
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    closeBtn.current?.focus({ preventScroll: true });
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      if (item.kind !== 'image') return;
      if (e.key === '+' || e.key === '=') zoom(0.5);
      if (e.key === '-') zoom(-0.5);
      if (e.key === '0') {
        setScale(1);
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      html.style.overflow = prev;
      (lastFocus.current as HTMLElement | null)?.focus?.({ preventScroll: true });
      setScale(1);
      setPos({ x: 0, y: 0 });
    };
  }, [open, zoom, item.kind]);

  if (!open) return null;

  const onDown = (e: RPointerEvent) => {
    if (scale === 1) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  };
  const onMove = (e: RPointerEvent) => {
    if (!drag.current) return;
    setPos({ x: drag.current.px + (e.clientX - drag.current.x), y: drag.current.py + (e.clientY - drag.current.y) });
  };
  const onUp = () => (drag.current = null);
  const btn = 'rounded-full border border-ivory/25 px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ivory transition-colors hover:border-ivory';

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${t.viewerLabel}: ${item.title}`} lang={lang} className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-[var(--gutter)] py-3">
        <p className="meta truncate text-ivory/70">{item.title}</p>
        <div className="flex items-center gap-2">
          {item.kind === 'image' && (
            <>
              <button className={btn} onClick={() => zoom(-0.5)} aria-label={t.zoomOut}>
                −
              </button>
              <span className="w-12 text-center font-mono text-xs text-ivory/60" aria-live="polite">
                {Math.round(scale * 100)}%
              </span>
              <button className={btn} onClick={() => zoom(0.5)} aria-label={t.zoomIn}>
                +
              </button>
            </>
          )}
          <a className={btn} href={item.downloadSrc ?? item.src} download={item.fileName ?? ''}>
            {t.download}
          </a>
          <button ref={closeBtn} className={btn} onClick={onClose} aria-label={t.close}>
            ✕
          </button>
        </div>
      </div>
      {item.kind === 'pdf' && <iframe title={item.title} src={`${item.src}#view=FitH`} className="h-full w-full flex-1 bg-ivory" />}
      {item.kind === 'video' && (
        <div className="grid flex-1 place-items-center p-4">
          <video src={item.src} controls playsInline className="max-h-full max-w-full bg-black" aria-label={item.title} />
        </div>
      )}
      {item.kind === 'image' && (
        <div
          className={`relative flex-1 overflow-hidden ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
          onWheel={(e) => zoom(e.deltaY < 0 ? 0.25 : -0.25)}
          onDoubleClick={() => (scale > 1 ? (setScale(1), setPos({ x: 0, y: 0 })) : setScale(2.5))}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          style={{ touchAction: scale > 1 ? 'none' : 'pan-y' }}
        >
          <img
            src={item.src}
            alt={item.alt ?? item.title}
            draggable={false}
            className="absolute left-1/2 top-1/2 max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)] select-none object-contain"
            style={{
              transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale})`,
              transition: drag.current ? 'none' : 'transform .35s cubic-bezier(.2,.7,.2,1)',
            }}
          />
          <p className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ivory/40 sm:block">{t.zoomHelp}</p>
        </div>
      )}
    </div>,
    document.body,
  );
}
