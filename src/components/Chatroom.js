import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Chatroom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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
            {message.text}

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
}
