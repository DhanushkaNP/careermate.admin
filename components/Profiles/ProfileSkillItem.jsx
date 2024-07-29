import React from "react";

const ProfileSkillItem = ({ name }) => {
  return (
    <div className="flex justify-between">
      <li>{name}</li>
    </div>
  );
};

export default ProfileSkillItem;
