import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer } from 'lucide-react';
import logoImg from '../imports/lidya-logo2.webp';

// Table-stand QR card, reproducing the client's approved design: dark lattice
// header with logo and brand, cream panel holding the QR inside Ethiopian
// tri-colour corner brackets, social row, and a thank-you footer. Printed at
// 100×180mm on A4 so it slides into a standard acrylic table stand.
const MENU_URL = 'https://lidyaculturalfood.com/menu';

const DARK = '#241408';
const GOLD = '#d4a843';
const CREAM = '#f7f2e8';

// Subtle diamond lattice for the dark areas, as in the supplied design.
const LATTICE = {
  backgroundImage:
    'repeating-linear-gradient(45deg, rgba(212,168,67,0.07) 0 1px, transparent 1px 14px),' +
    'repeating-linear-gradient(-45deg, rgba(212,168,67,0.07) 0 1px, transparent 1px 14px)',
};

const SOCIALS: Array<{ label: string; bg: string; icon: React.ReactNode }> = [
  {
    label: 'Facebook', bg: '#1877F2',
    icon: <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />,
  },
  {
    label: 'Instagram', bg: 'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />,
  },
  {
    label: 'TikTok', bg: '#010101',
    icon: <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />,
  },
  {
    label: 'Telegram', bg: 'linear-gradient(180deg,#2AABEE 0%,#229ED9 100%)',
    icon: <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />,
  },
  {
    label: 'YouTube', bg: '#FF0000',
    icon: <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12z" />,
  },
];

