"use client";

import { useUserToken } from "@/utils/Auth/auth-selectors";
import { useBatchId, useFacultyId } from "@/utils/University/uni-selectors";
import api from "@/utils/api";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  notification,
} from "antd";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const BatchConfigurations = () => {
  const [form] = Form.useForm();

  const token = useUserToken();
  const facultyId = useFacultyId();
  const batchId = useBatchId();

  const fetchStudentBatchDetails = async () => {
    await api
      .get(`Faculty/${facultyId}/StudentBatches/${batchId}`, null, token)
      .then((response) => {
        const batchDetails = response.item;

        // Convert the date strings to dayjs objects and convert to local time
        const startAt = dayjs(batchDetails.batchStartAt).tz(dayjs.tz.guess());
        const endAt = dayjs(batchDetails.batchEndAt).tz(dayjs.tz.guess());
        const lastAllowedDateForStartInternship = dayjs(
          batchDetails.lastAllowedDateForStartInternship
        ).tz(dayjs.tz.guess());

        form.setFieldsValue({
          code: batchDetails.batchCode,
          startAt: startAt,
          endAt: endAt,
          lastAllowedDateForStartInternship: lastAllowedDateForStartInternship,
        });
      });
  };

  useEffect(() => {
    fetchStudentBatchDetails();
  }, []);

  const handleBatchUpdate = async ({
    startAt,
    endAt,
    lastAllowedDateForStartInternship,
    code,
  }) => {
    await api.put(
      `Faculty/${facultyId}/StudentBatches/${batchId}`,
      { batchCode: code, startAt, endAt, lastAllowedDateForStartInternship },
      token
    );
    fetchStudentBatchDetails();

    // Show success notification
    notification.success({
      message: "Batch Updated",
      description: "The batch details have been successfully updated.",
      placement: "bottomLeft",
    });
  };

  return (
    <div className="w-full font-default min-h-96 max-h-fit">
      <div className="mb-2">
        <h3 className="font-semibold text-base mb-2">Batch configurations</h3>
        <Form
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          layout="vertical"
          form={form}
          onFinish={handleBatchUpdate}
        >
          <Row>
            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue">
                  Batch code
                </span>
              }
              name={"code"}
              rules={[
                { required: true, message: "Please input your batch code!" },
              ]}
            >
              <Input className="font-default font-normal text-dark-dark-blue" />
            </Form.Item>
          </Row>

          <h5 className="text-dark-dark-blue text-base mb-0 font-medium font-default">
            Select batch duration
          </h5>
          <Divider className="mb-3 mt-1" />
          <Row gutter={2}>
            <Col span={5}>
              <Form.Item
                name={"startAt"}
                label={
                  <span className="font-default text-dark-dark-blue text-sm">
                    Start At
                  </span>
                }
                rules={[{ required: true, message: "Start date required" }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item
                name={"endAt"}
                label={
                  <span className="font-default text-dark-dark-blue text-sm">
                    End At
                  </span>
                }
                rules={[{ required: true, message: "End date required" }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>

          <h5 className="text-dark-dark-blue text-base mb-0 font-medium font-default">
            Last allowed date to find internship
          </h5>
          <Divider className="mb-3 mt-1" />
          <Form.Item
            name={"lastAllowedDateForStartInternship"}
            rules={[
              {
                required: true,
                message: "Last allowed internship date required",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default BatchConfigurations;
