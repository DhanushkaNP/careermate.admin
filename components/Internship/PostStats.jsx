import React from "react";

const PostStats = ({ name, stat, className }) => {
  return (
    <div
      className={`text-light-blue bg-opacity-light-blue px-2 py-0.5 rounded-lg font-semibold text-xs w-fit ${className}`}
    >
      {name} {stat}
    </div>
  );
};

export default PostStats;
