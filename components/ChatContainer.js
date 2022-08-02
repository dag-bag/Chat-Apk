/** @format */

import React from "react";

function ChatContainer(props) {
  return (
    <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
      {props.children}
    </div>
  );
}

export default ChatContainer;