export function QrTableCard() {
  const [qr, setQr] = useState('');

  useEffect(() => {
    QRCode.toDataURL(MENU_URL, { width: 900, margin: 0, errorCorrectionLevel: 'H' }).then(setQr);
  }, []);

  return (
    <div>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body * { visibility: hidden !important; }
          #qr-card-sheet, #qr-card-sheet * { visibility: visible !important; }
          #qr-card-sheet {
            position: absolute; inset: 0;
            display: flex; align-items: center; justify-content: center;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Screen-only controls */}
      <div className="print:hidden mb-6 flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table QR Card</h1>
          <p className="text-sm text-gray-500 mt-1">
            Prints one 100×180mm card centred on A4 — cut along the edge and slide it into the table stand.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c25e2a] text-white text-sm font-semibold hover:bg-[#a84e20] transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* The card */}
      <div id="qr-card-sheet" className="flex justify-center">
        <div
          style={{
            width: '100mm', height: '180mm', background: DARK, color: '#fff',
            borderRadius: '4.5mm', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
          }}
        >
          {/* ── Header ── */}
          <div style={{ ...LATTICE, background: DARK, textAlign: 'center', padding: '7mm 6mm 5mm' }}>
            <img
              src={logoImg}
              alt="Lidya Cultural Food Zone logo"
              style={{
                width: '21mm', height: '21mm', objectFit: 'cover', borderRadius: '50%',
                border: `1.2mm solid ${GOLD}`, margin: '0 auto', display: 'block',
                boxShadow: '0 0 0 0.5mm rgba(212,168,67,0.35)',
              }}
            />
            <div style={{ marginTop: '3.5mm', fontFamily: 'var(--font-lidya-serif, serif)', fontSize: '17pt', fontWeight: 700, lineHeight: 1.15 }}>
              <span style={{ color: '#fff' }}>Lidya </span>
              <em style={{ color: GOLD }}>Cultural Food Zone</em>
            </div>
            <div style={{ marginTop: '1.6mm', color: GOLD, fontSize: '9.5pt', fontFamily: "'Noto Serif Ethiopic', serif" }}>
              ሊዲያ የባህል ምግብ ዞን
            </div>
          </div>

          {/* tri-colour divider accents */}
          <div style={{ position: 'relative', height: '1.4mm', background: DARK }}>
            <span style={{ position: 'absolute', left: 0, top: 0, width: '12mm', height: '100%', background: GOLD }} />
            <span style={{ position: 'absolute', right: '4mm', top: 0, width: '4mm', height: '100%', background: '#1f8a3b' }} />
            <span style={{ position: 'absolute', right: 0, top: 0, width: '4mm', height: '100%', background: '#e11d2a' }} />
          </div>

          {/* ── Cream body ── */}
          <div style={{ background: CREAM, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5mm 6mm 4mm' }}>
            <div style={{ background: '#fdfbf6', borderRadius: '3.5mm', padding: '4.5mm 5mm', width: '100%', textAlign: 'center', boxShadow: '0 2px 10px rgba(36,20,8,0.10)' }}>
              <div style={{ fontFamily: 'var(--font-lidya-serif, serif)', fontSize: '17pt', fontWeight: 700, color: '#241408' }}>Our Menu</div>
              <div style={{ marginTop: '1.2mm', color: '#c8901f', fontSize: '7.5pt', letterSpacing: '0.28em', fontWeight: 700 }}>SCAN FOR OUR MENU</div>
              <div style={{ marginTop: '1mm', color: '#5a4630', fontSize: '8pt', fontFamily: "'Noto Serif Ethiopic', serif" }}>ሜኑውን ለማየት ኮዱን ይቃኙ</div>

              {/* QR inside Ethiopian-colour corner brackets */}
              <div style={{ position: 'relative', width: '46mm', height: '46mm', margin: '3.5mm auto 0' }}>
                {[
                  { pos: { left: '-2.5mm', top: '-2.5mm' }, b: 'borderLeft', b2: 'borderTop', color: '#e11d2a' },
                  { pos: { right: '-2.5mm', top: '-2.5mm' }, b: 'borderRight', b2: 'borderTop', color: '#f5c842' },
                  { pos: { left: '-2.5mm', bottom: '-2.5mm' }, b: 'borderLeft', b2: 'borderBottom', color: '#f5c842' },
                  { pos: { right: '-2.5mm', bottom: '-2.5mm' }, b: 'borderRight', b2: 'borderBottom', color: '#1f8a3b' },
                ].map((c, i) => (
                  <span key={i} style={{ position: 'absolute', width: '8mm', height: '8mm', ...(c.pos as any), [c.b]: `1.1mm solid ${c.color}`, [c.b2]: `1.1mm solid ${c.color}` } as any} />
                ))}
                {qr && <img src={qr} alt={`QR code linking to ${MENU_URL}`} style={{ width: '100%', height: '100%' }} />}
              </div>

              <div style={{ marginTop: '3mm', color: '#7a6a55', fontSize: '7pt' }}>⛶ Point your QR or Barcode scanner</div>
            </div>

            {/* domain pill */}
            <div style={{ marginTop: '4mm', background: DARK, color: '#f5e9c9', borderRadius: '99mm', padding: '2.2mm 6mm', fontSize: '9pt', fontWeight: 600 }}>
              🌐 lidyaculturalfood.com
            </div>

            {/* follow us */}
            <div style={{ marginTop: '3.5mm', color: '#c8901f', fontSize: '7pt', letterSpacing: '0.3em', fontWeight: 700 }}>FOLLOW US</div>
            <div style={{ marginTop: '2mm', display: 'flex', gap: '2.6mm' }}>
              {SOCIALS.map(s => (
                <span key={s.label} title={s.label} style={{ width: '8.4mm', height: '8.4mm', borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" style={{ width: '4.6mm', height: '4.6mm' }} fill="#ffffff">{s.icon}</svg>
                </span>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{ ...LATTICE, background: DARK, textAlign: 'center', padding: '4.5mm 6mm 6mm' }}>
            <div style={{ display: 'inline-block', border: `0.4mm solid ${GOLD}`, borderRadius: '99mm', padding: '1.8mm 6mm', color: '#f5e9c9', fontSize: '8.5pt', letterSpacing: '0.12em', fontWeight: 600 }}>
              ✆ CALL US&nbsp;&nbsp;0920 99 44 99
            </div>
            <div style={{ marginTop: '3mm', fontFamily: 'var(--font-lidya-serif, serif)', fontStyle: 'italic', fontWeight: 700, fontSize: '13pt', color: '#fff' }}>
              Thank you for choosing us
            </div>
            <div style={{ marginTop: '1.4mm', color: GOLD, fontSize: '8.5pt', fontFamily: "'Noto Serif Ethiopic', serif" }}>
              ስለመረጡን እናመሰግናለን!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrTableCard;
