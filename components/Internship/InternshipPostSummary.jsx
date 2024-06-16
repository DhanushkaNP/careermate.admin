"use client";

import { Avatar, Button } from "antd";
import React, { useEffect, useState } from "react";
import Status from "../Status/Status";
import Link from "next/link";
import { RiExternalLinkLine } from "react-icons/ri";
import { UserOutlined } from "@ant-design/icons";

const InternshipPostSummary = ({
  company,
  jobTitle,
  postStatus,
  location,
  jobType,
}) => {
  const [statusColor, setStatusColor] = useState("blue");

  useEffect(() => {
    switch (postStatus) {
      case "waiting":
        setStatusColor("blue");
        break;
      case "approved":
        setStatusColor("green");
        break;
    }
  }, [postStatus]);

  return (
    <div className="py-2 px-2 bg-white shadow rounded-md mt-2 flex gap-4">
      <Avatar size={64} icon={<UserOutlined />} className=" my-auto" />
      <div className="flex-grow flex justify-between">
        <div className="my-auto">
          <h5 className="font-semibold">{company}</h5>
          <h6>{jobTitle}</h6>
        </div>
        <div>
          <p className="font-semibold flex">
            Status:
            <span className="ms-2">
              <Status name={postStatus} color={statusColor} />
            </span>
          </p>
          <div className="mt-1">
            <p className="text-xs">Location: {location}</p>
            <p className="text-xs">Type: {jobType}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2 border-s-2 ps-4">
        <Button size="small" className="text-xs" type="primary" ghost>
          Approve
        </Button>
        <Button size="small" className="text-xs" danger>
          Delete
        </Button>
        <Link
          href={"test"}
          className="text-xs font-semibold text-center text-light-blue flex gap-1"
        >
          View original
          <RiExternalLinkLine />
        </Link>
      </div>
    </div>
  );
};

export default InternshipPostSummary;
