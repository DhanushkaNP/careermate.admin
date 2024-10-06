import { Col, Row } from "antd";
import React from "react";

const DailyDiaryStudentSummaryHeading = () => {
  return (
    <div className="bg-white shadow-md w-full h-8 font-semibold mb-2">
      <Row gutter={16} className="h-full">
        <Col span={1} className="font-default flex justify-center"></Col>
        <Col span={5} className="font-default flex items-center ">
          Student name
        </Col>
        <Col span={4} className="font-default flex items-center">
          Student number
        </Col>
        <Col span={4} className="font-default flex items-center">
          Company
        </Col>
        <Col span={3} className="font-default flex items-center">
          Week
        </Col>
        <Col span={3} className="font-default flex items-center">
          Submitted
        </Col>

        <Col span={4} className="font-default flex items-center"></Col>
      </Row>
    </div>
  );
};

export default DailyDiaryStudentSummaryHeading;
