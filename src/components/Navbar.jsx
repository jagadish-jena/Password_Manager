import React from "react";

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/react";

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-800">
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-14 text-white">

        <div className="logo font-bold text-2xl">
          <span className="text-green-600">&lt;</span>
          <span>Pass</span>
          <span className="text-green-600">OP/&gt;</span>
        </div>

        <div className="flex items-center gap-2">

          {/* User is NOT logged in */}
          {!isSignedIn && (
            <>
              {/* Login */}
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-full cursor-pointer">
                  Login
                </button>
              </SignInButton>

              {/* Sign Up */}
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-full cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>

            </>

          )}

          {/* User IS logged in */}
          {isSignedIn && <UserButton />}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;