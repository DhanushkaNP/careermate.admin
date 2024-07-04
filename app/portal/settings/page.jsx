"use client";

import BreadCrumpHeader from "@/components/BreadCrumpHeader";
import PageTitle from "@/components/PageTitle";
import { Card } from "antd";
import React, { useState } from "react";
import DegreePrograms from "./components/DegreePrograms";
import Industries from "./components/Industries";
import BatchConfigurations from "./components/BatchConfigurations";

const Settings = () => {
  const tableList = [
    {
      key: "degrees",
      tab: "Degree Programs",
    },
    {
      key: "industries",
      tab: "Industries",
    },
    {
      key: "configurations",
      tab: "Batch configurations",
    },
  ];

  const tableContentList = {
    degrees: <DegreePrograms />,
    industries: <Industries />,
    configurations: <BatchConfigurations />,
  };

  const [activeTableKey, setActiveTableKey] = useState("degrees");
  const onTableChange = (e) => {
    console.log(e);
    setActiveTableKey(e);
  };

  return (
    <div className="font-default text-dark-blue">
      <BreadCrumpHeader />
      <PageTitle title="Settings" />

      <Card
        className=" mt-2 rounded font-default shadow-sm"
        tabList={tableList}
        activeTabKey={activeTableKey}
        onTabChange={onTableChange}
      >
        {tableContentList[activeTableKey]}
      </Card>
    </div>
  );
};

export default Settings;
