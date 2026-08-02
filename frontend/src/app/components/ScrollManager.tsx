import { useEffect } from "react";
import { useLocation } from "react-router";
import { goto } from "../data/constants";

/**
 * On every route change: open full pages at the very top, and land hash links
 * (e.g. /#branches) on their section — pinned there while images load in.
 */
export function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    // Wait a frame so the target section exists before scrolling to it.
    const id = window.setTimeout(() => goto(hash), 60);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.hash, location.key]);

  return null;
}
