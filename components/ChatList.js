/** @format */

import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  AllAvailableChat,
  MsgUserAtom,
  selectedChatState,
} from "../atoms/chatAtom";
import chatHelper from "../libs/chatHelpler";

function ChatList({ chat }) {
  const { data: session } = useSession();

  const user = chatHelper(session?.user.id, chat?.users);

  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [MsgUserDetails, setMsgUSerAtom] = useRecoilState(MsgUserAtom);
  return (
    chat && (
      <>
        {" "}
        <div
          className="flex flex-row py-4 px-2 justify-center items-center border-b-2 cursor-pointer hover:bg-blue-500 hover:text-white"
          onClick={() => {
            setSelectedChat(chat);
            setMsgUSerAtom(user);
          }}
        >
          <div className="w-1/4">
            <Image
              src={user?.pic}
              className="object-cover h-12 w-12 rounded-full"
              alt=""
              width={50}
              height={50}
            />
          </div>
          <div className="w-full">
            <div className="text-lg font-semibold">{user?.name}</div>
            <span className="text-gray-500">Pick me at 9:00 Am</span>
          </div>
        </div>
      </>
    )
  );
}

export default ChatList;
