import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import React from "react";

const BreadCrumpHeader = () => {
  const pathName = usePathname()
  const pathSegments = pathName.split("/").filter((segment) => segment);

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
