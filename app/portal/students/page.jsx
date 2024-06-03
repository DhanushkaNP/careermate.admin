"use client";

import BreadCrumpHeader from "@/components/BreadCrumpHeader";
import PageTitle from "@/components/PageTitle";
import { usePathname } from "next/navigation";
import React from "react";
import { Statistic, Card, Input, Button, Cascader, Table, Avatar } from "antd";
import { PiStudentFill } from "react-icons/pi";
import { CheckOutlined, WarningOutlined } from "@ant-design/icons";
import { IoMdBriefcase } from "react-icons/io";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";

const Students = () => {
  const tableColumns = [
    {
      title: "",
      dataIndex: "proPic",
      width: "6%",
    },
    {
      title: "Full name",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "Student Id",
      dataIndex: "studentId",
      width: "12%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "12%",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "",
      render: ({ key }) => (
        <div className=" flex justify-end gap-3 pe-4">
          <Button type="primary" onClick={() => {}}>
            View
          </Button>
          <Button danger onClick={() => {}}>
            Delete
          </Button>
        </div>
      ),
      width: 300,
    },
  ];

  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter((segment) => segment);

  return (
    <div className="font-default text-dark-blue">
      <BreadCrumpHeader pathSegments={pathSegments} />

      <PageTitle title="Students" />

      <div className="flex flex-row gap-4 mt-4">
        <Card bordered={false} className=" my-0 " hoverable>
          <Statistic
            title={<span className=" text-black">Total students</span>}
            value={112}
            prefix={
              <PiStudentFill size={30} className=" block align-middle mr-2" />
            }
            className=" my-0 text-light-blue"
          />
        </Card>
        <Card bordered={false} className=" my-0 " hoverable>
          <Statistic
            title={<span className=" text-[#3f8600]">Registered</span>}
            value={93}
            suffix="/ 100"
            prefix={<CheckOutlined className="mr-2" />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
        <Card bordered={false} className=" my-0" hoverable>
          <Statistic
            title={<span className=" text-light-blue">Employed</span>}
            value={20}
            prefix={<IoMdBriefcase className="mr-2" size={30} />}
            valueStyle={{ color: "#3056D3" }}
          />
        </Card>
        <Card bordered={false} className=" my-0 " hoverable>
          <Statistic
            title={
              <span className=" text-[#cf1322]">Waiting for a internship</span>
            }
            value={20}
            prefix={<WarningOutlined className="mr-3" />}
            valueStyle={{ color: "#cf1322" }}
            bordered
          />
        </Card>
      </div>

      <div className="flex mt-6 gap-4">
        <Input.Search
          placeholder={"Search by email or name"}
          enterButton
          className=" w-1/4 shadow-sm flex-initial"
          size="large"
          style={{ borderRadius: "0px !important" }}
          onSearch={(value) => {}}
        />
        <Cascader
          className=" font-default text-dark-dark-blue"
          options={[
            {
              value: "BICT (Hons)",
              label: "BICT (Hons)",
            },
            {
              value: "CS (Hons)",
              label: "CS (Hons)",
            },
          ]}
          placeholder="Select University"
          size="large"
        />
        <Cascader
          className=" font-default text-dark-dark-blue"
          options={[
            {
              value: "Software System Technology",
              label: "Software System Technology",
            },
            {
              value: "Software System Technology",
              label: "Software System Technology",
            },
          ]}
          placeholder="Select Pathway"
          size="large"
        />
        <Cascader
          className=" font-default text-dark-dark-blue"
          options={[
            {
              value: "UnApproved",
              label: "UnApproved",
            },
            {
              value: "Approved",
              label: "Approved",
            },
          ]}
          placeholder="CV status"
          size="large"
        />
      </div>

      <div className=" mt-6">
        <Table
          columns={tableColumns}
          size="middle"
          className="font-default text-md"
          dataSource={[
            {
              key: 1,
              proPic: <Avatar icon={<UserOutlined />} className=" ms-2" />,
              name: "Dhanushka Nuwan",
              studentId: "CT/2018/051",
              status: "EMPLOYEED",
              company: (
                <Link
                  href={"https://calcey.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Calcey Technologies
                </Link>
              ),
            },
          ]}
        ></Table>
      </div>
    </div>
  );
};

export default Students;
