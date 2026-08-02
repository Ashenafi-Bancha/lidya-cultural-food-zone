import { useNavigate, useLocation } from "react-router";
import { goto, type NavLink } from "../data/constants";

/**
 * Navigates a NAV_LINK. Same-route links scroll to their section; links to a
 * different route navigate there (ScrollManager handles landing position).
 */
export function useNavGo() {
  const navigate = useNavigate();
  const location = useLocation();

  return (link: NavLink) => {
    const samePage = location.pathname === link.path;

    if (samePage) {
      if (link.hash) goto(link.hash);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(link.hash ? `${link.path}#${link.hash}` : link.path);
  };
}
