import { database } from "firebase";
import {
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
import { firebase, FirebaseContext } from "./firebase";

export interface Document {
  textId: string;
  title: string;
  text: string;
}

// DB path = users/${userId}/*/
const useDocRef = (pathname: Location["pathname"]): database.Reference => {
  const { userId } = useContext(FirebaseContext);
  const ref = useMemo(
    () => firebase.database().ref(`users/${userId}/${pathname}`),
    [userId, pathname]
  );
  return ref;
};

const useFetchDocument = <T>(ref: database.Reference) => {
  const [document, setDocument] = useState<T>();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    ref.on("value", snapshot => {
      if (snapshot && snapshot.val()) {
        setDocument(snapshot.val());
      }
      setLoaded(true);
    });
    return () => {
      ref.off();
    };
  }, [ref]);

  return { document, loaded };
};

type DocSet = {
  [key: string]: Document;
};

// DB path = users/${userId}/documents/
export const useAllDocuments = () => {
  const ref = useDocRef("documents");
  return useFetchDocument<DocSet>(ref);
};

const { setTimeout } = window || global;

const useUpdateDocument = <T extends unknown>(ref: database.Reference) => {
  const [pending, setPending] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const updateDocument = useCallback(
    (document: T) => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }

      const delayMs = 500;
      const timeoutId = setTimeout(() => {
        if (!mountedRef.current) {
          return;
        }
        setPending(true);
        ref.set(document).then(() => {
          setPending(false);
        });
        timeoutRef.current = null;
      }, delayMs);
      timeoutRef.current = timeoutId;
    },
    [ref]
  );

  return { pending, updateDocument };
};

// DB path = users/${userId}/documents/${textId}
export const useDatabaseDocument = (textId: Document["textId"]) => {
  const ref = useDocRef(`documents/${textId}`);
  const { document, loaded } = useFetchDocument(ref);
  const { pending, updateDocument } = useUpdateDocument(ref);

  const [text, setText] = useState("");

  useEffect(() => {
    // TODO: mounted?
    let mounted = true;
    console.log({ mounted });
    if (mounted && document && "text" in document) {
      setText(document.text);
    }
    return () => {
      mounted = false;
    };
  }, [document]); // TODO: document.text?

  const updateText = useCallback(
    (newText: string) => {
      setText(newText);
      const [title] = newText.split("\n");
      updateDocument({
        textId,
        text: newText,
        title,
        updatedAt: new Date()
      });
    },
    [textId, updateDocument]
  );

  return { text, updateText, loaded, pending };
};
