"use client";

import React, { useEffect, useState } from "react";

const Status = ({ name, color }) => {
  const [styleColor, setStyleColor] = useState("light-blue");

  useEffect(() => {
    if (color === "red") {
      setStyleColor("red");
    } else if (color === "green") {
      setStyleColor("green");
    }
  }, [color]);

  return (
    <div
      className={`border-2 rounded-xl border-${styleColor} text-center w-fit px-3`}
    >
      <span className={`font-semibold text-${styleColor}`}>{name}</span>
    </div>
  );
};

export default Status;
