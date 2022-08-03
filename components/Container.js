/** @format */

import React from "react";

function Container(props) {
  return (
    // <!-- component -->
    // <!-- This is an example component -->
    <>
      <div className="container mx-auto shadow-lg rounded-lg h-[60vh]">
        <div className="display flex justify-start bg-white">
          {props.children}
        </div>
      </div>
    </>
  );
}

export default Container;
