"use client";

import { Button, Col, Row } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { dateLocalizer } from "@/utils/dateTimeLocalizer";

const DailyDiaryStudentSummary = ({
  id,
  studentName,
  studentNumber,
  companyName,
  weekNumber,
  approvalRequestTime,
}) => {
  const router = useRouter();
  return (
    <div className="bg-white shadow-md w-full h-12 border hover:bg-light-background">
      <Row gutter={16} className="h-full">
        <Col span={1} className="font-default flex justify-center"></Col>
        <Col span={5} className="font-default flex items-center text-base">
          {studentName}
        </Col>
        <Col span={4} className="font-default flex items-center text-base">
          {studentNumber}
        </Col>
        <Col span={4} className="font-default flex items-center text-base">
          {companyName}
        </Col>
        <Col span={3} className="font-default flex items-center text-base">
          Week {weekNumber}
        </Col>
        <Col span={3} className="font-default flex items-center text-base">
          {dateLocalizer(approvalRequestTime)}
          {/* {approvalRequestTime.tolocalString()} */}
        </Col>
        <Col span={4} className="font-default flex items-center text-base">
          <Button
            type="primary"
            ghost
            onClick={() => router.push(`/portal/diaries/${id}`)}
          >
            View document
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DailyDiaryStudentSummary;
