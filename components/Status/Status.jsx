"use client";

import React, { useEffect, useState } from "react";

const Status = ({ name, color }) => {
  const [borderColor, setBorderColor] = useState("!border-light-blue");
  const [nameColor, setNameColor] = useState("!text-light-blue");

  useEffect(() => {
    if (color == "blue") {
      setBorderColor("!border-light-blue");
      setNameColor("!text-light-blue");
    } else if (color === "red") {
      setBorderColor("!border-red");
      setNameColor("!text-red");
    } else if (color === "green") {
      setBorderColor("!border-green");
      setNameColor("!text-green");
    }
  }, [color]);

  return (
    <div
      className={`border-2 rounded-xl text-center w-fit px-3 ${borderColor}`}
    >
      <span className={`font-semibold ${nameColor}`}>{name}</span>
    </div>
  );
};

export default Status;
