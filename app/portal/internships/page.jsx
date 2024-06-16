"use client";

import React from "react";
import { Card, Statistic, Input, Button, Avatar, Divider } from "antd";
import { usePathname } from "next/navigation";
import BreadCrumpHeader from "@/components/BreadCrumpHeader";
import PageTitle from "@/components/PageTitle";
import { PiBuildingsFill } from "react-icons/pi";
import { MdOutlineWorkOutline } from "react-icons/md";
import { WarningOutlined } from "@ant-design/icons";
import InternshipPostSummary from "@/components/Internship/InternshipPostSummary";

const Internships = () => {
  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter((segment) => segment);

  return (
    <div className="font-default text-dark-blue">
      <BreadCrumpHeader pathSegments={pathSegments} />
      <PageTitle title="Companies" />

      <div className="flex flex-row gap-4 mt-4">
        <Card bordered={false} className="my-0" hoverable>
          <Statistic
            title={<span className="text-light-blue">Total Companies</span>}
            value={112}
            prefix={
              <PiBuildingsFill size={30} className="block align-middle mr-2" />
            }
            className="my-0 font-default"
            valueStyle={{ color: "#3056D3" }}
          />
        </Card>
        <Card bordered={false} className="my-0" hoverable>
          <Statistic
            title={<span className="text-[#3f8600]">Waiting for approval</span>}
            value={93}
            prefix={<MdOutlineWorkOutline className="mr-4" />}
            valueStyle={{ color: "#3f8600" }}
            className="font-default"
          />
        </Card>
        <Card bordered={false} className="my-0" hoverable>
          <Statistic
            title={<span className="text-black">Waiting for approval</span>}
            value={20}
            prefix={<WarningOutlined className="mr-3" />}
            bordered
            className="font-default"
          />
        </Card>
      </div>

      <div className="flex justify-between mt-2">
        <Input.Search
          placeholder={"Search by email or name"}
          enterButton
          className="w-1/4 shadow-sm flex-initial"
          size="large"
          style={{ borderRadius: "0px !important" }}
          onSearch={(value) => {}}
        />

        <Button
          type="primary"
          className="flex-initial flex gap-2 bg-light-blue"
          onClick={() => {
            setIsCreateModelOpen(true);
          }}
        >
          <span className="font-default">Create a post</span>
        </Button>
      </div>

      <InternshipPostSummary
        company={"Calcey Technologies"}
        jobTitle={"Software Engineering"}
        postStatus={"waiting"}
        location={"Colombo"}
        jobType={"Hybrid"}
      />
    </div>
  );
};

export default Internships;
