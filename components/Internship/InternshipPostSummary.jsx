"use client";

import { Avatar, Button } from "antd";
import React, { useEffect, useState } from "react";
import Status from "../Status/Status";
import Link from "next/link";
import { RiExternalLinkLine } from "react-icons/ri";
import { UserOutlined } from "@ant-design/icons";
import DeleteModal from "../DeleteModal";

const InternshipPostSummary = ({
  company,
  id,
  jobTitle,
  isApproved,
  location,
  jobType,
  onDelete,
  showApprove = true,
}) => {
  const [statusColor, setStatusColor] = useState("blue");
  const [name, setName] = useState("Waiting");

  const [isDeleteModalOpen, SetIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    console.log(id);
    switch (isApproved) {
      case false:
        setName("Waiting");
        setStatusColor("blue");
        break;
      case true:
        setName("Approved");
        setStatusColor("green");
        break;
    }
  }, [isApproved]);

  return (
    <>
      <DeleteModal
        open={isDeleteModalOpen}
        onCancel={() => SetIsDeleteModalOpen(false)}
        onDelete={() => onDelete(id)}
        message={`Do you want to delete the post?`}
      />
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
                <Status name={name} color={statusColor} />
              </span>
            </p>
            <div className="mt-1">
              <p className="text-xs">Location: {location}</p>
              <p className="text-xs">Type: {jobType}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2 border-s-2 ps-4">
          {showApprove && (
            <Button size="small" className="text-xs" type="primary" ghost>
              Approve
            </Button>
          )}
          <Button
            size="small"
            className="text-xs"
            danger
            onClick={() => SetIsDeleteModalOpen(true)}
          >
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
    </>
  );
};

export default InternshipPostSummary;
