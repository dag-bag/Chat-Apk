/** @format */

import Image from "next/image";
import React from "react";

import { signOut, useSession } from "next-auth/react";
function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
      <div className="font-semibold text-2xl">GoingChat</div>
      <div className="w-1/2">
        <input
          type="text"
          name=""
          id=""
          placeholder="search IRL"
          className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
        />
      </div>
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
