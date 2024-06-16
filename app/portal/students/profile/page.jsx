import { Avatar, Col, Divider, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";

const StudentProfile = () => {
  return (
    <div className="font-default text-dark-blue">
      <Row gutter={20}>
        <Col span={12} className=" font-default">
          <div className="border bg-white h-screen drop-shadow rounded-md py-4 px-3">
            <h3 className=" font-semibold">Student Information</h3>
            <Divider className=" my-2" />

            <Row>
              <Col span={8}>
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className=" ms-4 my-auto"
                />
              </Col>
              <Col span={16}>
                <p>test</p>
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={12}>
          <div className="border border-black"></div>
        </Col>
      </Row>
    </div>
  );
};

export default StudentProfile;
