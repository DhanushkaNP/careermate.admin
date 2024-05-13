"use client";

import FormContainer from "@/components/From/FormContainer";
import FormTitle from "@/components/From/FormTitle";
import { useLogIn } from "@/utils/Auth/auth-actions";
import { useIsAuth } from "@/utils/Auth/auth-selectors";
import { decodeToken } from "@/utils/Auth/auth-util";
import api from "@/utils/api";
import { getErrorMessage } from "@/utils/error-util";
import { Form, Input, Button, Select, Alert } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SignIn = () => {
  const isAuthenticated = useIsAuth();
  const login = useLogIn();

  const [form] = Form.useForm();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onFinish = async (values) => {
    setErrorMessage(null);

    try {
      if (values.role == "coordinator") {
        await api
          .post("coordinator/login", {
            email: values.email,
            password: values.password,
          })
          .then((response) => {
            const token = decodeToken(response.token);
            login(response.token, response.userId, token.exp, true, false);
          });
      } else if (values.role == "assistant") {
        await api
          .post("assistant/login", {
            email: values.email,
            password: values.password,
          })
          .then((response) => {
            const token = decodeToken(response.token);
            login(response.token, response.userId, token.exp);
          });
      } else {
        throw new Error("Undefined role");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setErrorMessage(errorMessage.message);
      return;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <FormContainer>
      <Form
        className="bg-white p-4 rounded-md font-default px-6 w-4/12 max-w-md shadow-md"
        name="signInForm"
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <FormTitle
          description={"Enter your details to SignIn"}
          title={"CareerMate"}
          subTitle={"Admin"}
        />
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-semibold text-base">
              Email
            </span>
          }
          name={"email"}
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
        >
          <Input
            className="font-default font-normal text-dark-dark-blue"
            placeholder="Email"
            allowClear
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-semibold text-base">
              Role
            </span>
          }
          name={"role"}
          rules={[{ required: true, message: "Please select a valid role!" }]}
        >
          <Select
            className=" font-default"
            defaultValue={"coordinator"}
            size="large"
            options={[
              { value: "coordinator", label: "Coordinator" },
              { value: "assistant", label: "Assistant" },
            ]}
          ></Select>
        </Form.Item>

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-semibold text-base">
              Password
            </span>
          }
          name={"password"}
          rules={[
            { required: true, message: "Please input valid Password!" },
            {
              validator: (_, value) => {
                if (value && value.length < 8) {
                  return Promise.reject(
                    "Password should have more than 8 characters!"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            className="font-default font-normal text-dark-dark-blue"
            autoComplete="new-password"
            placeholder={"Password"}
            size="large"
          />
        </Form.Item>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            className="mb-3"
          />
        )}

        <Form.Item className=" mb-2">
          <Button
            type="primary"
            htmlType="submit"
            className=" bg-light-blue font-bold font-default"
            block={true}
            size="large"
          >
            Sign In
          </Button>
        </Form.Item>

        <Form.Item className="font-default text-dark-dark-blue mb-0">
          <div className="flex">
            <p className="font-default pr-1">Forgot Password?</p>
            <Link href={"/signin"} className="font-default text-light-blue">
              Click here
            </Link>
          </div>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

export default SignIn;
