import React from "react";

const FormTitle = ({ title, subTitle, description, titleStyle, className }) => {
  return (
    <div className={`${className}`}>
      <div>
        <h3
          className={`text-dark-blue font-bold text-2xl mb-4 font-default ${titleStyle}`}
        >
          {title}{" "}
          {subTitle && (
            <span className=" text-light-gray text-lg font-medium">
              - {subTitle}
            </span>
          )}
        </h3>
        <div className=" text-light-gray">{description}</div>
      </div>
    </div>
  );
};

export default FormTitle;
