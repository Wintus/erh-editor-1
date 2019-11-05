import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback
} from "react";
import { History } from "history";
import uuidv4 from "uuidv4";

const useCurrentPath = (history: History): string => {
  const [pathname, setPathname] = useState(history.location.pathname);

  useEffect(() => {
    // unlisten
    return history.listen(location => setPathname(location.pathname));
  }, [history]);

  return pathname;
};
