/** @format */

import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import {
  messgeAtomState,
  MsgUserAtom,
  selectedChatState,
} from "../atoms/chatAtom";
import MsgSlider from "./MsgSlider";

function Msg() {
  const { data: session } = useSession();
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [MsgUserDetails, setMsgUSerAtom] = useRecoilState(MsgUserAtom);
  const [messages, setMessages] = useRecoilState(messgeAtomState);

  return !selectedChat ? (
    <div>
      <h1 className="text-black">Please Select a Chat.</h1>
    </div>
  ) : (
    selectedChat && (
      <div className="lg:block w-[50rem]">
        <div className="w-full">
          <div className="relative flex items-center p-3 border-b border-gray-300">
            <Image
              className="object-cover w-10 h-10 rounded-full"
              src={MsgUserDetails?.pic}
              alt="username"
              width={40}
              height={40}
            />

            <span className="block ml-2 font-bold text-gray-600">
              {MsgUserDetails?.name}
            </span>
            <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
          </div>

          <MsgSlider />
        </div>
      </div>
    )
  );
}

export default Msg;
