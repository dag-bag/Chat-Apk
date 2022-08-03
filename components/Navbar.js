/** @format */

import Image from "next/image";
import React, { useState } from "react";

import { signOut, useSession } from "next-auth/react";
import SearchResult from "./SearchResult";
import Loader from "./Loder";
import { useRecoilState } from "recoil";
import {
  handleChatState,
  RealtimeChat,
  useSSRChatsState,
} from "../atoms/chatAtom";
function Navbar() {
  const { data: session } = useSession();
  const [Query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [Result, setResults] = useState(false);
  const [Users, setUsers] = useState([]);
  const [handleChat, setHandleChat] = useRecoilState(handleChatState);
  const [useSsrChat, setUseSsrChat] = useRecoilState(useSSRChatsState);
  const [RealTimePost, setRealTimePost] = useRecoilState(RealtimeChat);
  // console.log(RealTimePost);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (Query.length <= 0) {
      return;
    }
    if (Query.length > 0) {
      setLoading(true);
      const search = await fetch("/api/user/?search=" + Query);
      const data = await search.json();
      setUsers(data);
      setResults(true);
      setLoading(false);
    }
  };

  const accessChat = async (id) => {
    if (id === session.user.id) {
      console.log("You can't chat with yourself");
      return;
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messeger: session.user.id,
        receiver: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const respData = await response.json();
    setRealTimePost([respData, ...RealTimePost]);

    setHandleChat(true);
    setUseSsrChat(false);
    setResults(false);
  };
  return (
    <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
      <div className="font-semibold text-2xl">GoingChat</div>
      <form
        className="w-1/2 relative"
        onSubmit={(e) => {
          handleSearch(e);
        }}
      >
        <input
          type="text"
          name=""
          id=""
          placeholder="search IRL"
          className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
          value={Query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading ? (
          <div className="absolute top-10  left-0 w-full z-50">
            <Loader />
          </div>
        ) : (
          Users.map((user) => {
            return (
              Result && (
                <div
                  className="absolute top-12  left-0 w-full z-50"
                  key={user._id}
                  onClick={() => {
                    accessChat(user._id);
                  }}
                >
                  <SearchResult user={user} />
                </div>
              )
            );
          })
        )}
      </form>
      <div className="h-12 w-12 p-2  rounded-full text-white font-semibold flex items-center justify-center">
        <Image
          src={session?.user?.image}
          alt="profile"
          width={60}
          height={60}
          className="rounded-full"
          onClick={() => {
            signOut();
          }}
        />
      </div>
    </div>
  );
}

export default Navbar;
