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
      setDocument(snapshot.val());
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

const useUnmounted = () => {
  const unmounted = useRef(false);
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);
  return unmounted;
};

const useUpdateDocument = <T extends unknown>(ref: database.Reference) => {
  const [pending, setPending] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const unmounted = useUnmounted();

  const updateDocument = useCallback(
    (document: T) => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }

      const delayMs = 500;
      const timeoutId = setTimeout(() => {
        if (unmounted.current) {
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
  const { document, loaded } = useFetchDocument<Document>(ref);
  const { pending, updateDocument } = useUpdateDocument(ref);

  const [text, setText] = useState("");

  useEffect(() => {
    if (document && "text" in document) {
      setText(document.text);
    }
  }, [document]);

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
