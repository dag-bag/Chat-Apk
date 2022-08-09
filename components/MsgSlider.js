/** @format */

// import { useSelect } from "@mui/base";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { isLastMessage, isSameSender, isSameUser } from "../libs/chatLogic";
import { useRecoilState } from "recoil";
import io from "socket.io-client";
import Image from "next/image";
import { messgeAtomState, selectedChatState } from "../atoms/chatAtom";
import { notificationAtom } from "../atoms/notificaionAtom";
var socket;
var selectedChatCompare;

function MsgSlider() {
  const { data: session } = useSession();
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useRecoilState(notificationAtom);

  const socketInitializer = async () => {
    socket = io("ttps://chat-apk.vercel.app", { path: "/api/socket" });
    await fetch("https://chat-apk.vercel.app/api/socket/");

    socket.on("connection", () => {
      setsocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.emit("setup", session.user.id);
  };

  useEffect(() => {
    socketInitializer();
    selectedChatCompare = selectedChat;
  }, []);

  const fetchMessages = async () => {
    socket = io();
    const response = await fetch("/api/message/?chatId=" + selectedChat._id);
    const respData = await response.json();

    setMessages(respData);
    socket.emit("join chat", selectedChat._id);
  };
  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  const [messages, setMessages] = useRecoilState(messgeAtomState);
  const [msg, setMsg] = useState("");
  const sendMsg = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: session.user.id,
        content: msg,
        chatId: selectedChat._id,
      }),
    });
    const respData = await response.json();
    socket.emit("new msg", respData);
    setMessages([...messages, respData]);

    setMsg("");
  };
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  const typingHandler = (e) => {
    setMsg(e.target.value);

    // if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      <div className="relative w-full p-6 overflow-y-auto h-[30rem]">
        {messages &&
          messages.map((m, i) => (
            <div
              className={`flex ${
                m.sender._id === session.user.id
                  ? "justify-end"
                  : "justify-start"
              }`}
              key={m._id}
            >
              {/* {(isSameSender(messages, m, i, session.user.id) ||
          isLastMessage(messages, i, session.user.id)) && ( */}
              <div className="mx-2 mt-2">
                <Image
                  className="object-cover w-10 h-10 rounded-full "
                  src={m.sender.pic}
                  alt="username"
                  width={40}
                  height={40}
                />
              </div>
              {/* )} */}
              <span
                className={`${
                  m.sender._id === session.user.id
                    ? "bg-[#BEE3F8]"
                    : "bg-[#B9F5D0]"
                }
         

             mt-${isSameSender(messages, m, i, session.user.id)}
             mr-${isSameUser(messages, m, i, session.user.id) ? 3 : 10}
             rounded-full
             py-1 px-3
             text-center
             max-w-6xl
             mt-2 
          `}
              >
                {m.content}
              </span>
            </div>
          ))}
        {istyping && <h1>Typing</h1>}
      </div>

      <form
        onSubmit={(e) => {
          sendMsg(e);
        }}
      >
        <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          <input
            type="text"
            placeholder="Message"
            className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
            name="message"
            required
            onChange={(e) => {
              typingHandler(e);
            }}
            value={msg}
          />
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
          <button type="submit">
            <svg
              className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
}

export default MsgSlider;
