import React, { useMemo } from "react";
import { useAllDocuments } from "../firebase-database";
import { Link, uuidv4 } from "../Router";

const useDocumentList = () => {
  const { document: documents, loaded } = useAllDocuments();

  return useMemo(() => {
    if (!loaded) {
      return [<div key="loading">loading documents now……</div>];
    } else if (!documents) {
      return [];
    } else {
      return Object.entries(documents).map(([textId, doc]) => {
        const { title } = doc;
        return (
          <li key={textId}>
            <Link href={`/${textId}`}>{title}</Link>
          </li>
        );
      });
    }
  }, [documents, loaded]);
};

export default () => {
  const list = useDocumentList();
  return (
    <div>
      <Link as="button" href={`/${uuidv4()}`}>
        Create a new page
      </Link>
      <ul>{list}</ul>
    </div>
  );
};
