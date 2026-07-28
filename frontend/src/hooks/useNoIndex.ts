import { useEffect } from 'react';

// Injects <meta name="robots" content="noindex, nofollow"> while an admin page
// is mounted so search engines don't index the admin area (this is a client
// rendered SPA, so per-route noindex must be set at runtime). The tag is
// removed on unmount to avoid leaking onto public pages during SPA navigation.
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
}
