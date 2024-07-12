import React, { useState, useEffect } from "react";
import "./App.css";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

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
        <header> Hello, {user.displayName}</header>

        <main>
          <Chatroom user={user} />
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

const SignIn = () => {
  const signInWithGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Sign-in successful.
        // You can access the signed-in user with result.user
        console.log("Sign-in successful:", result.user);
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Error during sign-in:", error.message);
      });
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};

const Chatroom = (props) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = props;
  console.log(user);
  // Fetch messages and listen for new ones
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: new Date(),
    });
    setNewMessage("");
  };

  async function deleteMessage(messageId) {
    try {
      await deleteDoc(doc(db, "messages", messageId));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  }
  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message.id} className="message">
            <div className="photoUrlAndMessage">
              <img
                className="photoUrl"
                src={user && user.photoURL && user.photoURL}
                alt=""
              />
              {message.text}
            </div>

            <button
              className="delete"
              onClick={() => deleteMessage(message.id)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          className="send"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="send">
          {">"}
        </button>
      </form>
    </div>
  );
};

export default App;
