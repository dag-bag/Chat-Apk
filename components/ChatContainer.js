/** @format */

import React from "react";

function ChatContainer(props) {
  return (
    <div className="flex flex-col w-72 border-r-2 overflow-y-scroll">
      {props.children}
    </div>
  );
}

export default ChatContainer;
