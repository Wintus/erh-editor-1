import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback
} from "react";
import { History } from "history";
import uuidv4 from "uuidv4";

import Index from "./pages/Index";
import Edit from "./pages/Edit";

const useCurrentPath = (history: History): string => {
  const [pathname, setPathname] = useState(history.location.pathname);

  useEffect(() => {
    // unlisten
    return history.listen(location => setPathname(location.pathname));
  }, [history]);

  return pathname;
};

const useEditorRouting = (pathname: string): JSX.Element => {
  const content = useMemo(() => {
    if (pathname === "/") {
      return <Index />;
    } else {
      const id = pathname.slice(1);
      if (uuidv4.is(id)) {
        return <Edit textId={id} />;
      } else {
        return <div>404 not found</div>;
      }
    }
  }, [pathname]);

  return content;
};

const RouterContext = React.createContext<History | null>(null);

type RouterProps = {
  history: History;
};

export const Router: React.FC<RouterProps> = ({ history }) => {
  const pathname = useCurrentPath(history);
  const content = useEditorRouting(pathname);
  return (
    <RouterContext.Provider value={history}>{content}</RouterContext.Provider>
  );
};

type LinkProps = {
  href: string;
  as?: string;
};

export const Link: React.FC<LinkProps> = ({ href, as = "a", children }) => {
  const history = useContext(RouterContext);
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      history!.push(href);
    },
    [history, href]
  );
  // desugar
  return React.createElement(as, { href, onClick }, children);
};
