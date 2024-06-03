"use client";

import BreadCrumpHeader from "@/components/BreadCrumpHeader";
import PageTitle from "@/components/PageTitle";
import { Card, Statistic, Input, Select, Table, Avatar, Button } from "antd";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";

import { PiBuildingsFill } from "react-icons/pi";
import { CheckOutlined, WarningOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import Status from "@/components/Status/Status";

const Companies = () => {
  const tableColumns = [
    {
      title: "",
      dataIndex: "logo",
      width: "6%",
    },
    {
      title: "Company name",
      dataIndex: "name",
      width: "18%",
    },
    {
      title: "Industry",
      dataIndex: "industry",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "12%",
    },
    {
      title: "Total studenst",
      dataIndex: "totalStudents",
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

  const companyFilterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div className="font-default text-dark-blue">
      <BreadCrumpHeader pathSegments={pathSegments} />

      <PageTitle title="Companies" />

      <div className="flex flex-row gap-4 mt-4">
        <Card bordered={false} className=" my-0 " hoverable>
          <Statistic
            title={<span className=" text-light-blue">Total Companies</span>}
            value={112}
            prefix={
              <PiBuildingsFill size={30} className=" block align-middle mr-2" />
            }
            className=" my-0"
            valueStyle={{ color: "#3056D3" }}
          />
        </Card>
        <Card bordered={false} className=" my-0 " hoverable>
          <Statistic
            title={
              <span className=" text-[#3f8600]">Waiting for approval</span>
            }
            value={93}
            prefix={<CheckOutlined className="mr-4" />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
        <Card bordered={false} className=" my-0 " hoverable>
          <Statistic
            title={<span className="text-black">Blocked</span>}
            value={20}
            prefix={<WarningOutlined className="mr-3" />}
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

        <Select
          showSearch
          optionFilterProp="children"
          className="font-default"
          size="large"
          options={[
            {
              value: "Software Engineering",
              label: "Software Engineering",
            },
            {
              value: "Networking",
              label: "Networking",
            },
          ]}
          filterOption={companyFilterOption}
          placeholder="Select a Industry"
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
              totalStudents: 20,
              logo: (
                <Avatar
                  icon={<UserOutlined />}
                  className=" ms-2"
                  shape="square"
                />
              ),
              name: "Calcey Technologies",
              industry: "Software engineering",
              status: <Status name={"Approved"} color={"green"} />,
              totalStudents: 20,
            },
          ]}
        ></Table>
      </div>
    </div>
  );
};

export default Companies;
