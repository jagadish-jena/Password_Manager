import React from "react";
import { SignIn, useAuth } from "@clerk/react";

import Navbar from "./components/Navbar";
import Manager from "./components/Manager";

const App = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
      <Navbar />

      {isSignedIn && <Manager />}

      {!isSignedIn && (
        <div className="manager-background min-h-screen flex items-center justify-center pt-14">
          <SignIn />
        </div>
      )}
    </>
  );
};

export default App;