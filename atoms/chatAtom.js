/** @format */

import { atom } from "recoil";

export const handleChatState = atom({
  key: "handleChatState",
  default: false,
});

export const getChatState = atom({
  key: "getPostState",
  default: {},
});
export const selectedChatState = atom({
  key: "selctedChatPostState",
  default: null,
});

export const useSSRChatsState = atom({
  key: "useSSRPostsState",
  default: true,
});
export const isSelectState = atom({
  key: "isSelectState",
  default: false,
});

export const AllAvailableChat = atom({
  key: "getRightChatState",
  default: [],
});

export const messgeAtomState = atom({
  key: "messgeAtomState",
  default: [],
});
export const RealtimeChat = atom({
  key: "RealtimeChat",
  default: [],
});

export const MsgUserAtom = atom({
  key: "MsgUserAtom",
  default: {},
});
