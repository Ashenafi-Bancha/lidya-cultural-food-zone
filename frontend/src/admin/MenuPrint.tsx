import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useMenu, useCategories } from '../hooks/useMenu';
import logoImg from '@/imports/lidya-logo2.webp';
import { formatPrice } from "../lib/price";

/**
 * Print-ready A4 menu + digital-menu QR code.
 *
 * Printing uses a real print stylesheet rather than a PDF library so the text
 * stays vector (sharp on paper), Amharic renders with the real font, and no
 * heavy dependency (Puppeteer/Chromium) is needed on the server. Staff hit
 * "Print" and choose "Save as PDF" for an exact A4 file.
 */

const PAPER = '#fffdf8';
const INK = '#231508';
const GOLD = '#a67c1f';

export function MenuPrint() {
  const { data: menuData } = useMenu();
  const { data: catData } = useCategories();
  const [selected, setSelected] = useState<string[]>([]); // [] = all
  const [showAmharic, setShowAmharic] = useState(true);
  const [qrPng, setQrPng] = useState('');
  const [qrSvg, setQrSvg] = useState('');
  const printedAt = useRef(new Date());

  const menuUrl = `${window.location.origin}/menu`;

  useEffect(() => {
    QRCode.toDataURL(menuUrl, { width: 1200, margin: 1, errorCorrectionLevel: 'H',
      color: { dark: '#231508', light: '#ffffff' } }).then(setQrPng).catch(() => {});
    QRCode.toString(menuUrl, { type: 'svg', margin: 1, errorCorrectionLevel: 'H',
      color: { dark: '#231508', light: '#ffffff' } }).then(setQrSvg).catch(() => {});
  }, [menuUrl]);

  // Group dishes under their category, in category order.
  const groups = useMemo(() => {
    const items = menuData ?? [];
    const tree = [...(catData ?? [])].sort((a, b) => a.order - b.order);
    const out: Array<{ name: string; nameAm?: string | null; dishes: any[] }> = [];

    for (const parent of tree) {
      const children = [...(parent.children ?? [])].sort((a: any, b: any) => a.order - b.order);
      if (children.length) {
        for (const child of children) {
          const dishes = items.filter((i: any) => (i.category?.name || i.cat) === child.name);
          if (dishes.length) out.push({ name: child.name, nameAm: (child as any).nameAm, dishes });
        }
      }
      const direct = items.filter((i: any) => (i.category?.name || i.cat) === parent.name);
      if (direct.length) out.push({ name: parent.name, nameAm: (parent as any).nameAm, dishes: direct });
    }
    // Anything on a retired category still gets printed.
    const known = new Set(out.flatMap(g => g.dishes.map((d: any) => d.id)));
    const orphans = items.filter((i: any) => !known.has(i.id));
    if (orphans.length) out.push({ name: 'Other', dishes: orphans });
    return out;
  }, [menuData, catData]);

  const visible = selected.length ? groups.filter(g => selected.includes(g.name)) : groups;

  const toggle = (name: string) =>
    setSelected(s => (s.includes(name) ? s.filter(x => x !== name) : [...s, name]));

  const downloadQr = (kind: 'png' | 'svg') => {
    const a = document.createElement('a');
    if (kind === 'png') {
      a.href = qrPng;
      a.download = 'lidya-digital-menu-qr.png';
    } else {
      a.href = URL.createObjectURL(new Blob([qrSvg], { type: 'image/svg+xml' }));
      a.download = 'lidya-digital-menu-qr.svg';
    }
    a.click();
  };

  const effectiveDate = printedAt.current.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div>
      {/* ─── Print rules: exact A4, hide the admin chrome ─────────────── */}
      <style>{`
        @page { size: A4 portrait; margin: 14mm 13mm; }
        @media print {
          html, body { background: #fff !important; }
          body * { visibility: hidden !important; }
          #menu-print-sheet, #menu-print-sheet * { visibility: visible !important; }
          #menu-print-sheet {
            position: absolute; inset: 0; margin: 0; width: 100%;
            box-shadow: none !important; border: 0 !important; padding: 0 !important;
          }
          .print-group { break-inside: avoid; page-break-inside: avoid; }
          .print-dish  { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      {/* ─── Controls (screen only) ───────────────────────────────────── */}
      <div className="print:hidden mb-6">
        <h1 className="text-2xl font-bold text-[#1e1008] mb-1">Print Menu & Digital QR</h1>
        <p className="text-sm text-[#7a5c3a] mb-5">
          Prices come straight from the live menu. Choose the sections that changed, then
          print — pick “Save as PDF” in the print dialog for an A4 file.
        </p>

        <div className="bg-white border border-[#1e1008]/10 rounded-xl p-5 mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7a5c3a] mb-3">
            Sections to print {selected.length === 0 && <span className="font-normal normal-case">(none selected = print everything)</span>}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {groups.map(g => (
              <button
                key={g.name}
                onClick={() => toggle(g.name)}
                className="px-4 py-2 rounded-full text-xs border transition-colors"
                style={{
                  background: selected.includes(g.name) ? '#c25e2a' : 'transparent',
                  borderColor: selected.includes(g.name) ? '#c25e2a' : 'rgba(30,16,8,0.2)',
                  color: selected.includes(g.name) ? '#fff' : '#7a5c3a',
                }}
              >
                {g.name} <span className="opacity-60">({g.dishes.length})</span>
              </button>
            ))}
            {selected.length > 0 && (
              <button onClick={() => setSelected([])} className="px-4 py-2 rounded-full text-xs border border-transparent text-[#c25e2a] underline">
                Clear
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-[#1e1008] mb-4 cursor-pointer">
            <input type="checkbox" checked={showAmharic} onChange={e => setShowAmharic(e.target.checked)} />
            Include Amharic names
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-xl bg-[#c25e2a] text-white text-sm font-semibold hover:bg-[#a94e20] transition-colors"
            >
              Print / Save as PDF (A4)
            </button>
            <button onClick={() => downloadQr('png')} className="px-6 py-3 rounded-xl border border-[#1e1008]/20 text-sm text-[#1e1008] hover:border-[#c25e2a] transition-colors">
              Download QR — PNG
            </button>
            <button onClick={() => downloadQr('svg')} className="px-6 py-3 rounded-xl border border-[#1e1008]/20 text-sm text-[#1e1008] hover:border-[#c25e2a] transition-colors">
              Download QR — SVG
            </button>
          </div>
          <p className="text-xs text-[#7a5c3a] mt-3">
            The QR always points to <span className="font-mono">{menuUrl}</span> — print it once; it
            never needs replacing, because it opens whatever the menu says today.
          </p>
        </div>
      </div>

      {/* ─── The A4 sheet ─────────────────────────────────────────────── */}
      <div
        id="menu-print-sheet"
        className="mx-auto shadow-lg"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '16mm 15mm',
          background: PAPER,
          color: INK,
          fontFamily: 'var(--font-lidya-body)',
        }}
      >
        {/* header */}
        <header className="text-center pb-5 mb-7" style={{ borderBottom: `2px solid ${GOLD}` }}>
          <img src={logoImg} alt="" className="w-14 h-14 rounded-full object-cover mx-auto mb-3" />
          <h1 className="text-[26px] font-bold tracking-wide leading-tight" style={{ fontFamily: 'var(--font-lidya-serif)' }}>
            LIDYA CULTURAL FOOD ZONE
          </h1>
          <p className="text-[15px] mt-0.5" style={{ color: GOLD, fontFamily: 'var(--font-lidya-serif)' }}>
            ሊዲያ ባህላዊ ምግብ ቤት
          </p>
          <p className="text-[9px] tracking-[0.32em] uppercase mt-2" style={{ color: '#6b5336' }}>
            Authentic Ethiopian Cultural Cuisine
          </p>
        </header>

        {/* dish groups */}
        {visible.map(group => (
          <section key={group.name} className="print-group mb-7">
            <div className="flex items-center gap-3 mb-3.5">
              <span className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
              <h2 className="text-[15px] font-bold tracking-[0.22em] uppercase whitespace-nowrap" style={{ fontFamily: 'var(--font-lidya-serif)', color: GOLD }}>
                {group.name}
                {showAmharic && group.nameAm ? <span className="ml-2 font-normal">· {group.nameAm}</span> : null}
              </h2>
              <span className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
            </div>

            {group.dishes.map((d: any) => (
              <div key={d.id} className="print-dish mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-lidya-serif)' }}>
                    {d.name}
                    {showAmharic && d.nameAm ? <span className="font-normal" style={{ color: '#6b5336' }}> · {d.nameAm}</span> : null}
                  </span>
                  <span className="flex-1 border-b border-dotted" style={{ borderColor: 'rgba(35,21,8,0.3)', transform: 'translateY(-3px)' }} />
                  <span className="text-[13px] font-bold whitespace-nowrap" style={{ color: GOLD }}>{formatPrice(d.price)}</span>
                </div>
                {d.description && (
                  <p className="text-[10px] leading-snug mt-0.5 pr-16" style={{ color: '#6b5336' }}>{d.description}</p>
                )}
              </div>
            ))}
          </section>
        ))}

        {/* footer with QR */}
        <footer className="mt-8 pt-4 flex items-center gap-5" style={{ borderTop: `2px solid ${GOLD}` }}>
          {qrPng && <img src={qrPng} alt="Scan for the digital menu" className="w-[26mm] h-[26mm] shrink-0" />}
          <div className="flex-1 text-[9.5px] leading-relaxed" style={{ color: '#6b5336' }}>
            <p className="font-bold text-[11px] mb-1" style={{ color: INK, fontFamily: 'var(--font-lidya-serif)' }}>
              Scan for our always-up-to-date menu
            </p>
            <p>Addis Ababa — Lebu, Music Sefer · Wolaita Sodo 1 — Green Land Area · Wolaita Sodo 2</p>
            <p>0920994499 · letusletalemma@gmail.com</p>
            <p className="mt-1 italic">Prices effective {effectiveDate}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
