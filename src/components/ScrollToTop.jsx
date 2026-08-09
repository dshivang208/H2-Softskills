import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top on every route change.
 * React Router (BrowserRouter) does NOT do this automatically —
 * without it, the browser keeps the previous scroll position,
 * which is why footer/nav links can land mid-page instead of at the top.
 *
 * Render this once, inside <BrowserRouter>, above/alongside <Routes>.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;