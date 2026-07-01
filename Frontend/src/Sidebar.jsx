import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";
import blacklogo from "./assets/blacklogo.png";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, user} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const token = await user.getIdToken();
            const response = await fetch("https://alphaai-1.onrender.com/api/thread", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const token = await user.getIdToken();
            const response = await fetch(`https://alphaai-1.onrender.com/api/thread/${newThreadId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const token = await user.getIdToken();
            const response = await fetch(`https://alphaai-1.onrender.com/api/thread/${threadId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await response.json();
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if(threadId === currThreadId) createNewChat();
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src={blacklogo} alt="gpt logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>Built by Akash & Anand</p>
            </div>
        </section>
    )
}

export default Sidebar;