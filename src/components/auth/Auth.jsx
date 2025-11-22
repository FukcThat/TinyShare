import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ResetPass from "./ResetPass";

// States: 0 Login, 1 Signup, 2 Reset Pass

export default function Auth() {
  const [curState, setCurState] = useState(0);

  return curState === 0 ? (
    <SignIn setCurState={setCurState} />
  ) : curState === 1 ? (
    <SignUp setCurState={setCurState} />
  ) : (
    <ResetPass setCurState={setCurState} />
  );
}
