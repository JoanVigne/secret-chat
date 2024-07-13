import React from "react";
import "./App.css";

import { useAuthState } from "react-firebase-hooks/auth";
import Chatroom from "./components/Chatroom";

import { auth } from "./firebaseConfig";
import { SignIn } from "./components/Signin";
function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div className="App">Loading...</div>;
  }
  if (error) {
    return <div className="App">Error: {error.message}</div>;
  }
  if (user) {
    return (
      <div className="App">
        <header>
          <h1> Hello</h1>
          <p>You can send anonymous messages. Anyone can delete it.</p>
        </header>
        <main>
          <Chatroom />
        </main>
      </div>
    );
  } else {
    return (
      <div className="App">
        Please sign in. <SignIn />
      </div>
    );
  }
}

export default App;
