"use client";

import FormContainer from "@/components/Form/FormContainer";
import FormTitle from "@/components/Form/FormTitle";
import NumericInput from "@/components/Form/NumericInput";
import { useIsAuth, useUserToken } from "@/utils/Auth/auth-selectors";
import { useSetBatch } from "@/utils/University/uni-actions";
import { useFacultyId } from "@/utils/University/uni-selectors";
import api from "@/utils/api";
import { getErrorMessage } from "@/utils/error-util";
import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Select,
  Input,
  Divider,
  DatePicker,
  Row,
  Col,
  Alert,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RootPage = () => {
  const router = useRouter();
  const [createStudentBatchForm] = Form.useForm();
  const [selectStudentBatchForm] = Form.useForm();

  const [showCreateStudentBatch, setShowCreateStudentBatch] = useState(false);
  const [studentBatches, setStudentBatches] = useState([]);
  const [createStudentBatchError, setCreateStudentBatchError] = useState(null);
  const [csvFile, setCsvFile] = useState(null);

  const isAuthenticated = useIsAuth();
  const token = useUserToken();
  const facultyId = useFacultyId();
  const setBatch = useSetBatch();

  const [faculty, setFaculty] = useState();

  useEffect(() => {
    if (!isAuthenticated || !facultyId) {
      router.push("signIn");
      return;
    }

    const fetchFacultyData = async () => {
      console.log(token);
      try {
        const response = await api.get(`Faculty/${facultyId}`, null, token);
        setFaculty({
          Id: response.id,
          name: response.name,
          universityId: response.universityId,
          universityName: response.universityName,
        });
        await fetchBatches();
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchFacultyData();
  }, [isAuthenticated, facultyId]);

  const fetchBatches = async () => {
    await api
      .get(`Faculty/${facultyId}/StudentBatches`, null, token)
      .then((response) => {
        console.log(response.items);
        setStudentBatches(response.items);
      });
  };

  const createStudentBatch = async (values) => {
    setCreateStudentBatchError(null);
    const formData = new FormData();
    formData.append("batchCode", values["batch-code"]);
    formData.append("startAt", values["start-at"].toISOString());
    formData.append("endAt", values["end-at"].toISOString());
    formData.append(
      "lastAllowedDateForStartInternship",
      values["last-intern-date"].toISOString()
    );
    formData.append(
      "validInternshipPeriodInMonths",
      values["validInternshipPeriodInMonths"]
    );
    formData.append("dailyDiaryDueWeeks", values["dailyDiaryDueWeeks"]);

    if (csvFile) {
      formData.append("studentCsv", csvFile);
    }

    try {
      await api
        .post(`Faculty/${facultyId}/StudentBatches`, formData, token, {
          "Content-Type": "multipart/form-data",
          Accept: "multipart/form-data",
        })
        .then(async () => {
          await fetchBatches();
          setShowCreateStudentBatch(false);
        });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setCreateStudentBatchError(errorMessage.message);
    }
  };

  const uploaderProps = {
    name: "student-csv",
    multiple: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file) => {
      setCsvFile(file);
      return false; // Prevent auto upload. We handle the upload in form submission.
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const selectStudentBatch = () => {
    selectStudentBatchForm.validateFields().then((values) => {
      var batchId = values["student-batch"];
      if (batchId) {
        setBatch(batchId);
        router.push("portal/coordinators");
      }
    });
  };

  const batchFilterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      {!showCreateStudentBatch && (
        // Select batch form Modal
        <FormContainer>
          <Form
            className="bg-white p-4 rounded-md font-default px-6 w-4/12 max-w-md shadow-md"
            name="signInForm"
            layout="vertical"
            form={selectStudentBatchForm}
            rules={[
              {
                required: true,
                message: "Student batch required to proceed",
              },
            ]}
          >
            <FormTitle title={"Select a batch"} />
            {faculty && (
              <div className=" mb-4">
                <p className="font-semibold">
                  {faculty.name}
                  <span>,</span>
                </p>
                <p>{faculty.universityName}</p>
              </div>
            )}

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold text-base">
                  Batch
                </span>
              }
              name={"student-batch"}
            >
              <Select
                showSearch
                optionFilterProp="children"
                className="font-default"
                size="large"
                options={studentBatches.map((sb) => {
                  return { value: sb.id, label: sb.batchCode };
                })}
                filterOption={batchFilterOption}
                placeholder="Select a batch"
              />
            </Form.Item>
            <div className=" flex justify-between mb-2 mt-10">
              <Button
                size="large"
                onClick={() => setShowCreateStudentBatch(true)}
              >
                Create new batch
              </Button>
              <Button size="large" type="primary" onClick={selectStudentBatch}>
                Continue
              </Button>
            </div>
          </Form>
        </FormContainer>
      )}

      {showCreateStudentBatch && (
        // Create student batch form
        <FormContainer>
          <Form
            className="bg-white p-4 rounded-md font-default px-6 w-5/12 max-w-xl shadow-md"
            name="signInForm"
            layout="vertical"
            form={createStudentBatchForm}
            onFinish={createStudentBatch}
          >
            <FormTitle title={"Create new batch"} className={"mb-2"} />

            {showCreateStudentBatch && createStudentBatchError && (
              <Alert
                message={createStudentBatchError}
                type="error"
                showIcon
                closable
                className="mb-3"
              />
            )}

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue text-base font-medium">
                  Batch code
                </span>
              }
              name={"batch-code"}
              rules={[
                { required: true, message: "Please input your batch code!" },
              ]}
            >
              <Input
                className="font-default font-normal text-dark-dark-blue"
                placeholder="Batch code"
                allowClear
                size="large"
              />
            </Form.Item>

            <Form.Item
              name={"student-csv"}
              rules={[{ required: true, message: "Student CSV required" }]}
            >
              <Dragger {...uploaderProps} accept=".csv" maxCount={1}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag Student CSV to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support only for a single upload. Please make sure that all
                  student data withing the file.
                </p>
              </Dragger>
            </Form.Item>

            <>
              <h5 className="text-dark-dark-blue text-base mb-0 font-medium">
                Select batch duration
              </h5>
              <Divider className=" mb-3 mt-1" />
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={"start-at"}
                    label={
                      <span className="font-default text-dark-dark-blue text-sm">
                        Start At
                      </span>
                    }
                    rules={[{ required: true, message: "Start date required" }]}
                  >
                    <DatePicker style={{ width: "80%" }} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name={"end-at"}
                    label={
                      <span className="font-default text-dark-dark-blue text-sm">
                        End At
                      </span>
                    }
                    rules={[{ required: true, message: "End date required" }]}
                  >
                    <DatePicker style={{ width: "80%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </>
            <Row gutter={16}>
              <Col span={14}>
                <Form.Item
                  className="mt-2"
                  name={"validInternshipPeriodInMonths"}
                  label={
                    <span className="font-default text-dark-dark-blue font-medium ">
                      Considered Internship Period (Months)
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Evaluation internship period required",
                    },
                    {
                      validator: (_, value) => {
                        if (value === "" || value > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The minimum value is 1")
                        );
                      },
                    },
                  ]}
                >
                  <NumericInput
                    className="!font-default font-normal text-dark-dark-blue w-full"
                    placeholder="6"
                    maxLength={2}
                    minLength={1}
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col span={10}>
                <Form.Item
                  className="mt-2"
                  name={"dailyDiaryDueWeeks"}
                  label={
                    <span className="font-default text-dark-dark-blue font-medium ">
                      DailyDiary due by (Weeks)
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Allowed last day to find internship required",
                    },
                    {
                      validator: (_, value) => {
                        if (value === "" || value > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The minimum value is 1")
                        );
                      },
                    },
                  ]}
                >
                  <NumericInput
                    className="!font-default font-normal text-dark-dark-blue w-full"
                    placeholder="2"
                    maxLength={2}
                    minLength={1}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              className="mt-2"
              name={"last-intern-date"}
              label={
                <span className="font-default text-dark-dark-blue font-medium text-base">
                  Allowed last day to find internship
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Allowed last day to find internship required",
                },
              ]}
            >
              <DatePicker className="w-2/4" />
            </Form.Item>
            <div className=" w-full flex justify-between">
              <Button onClick={() => setShowCreateStudentBatch(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create Batch
              </Button>
            </div>
          </Form>
        </FormContainer>
      )}
    </>
  );
};

export default RootPage;
