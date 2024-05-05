"use client";

import { useIsAuth } from "@/utils/Auth/auth-selectors";
import React from "react";

const Test = () => {
  const isAuth = useIsAuth();
  console.log(isAuth);
  return <div className=" text-black text-2xl font-bold">test</div>;
};

export default Test;
