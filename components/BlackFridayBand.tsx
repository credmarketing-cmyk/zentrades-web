'use client';
import { useEffect, useState } from 'react';

// Black Friday offer band (pricing page): live countdown, links to the offer
// page, gone once the offer has ended.
const END = Date.parse('2026-11-30T23:59:59-05:00');

const CSS = `
.zt-bfband, .zt-bfband *:not(svg, svg *) { all: revert; box-sizing: border-box; }
.zt-bfband { display: block; padding: 24px clamp(16px, 3vw, 40px) 0; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.zt-bfband a.band { position: relative; max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: auto auto 1fr; align-items: center; gap: clamp(20px, 3vw, 48px); padding: clamp(24px, 3vw, 44px) clamp(24px, 6vw, 96px); border-radius: clamp(20px, 2.6vw, 32px); overflow: hidden; background: #EE5566; color: #0E0E10; text-decoration: none; }
.zt-bfband .bf { margin: 0; color: #0E0E10 !important; font-weight: 900; font-size: clamp(32px, 4vw, 58px); line-height: .92; letter-spacing: -.045em; text-transform: uppercase; }
.zt-bfband .clock { display: inline-block; background: #fff; padding: 9px; border-radius: 20px; box-shadow: 0 8px 0 rgba(14,14,16,.18); }
.zt-bfband .clock-in { display: block; background: #0E0E10; border-radius: 13px; padding: 12px clamp(16px, 2.2vw, 28px) 14px; text-align: center; }
.zt-bfband .clock-label { display: block; font-family: 'Geist Mono', ui-monospace, monospace; font-size: 12px; letter-spacing: .32em; color: #F7C7CD; text-transform: uppercase; }
.zt-bfband .clock-time { display: block; margin-top: 6px; color: #fff !important; font-family: 'Geist Mono', ui-monospace, monospace; font-weight: 600; font-size: clamp(26px, 3vw, 44px); line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; }
.zt-bfband .msg { display: block; }
.zt-bfband .live { margin: 0; color: #fff !important; font-weight: 800; font-size: clamp(24px, 3vw, 44px); line-height: 1.05; letter-spacing: -.035em; }
.zt-bfband .claim { display: inline-flex; align-items: center; gap: 8px; margin-top: 12px; background: #0E0E10; color: #fff !important; border-radius: 999px; padding: 10px 18px; font-size: 15px; font-weight: 700; transition: background .2s, color .2s; }
.zt-bfband a.band:hover .claim { background: #fff; color: #0E0E10 !important; }
.zt-bfband .dot { position: absolute; border-radius: 50%; pointer-events: none; }
@media (max-width: 1080px) { .zt-bfband a.band { grid-template-columns: auto 1fr; } .zt-bfband .msg { grid-column: 1 / -1; } }
@media (max-width: 640px) { .zt-bfband a.band { grid-template-columns: 1fr; text-align: center; justify-items: center; } .zt-bfband .bf br, .zt-bfband .dot { display: none; } }
`;

const pad = (n: number) => String(n).padStart(2, '0');

export default function BlackFridayBand() {
  // Pre-rendered without a clock; it starts on the client.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now !== null && now >= END) return null;
  const d = now === null ? 0 : END - now;
  const time = now === null ? 'Nov 30' : `${Math.floor(d / 864e5)}D ${pad(Math.floor(d / 36e5) % 24)}:${pad(Math.floor(d / 6e4) % 60)}:${pad(Math.floor(d / 1e3) % 60)}`;
  return (
    <section className="zt-bfband" aria-label="Black Friday offer">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a className="band" href="/black-friday">
        <span className="dot" style={{ width: 26, height: 26, left: 40, top: 24, background: '#F9C846' }} />
        <span className="dot" style={{ width: 16, height: 16, right: '28%', top: 30, background: '#fff' }} />
        <span className="dot" style={{ width: 30, height: 30, right: 56, top: '46%', background: '#0E0E10' }} />
        <p className="bf">
          Black
          <br /> Friday
        </p>
        <span className="clock">
          <span className="clock-in">
            <span className="clock-label">Offer ends in</span>
            <span className="clock-time">{time}</span>
          </span>
        </span>
        <span className="msg">
          <p className="live">The Black Friday offer is live.</p>
          <span className="claim">
            Get 3 extra months free <span aria-hidden="true">→</span>
          </span>
        </span>
      </a>
    </section>
  );
}
