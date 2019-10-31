import React, { useState, useEffect } from "react";
import { firebase, FirebaseContext } from "./firebase";

const useFirebaseAuth = () => {
  const [initialized, setInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      setInitialized(true);
      setUserId(user ? user.uid : null);
      setUserName(user ? user.displayName || "" : "");
    });
  }, []);

  return { initialized, userId, userName };
};

interface FirebaseAuthProps {
  NotSignedIn: React.FC;
  Loading: React.FC;
}

export const FirebaseAuth: React.FC<FirebaseAuthProps> = ({
  children,
  NotSignedIn,
  Loading
}) => {
  const { initialized, userId, userName } = useFirebaseAuth();

  if (!initialized) {
    return <Loading />;
  } else if (!userId) {
    return <NotSignedIn />;
  } else {
    return (
      <FirebaseContext.Provider
        value={{ userId, userName }}
        children={children}
      />
    );
  }
};

export const signInWithRedirect = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithRedirect(provider);
};

export const signOut = () => {
  return firebase.auth().signOut();
};
