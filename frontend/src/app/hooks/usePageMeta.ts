import { useEffect } from "react";

const SITE = "https://lidyaculturalfood.com";

/**
 * Per-route SEO for the SPA: keeps the document title, meta description,
 * canonical URL and Open Graph tags in sync with the current page. Every
 * public page calls this, so navigating always overwrites the previous
 * page's values — no cleanup needed.
 */
export function usePageMeta(title: string, description: string, path: string) {
  useEffect(() => {
    document.title = title;

    document.querySelector('meta[name="description"]')?.setAttribute("content", description);

    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.setAttribute("rel", "canonical");
      document.head.appendChild(canon);
    }
    canon.setAttribute("href", SITE + path);

    const og = (prop: string, value: string) =>
      document.querySelector(`meta[property="${prop}"]`)?.setAttribute("content", value);
    og("og:title", title);
    og("og:description", description);
    og("og:url", SITE + path);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
  }, [title, description, path]);
}
