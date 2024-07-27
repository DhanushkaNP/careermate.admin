import { DeleteOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import React from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};

const StudentCertificationItem = ({
  id,
  name,
  issueMonth,
  issuingOrganization,
}) => {
  const formattedIssueMonth = formatDate(issueMonth);

  return (
    <div>
      <h6 className="font-medium">{name}</h6>
      <p>{issuingOrganization}</p>
      <div className="flex justify-between">
        <p className="text-light-gray">Issued {formattedIssueMonth}</p>{" "}
      </div>

      <Divider className="mt-2" />
    </div>
  );
};

export default StudentCertificationItem;
