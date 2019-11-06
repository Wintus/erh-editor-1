import React from "react";
import styled from "styled-components";

import { Link } from "../Router";
import { Document, useDatabaseDocument } from "../firebase-database";

const Input = styled.textarea`
  width: 100%;
  height: 90vh;
  ::focus {
    outline: none;
  }
  font-size: 16px;
  font-family: "monospace";
`;

const EditPage = ({ textId }: Pick<Document, "textId">) => {
  const { text, updateText, loaded, pending } = useDatabaseDocument(textId);
  if (!loaded) {
    return <div>now loading……</div>;
  } else {
    return (
      <div>
        <div>{pending ? "write is pending now" : ""}</div>
        <Link as="button" href="/">
          Back to list
        </Link>
        <Input
          value={text}
          onChange={e => updateText(e.target.value)}
          autoFocus
        />
      </div>
    );
  }
};

export default EditPage;
