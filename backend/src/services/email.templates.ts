import { env } from '../config/env';

/**
 * Branded, email-client-safe HTML templates for Lidya Cultural Food Zone.
 *
 * Email HTML rules honoured here:
 *  - Table-based layout (no flexbox/grid — many clients strip them)
 *  - All CSS inlined (clients strip <style> / external sheets)
 *  - Web-safe fonts only (Georgia for the "serif" brand feel, Arial for body)
 *  - Max width 600px, mobile-friendly
 *  - Solid brand colours (no gradient text — unreliable across clients)
 */

const BRAND = {
  dark: '#1e1008',
  darker: '#120a03',
  terracotta: '#c25e2a',
  gold: '#d4a843',
  cream: '#f5efe6',
  paper: '#ffffff',
  ink: '#2a1a0e',
  muted: '#7a5c3a',
  phone: '0920994499',
  phoneHref: 'tel:+251920994499',
};

export interface EmailDetail {
  label: string;
  value?: string | null;
}

export interface EmailButton {
  label: string;
  url: string;
}

export interface BrandedEmailOptions {
  /** Hidden preview text shown in the inbox list. */
  preheader?: string;
  /** Main heading. */
  heading: string;
  /** Heading colour — defaults to gold. Pass a status colour (green/red) when relevant. */
  accent?: string;
  /** Optional greeting line, e.g. "Dear Meron,". */
  greeting?: string;
  /** Body paragraphs. */
  paragraphs?: string[];
  /** Key/value detail rows rendered as a styled table. Empty values are skipped. */
  details?: EmailDetail[];
  /** Optional call-to-action button. */
  button?: EmailButton;
  /** Small muted note under the content. */
  note?: string;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function detailsTable(details: EmailDetail[]): string {
  const rows = details
    .filter((d) => d.value != null && String(d.value).trim() !== '')
    .map(
      (d) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #efe6d8;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.muted};white-space:nowrap;vertical-align:top;">${esc(d.label)}</td>
          <td style="padding:10px 0 10px 16px;border-bottom:1px solid #efe6d8;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${BRAND.ink};font-weight:bold;">${esc(String(d.value))}</td>
        </tr>`
    )
    .join('');

  if (!rows) return '';
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
      ${rows}
    </table>`;
}

export function brandedEmail(opts: BrandedEmailOptions): string {
  const accent = opts.accent || BRAND.gold;
  const websiteUrl = env.FRONTEND_URL || 'https://lidyafoodzone.com';

  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;height:0;width:0;">${esc(opts.preheader)}</div>`
    : '';

  const greeting = opts.greeting
    ? `<p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${BRAND.ink};">${esc(opts.greeting)}</p>`
    : '';

  const paragraphs = (opts.paragraphs || [])
    .map(
      (p) =>
        `<p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a3826;">${esc(p)}</p>`
    )
    .join('');

  const details = opts.details ? detailsTable(opts.details) : '';

  const button = opts.button
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" class="email-btn" style="margin:24px 0 4px;">
        <tr>
          <td style="border-radius:6px;background:${BRAND.terracotta};">
            <a href="${opts.button.url}" target="_blank" style="display:inline-block;padding:13px 30px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#faf5ee;text-decoration:none;">${esc(opts.button.label)}</a>
          </td>
        </tr>
      </table>`
    : '';

  const note = opts.note
    ? `<p style="margin:20px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${BRAND.muted};">${esc(opts.note)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light only" />
    <title>Lidya Cultural Food Zone</title>
    <style>
      /* Mobile polish — honoured by clients that support &lt;style&gt; (Gmail app,
         Apple Mail, iOS). Inline styles remain the fallback everywhere else. */
      @media only screen and (max-width: 480px) {
        .email-wrap { padding: 12px 8px !important; }
        .email-header { padding: 22px 18px !important; }
        .email-brand { font-size: 22px !important; }
        .email-body { padding: 24px 20px !important; }
        .email-h1 { font-size: 20px !important; line-height: 1.3 !important; }
        .email-footer { padding: 22px 20px !important; }
        .email-btn a { display: block !important; text-align: center !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.cream};">
    ${preheader}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-wrap" style="background:${BRAND.cream};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${BRAND.paper};border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(30,16,8,0.08);">

            <!-- Header -->
            <tr>
              <td class="email-header" style="background:${BRAND.dark};padding:28px 32px;text-align:center;">
                <div class="email-brand" style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:bold;letter-spacing:0.06em;color:${BRAND.gold};">LIDYA</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:${BRAND.cream};opacity:0.75;margin-top:4px;">Cultural Food Zone</div>
              </td>
            </tr>
            <tr><td style="height:4px;background:${BRAND.terracotta};line-height:4px;font-size:0;">&nbsp;</td></tr>

            <!-- Body -->
            <tr>
              <td class="email-body" style="padding:34px 32px 30px;">
                <h1 class="email-h1" style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.25;color:${accent};font-weight:bold;">${esc(opts.heading)}</h1>
                ${greeting}
                ${paragraphs}
                ${details}
                ${button}
                ${note}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="email-footer" style="background:${BRAND.darker};padding:26px 32px;text-align:center;">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${BRAND.gold};margin-bottom:10px;">Taste the Heritage of Ethiopia</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:#c9b79a;">
                  <a href="${BRAND.phoneHref}" style="color:${BRAND.gold};text-decoration:none;">${BRAND.phone}</a>
                  &nbsp;&middot;&nbsp;
                  <a href="${websiteUrl}" style="color:${BRAND.gold};text-decoration:none;">Visit our website</a>
                </div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8c7355;margin-top:8px;">Wolaita Sodo &middot; Addis Ababa, Ethiopia</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#6b573c;margin-top:14px;">&copy; ${'2026'} Lidya Cultural Food Zone. All rights reserved.</div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
