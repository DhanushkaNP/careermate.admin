import React from "react";

const StudentSkillItem = ({ id, name }) => {
  return (
    <div className="flex justify-between">
      <li>{name}</li>
    </div>
  );
};

export default StudentSkillItem;
