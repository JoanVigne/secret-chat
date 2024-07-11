import { useSignInWithGoogle } from "react-firebase-hooks/auth";

export default function Signin() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}></button>;
}
