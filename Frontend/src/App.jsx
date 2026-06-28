import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./MyContext.jsx";
import Login from "./Login.jsx";
import { useState, useEffect } from 'react';
import {v1 as uuidv1} from "uuid";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase auth state check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Naya useEffect — user change hone par threads fetch karo
  useEffect(() => {
    if (!user) {
      setAllThreads([]);
      return;
    }
    const fetchThreads = async () => {
      const token = await user.getIdToken();
      const res = await fetch("https://alphaai-1.onrender.com/api/thread", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAllThreads(data);
    };
    fetchThreads();
  }, [user]);

  const handleLogin = (firebaseUser) => {
    setUser(firebaseUser);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setAllThreads([]);
    setPrevChats([]);
    setCurrThreadId(uuidv1());
    setNewChat(true);
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    user, handleLogout
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App;