import { Breadcrumb } from "antd";
import React from "react";

const BreadCrumpHeader = ({ pathSegments }) => {
  return (
    <Breadcrumb>
      {pathSegments.map((segment, index) => (
        <Breadcrumb.Item key={index} className=" font-default text-md">
          {segment}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadCrumpHeader;
