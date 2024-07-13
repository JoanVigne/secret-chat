import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import React from "react";

export const SignIn = () => {
  const signInWithGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Sign-in successful:", result.user);
      })
      .catch((error) => {
        console.error("Error during sign-in:", error.message);
      });
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};
