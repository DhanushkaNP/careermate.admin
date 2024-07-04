import React from "react";

const FormContainer = ({ children, className }) => {
  return (
    <div
      className={`h-screen flex justify-center items-center border-solid mx-auto my-auto ${className}`}
    >
      {children}
    </div>
  );
};

export default FormContainer;
