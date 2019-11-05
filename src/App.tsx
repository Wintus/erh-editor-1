import React, { useContext, useCallback } from "react";
import "./App.css";
import { FirebaseContext } from "./firebase";
import { FirebaseAuth, signInWithRedirect, signOut } from "./FirebaseAuth";

import { Router, RouterProps } from "./Router";

const Content: React.FC<RouterProps> = ({ history }) => {
  const { userId, userName } = useContext(FirebaseContext);
  return (
    <div>
      <span>
        {userName} ({userId}) is signed in
      </span>
      <Router history={history} />
    </div>
  );
};

const App: React.FC<RouterProps> = ({ history }) => {
  const NotSignedIn = useCallback(() => {
    return <button onClick={() => signInWithRedirect()}>sign in</button>;
  }, []);
  const Loading = useCallback(() => {
    return (
      <div>
        <span>loading now……</span>
      </div>
    );
  }, []);

  return (
    <FirebaseAuth NotSignedIn={NotSignedIn} Loading={Loading}>
      <Content history={history} />
      <div>
        <button onClick={signOut}>sign out</button>
      </div>
    </FirebaseAuth>
  );
};

export default App;
