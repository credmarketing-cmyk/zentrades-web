'use client';

import { useEffect, useState } from 'react';

// Opens Supademo product tours (links to app.supademo.com/demo/<id>) in a
// modal, like the popups on the WordPress site. Without JavaScript the link
// still opens the tour in a new page.
export default function DemoModal() {
  const [demo, setDemo] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="app.supademo.com/demo/"]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const id = a.getAttribute('href')!.split('/demo/')[1]?.split(/[?#/]/)[0];
      if (!id) return;
      e.preventDefault();
      setDemo(id);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDemo(null);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (!demo) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [demo]);

  if (!demo) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product tour"
      onClick={() => setDemo(null)}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(1,1,1,.72)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', padding: 20 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: 'min(1200px, 100%)', aspectRatio: '16 / 10', maxHeight: '88vh', background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 80px -30px rgba(0,0,0,.6)' }}>
        <iframe
          src={`https://app.supademo.com/embed/${demo}?embed_v=2&utm_source=embed`}
          title="ZenTrades product tour"
          allow="clipboard-write; fullscreen"
          style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
        />
        <button
          onClick={() => setDemo(null)}
          aria-label="Close product tour"
          style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', border: 0, background: '#010101', color: '#fff', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
