import React, { useContext, useCallback } from "react";
import "./App.css";
import { FirebaseContext } from "./firebase";
import { FirebaseAuth, signInWithRedirect, signOut } from "./FirebaseAuth";

const Content: React.FC = () => {
  const { userId, userName } = useContext(FirebaseContext);
  return (
    <div>
      <span>
        {userName} ({userId}) is signed in
      </span>
    </div>
  );
};

const App: React.FC = () => {
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
      <Content />
      <div>
        <button onClick={signOut}>sign out</button>
      </div>
    </FirebaseAuth>
  );
};

export default App;
