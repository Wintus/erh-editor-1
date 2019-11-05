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
