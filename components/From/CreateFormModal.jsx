"use client";

import React, { useState } from "react";
import { Form, Modal, Alert, Button } from "antd";
import FormTitle from "./FormTitle";
import { getErrorMessage } from "@/utils/error-util";

const CreateFormModal = ({
  open,
  onCancel,
  onCreate,
  title,
  width,
  children,
}) => {
  const [form] = Form.useForm();
  const [error, setError] = useState();

  const handlSubmit = async () => {
    form.validateFields().then(async (values) => {
      try {
        console.log(values);
        await onCreate(values);
        setError(null);
        form.resetFields();
      } catch (error) {
        console.log(error);
        const errorMessage = getErrorMessage(error.response);
        setError(errorMessage.message);
        return;
      }
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      className="w-fit"
      width={width}
      onOk={handlSubmit}
      closeIcon={false}
      footer={[
        <Button key="create" type="primary" onClick={handlSubmit}>
          Create
        </Button>,
        <Button key="cancel" onClick={() => onCancel()}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        layout="vertical"
        form={form}
      >
        <FormTitle title={title} />
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            className="mb-4"
          />
        )}
        {children}
      </Form>
    </Modal>
  );
};

export default CreateFormModal;
