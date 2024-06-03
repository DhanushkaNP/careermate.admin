"use client";

import BreadCrumpHeader from "@/components/BreadCrumpHeader";
import DeleteModal from "@/components/DeleteModal";
import CreateFormModal from "@/components/From/CreateFormModal";
import UpdateFormModal from "@/components/From/UpdateFormModal";
import PageTitle from "@/components/PageTitle";
import { useIsCoordinator, useUserToken } from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/University/uni-selectors";
import api from "@/utils/api";
import { Table, Button, Input, Form, Row, Col } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const AdminUsers = () => {
  const columns = [
    {
      title: "Full name",
      dataIndex: "name",
      width: "25%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "22%",
    },
    {
      title: "Created",
      dataIndex: "created",
    },
    {
      title: "",
      render: ({ key }) =>
        isCoordinator && (
          <div className=" flex justify-end gap-3 pe-4">
            <Button
              type="primary"
              onClick={() => {
                editOnClickHandler(key);
              }}
            >
              Edit
            </Button>
            <Button
              danger
              onClick={() => {
                setUserDeleteModalDetails({ isOpen: true, userId: key });
              }}
            >
              Delete
            </Button>
          </div>
        ),
      width: 300,
    },
  ];

  const isCoordinator = useIsCoordinator();
  const facultyId = useFacultyId();
  const token = useUserToken();

  const router = useRouter();
  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter((segment) => segment);

  const [tableLoading, setTableLoading] = useState(false);
  const [coordinators, setCoordinatorUsers] = useState([]);
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
      total: 20,
    },
  });

  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [userDeleteModalDetails, setUserDeleteModalDetails] = useState({
    isOpen: false,
    userId: null,
  });
  const [userEditModalDetails, setUserEditModalDetails] = useState({
    isOpen: false,
    userId: null,
    firstName: null,
    lastName: null,
    email: null,
  });

  const handleTableChange = (pagination, filters) => {
    setTableParams({
      pagination: {
        ...pagination,
      },
      filters,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const fetchData = async () => {
    try {
      let offset =
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize;
      setTableLoading(true);
      await api
        .get(
          `Faculty/${facultyId}/Coordinators`,
          {
            limit: tableParams.pagination.pageSize,
            offset: offset,
            search: searchKeyWord,
          },
          token
        )
        .then((response) => {
          console.log(response);
          setCoordinatorUsers(response.items);
          setTableLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: response.meta.count,
            },
          });
        });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams), searchKeyWord]);

  const createUser = async (values) => {
    await api.post(`/Faculty/${facultyId}/Coordinator`, { ...values }, token);
    setIsCreateModelOpen(false);
    fetchData();
  };

  const deleteUser = async () => {
    await api.delete(`Coordinator/${userDeleteModalDetails.userId}`, token);
    await fetchData();
    setUserDeleteModalDetails({ isOpen: false, userId: null });
  };

  const editOnClickHandler = async (id) => {
    try {
      await api.get(`Coordinator/${id}`, null, token).then((response) => {
        console.log(`response ${response.firstName}`);
        setUserEditModalDetails({
          isOpen: true,
          userId: response.coordinator.id,
          firstName: response.coordinator.firstName,
          lastName: response.coordinator.lastName,
          email: response.coordinator.email,
        });
      });
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (values) => {
    console.log(values["new-password"]);
    if (values["new-password"]) {
      await api.put(
        `Coordinator/${userEditModalDetails.userId}/Password`,
        {
          newPassword: values["new-password"],
        },
        token
      );
    }

    await api.put(
      `Coordinator/${userEditModalDetails.userId}`,
      {
        firstName: values["first-name"],
        lastName: values["last-name"],
        email: values.email,
      },
      token
    );
    await fetchData();
    setUserEditModalDetails({
      isOpen: false,
      userId: null,
      firstName: null,
      lastName: null,
      email: null,
    });
  };

  return (
    <div className=" font-default text-dark-blue">
      {/* Create user modal */}
      <CreateFormModal
        open={isCreateModelOpen}
        onCancel={() => setIsCreateModelOpen(false)}
        onCreate={createUser}
        title={"Create Coordinator"}
        width={500}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-bold">
                  First Name
                </span>
              }
              name={"FirstName"}
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input
                className="font-default font-normal text-dark-dark-blue"
                placeholder="John"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-bold">
                  Last Name
                </span>
              }
              name={"LastName"}
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input
                className="font-default font-normal text-dark-dark-blue"
                placeholder="Smith"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          className=" w-5/6"
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Email
            </span>
          }
          name={"Email"}
          rules={[
            { required: true, message: "Please input your E-mail!" },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
        >
          <Input
            className="font-default font-normal text-dark-dark-blue"
            autoComplete="new-email"
            placeholder="johnSmith@example.com"
          />
        </Form.Item>
        <Form.Item
          className=" w-3/4"
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Password
            </span>
          }
          name={"Password"}
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
          />
        </Form.Item>
      </CreateFormModal>

      {/* Delete user modal */}
      <DeleteModal
        open={userDeleteModalDetails.isOpen}
        onCancel={() =>
          setUserDeleteModalDetails({ isOpen: false, userId: null })
        }
        onDelete={deleteUser}
        message={`Do you want to delete the user?`}
      />

      {/* Edit user modal */}
      <UpdateFormModal
        open={userEditModalDetails.isOpen}
        width={"30%"}
        onCancel={() => {
          setUserEditModalDetails({
            isOpen: false,
            userId: null,
            firstName: null,
            lastName: null,
            email: null,
          });
        }}
        onUpdate={updateUser}
        title={"Update Coordinator"}
        initialValues={{
          "first-name": userEditModalDetails.firstName,
          "last-name": userEditModalDetails.lastName,
          email: userEditModalDetails.email,
        }}
      >
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              First Name
            </span>
          }
          name={"first-name"}
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Last Name
            </span>
          }
          name={"last-name"}
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Email
            </span>
          }
          name={"email"}
          rules={[
            { required: true, message: "Please input your E-mail!" },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
        >
          <Input
            className="font-default font-normal text-dark-dark-blue"
            autoComplete="new-email"
          />
        </Form.Item>
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              New Password
            </span>
          }
          name={"new-password"}
          rules={[
            {
              validator: (_, value) => {
                if (value && value.length < 8) {
                  return Promise.reject(
                    "Password must be exactly 8 characters!"
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
            placeholder="Password"
          />
        </Form.Item>
      </UpdateFormModal>

      <BreadCrumpHeader pathSegments={pathSegments} />

      <PageTitle title="Coordinators" />

      <div className="flex justify-between mt-2">
        <Input.Search
          placeholder={"Search by email or name"}
          enterButton
          className=" w-1/4 shadow-sm flex-initial"
          size="large"
          style={{ borderRadius: "0px !important" }}
          onSearch={(value) => {
            setSearchKeyWord(value);
            console.log(searchKeyWord);
          }}
        />
        <Button
          type="primary"
          className=" flex-initial flex gap-2 bg-light-blue"
          onClick={() => {
            setIsCreateModelOpen(true);
          }}
        >
          <span className=" font-default">Create new User</span>
        </Button>
      </div>

      <div className="mt-4 font-default">
        <Table
          columns={columns}
          dataSource={coordinators.map((s) => {
            return {
              key: s.id,
              name: `${s.firstName} ${s.lastName ? s.lastName : ""}`,
              email: s.email,
              created: new Date(s.createdAt).toDateString(),
              role: s.role,
            };
          })}
          size="middle"
          className="font-default text-md"
          loading={tableLoading}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default AdminUsers;
