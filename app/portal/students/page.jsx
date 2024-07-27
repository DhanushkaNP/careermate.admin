"use client";

import BreadCrumpHeader from "@/components/BreadCrumpHeader";
import PageTitle from "@/components/PageTitle";
import React, { useEffect, useState } from "react";
import { Statistic, Card, Input, Button, Table, Avatar, Select } from "antd";
import { PiStudentFill } from "react-icons/pi";
import { CheckOutlined, WarningOutlined } from "@ant-design/icons";
import { IoMdBriefcase } from "react-icons/io";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import api, { formatFilters } from "@/utils/api";
import { useFacultyId } from "@/utils/University/uni-selectors";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { cvStatus } from "@/shared/cvStatus";
import Status from "@/components/Status/Status";
import DeleteModal from "@/components/DeleteModal";
import { useRouter } from "next/navigation";
import { studentLowProfilePicture } from "@/utils/Firebase/FirebaseImageUrls";

const Students = () => {
  const tableColumns = [
    {
      title: "",
      dataIndex: "proPic",
      width: "6%",
    },
    {
      title: "Full name",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "Student Id",
      dataIndex: "studentId",
      width: "12%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "12%",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "",
      render: ({ key, name }) => (
        <div className=" flex justify-end gap-3 pe-4">
          <Button
            type="primary"
            onClick={() => {
              router.push(`students/${key}`);
            }}
          >
            View
          </Button>
          <Button
            danger
            onClick={() => {
              setStudentDeleteModalDetails({
                isOpen: true,
                id: key,
                name: name,
              });
            }}
          >
            Delete
          </Button>
        </div>
      ),
      width: 300,
    },
  ];

  const router = useRouter();

  const [pagination, setPagination] = useState({
    pagination: {
      current: 1,
      pageSize: 15,
      total: 0,
    },
  });

  const [studentDeleteModalDetails, setStudentDeleteModalDetails] = useState({
    isOpen: false,
    id: null,
    name: null,
  });

  const facultyId = useFacultyId();
  const token = useUserToken();

  const [students, setStudents] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [pathways, setPathways] = useState([]);

  const [studentStatus, setStudentStatus] = useState("all");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState(null);
  const [selectedCvStatus, setSelectedCvStatus] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(null);

  const [studentStats, setStudentStats] = useState({
    total: 0,
    registered: 0,
    hired: 0,
  });

  const fetchStats = async () => {
    await api
      .get(`Faculties/${facultyId}/Student/Stats`, null, token)
      .then((response) => {
        setStudentStats({
          total: response.stats.totalStudentsCount,
          registered: response.stats.registeredStudentsCount,
          hired: response.stats.hiredStudentsCount,
        });
      });
  };

  const fetchDegrees = async (value) => {
    try {
      const response = await api.get(
        `Faculty/${facultyId}/Degrees/Suggestions`,
        { limit: 100 },
        null
      );
      setDegrees(response.items);
      console.log(response.items);
    } catch (error) {
      console.error("Failed to fetch degrees:", error);
      setDegrees([]);
    }
  };

  const fetchPathways = async (value) => {
    try {
      const response = await api.get(
        `Degree/${selectedDegreeProgram}/Pathways/Suggestions`,
        { limit: 100 }
      );
      setPathways(response.items);
    } catch (error) {
      console.error("Failed to fetch pathways:", error);
      setPathways([]);
    }
  };

  const fetchStudents = async (page = 1, pageSize = 15) => {
    let offset = (page - 1) * pageSize;

    let filters = {};
    if (selectedDegreeProgram)
      filters = { ...filters, degree: selectedDegreeProgram };
    if (selectedPathway) filters = { ...filters, pathway: selectedPathway };
    if (selectedCvStatus) filters = { ...filters, cvStatus: selectedCvStatus };
    if (studentStatus) filters = { ...filters, status: studentStatus };

    let params = {
      offset,
      limit: pageSize,
      search: searchKeyword,
      ...formatFilters(filters),
    };

    try {
      const response = await api.get(
        `/Faculties/${facultyId}/Student/List`,
        params,
        token
      );
      setStudents(response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.count,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error(error);
      setStudents([]);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchStudents(page, pageSize);
  };

  const deleteStudent = async () => {
    await api.delete(
      `Faculties/${facultyId}/Student/${studentDeleteModalDetails.id}`,
      token
    );
    setStudentDeleteModalDetails({ isOpen: false, id: null, name: null });
    fetchStudents();
  };

  useEffect(() => {
    fetchStats();
  }, [facultyId, token]);

  useEffect(() => {
    fetchDegrees();
  }, []);

  useEffect(() => {
    if (!selectedDegreeProgram) return;
    fetchPathways();
  }, [selectedDegreeProgram]);

  useEffect(() => {
    fetchStudents();
  }, [
    selectedDegreeProgram,
    selectedPathway,
    selectedCvStatus,
    studentStatus,
    searchKeyword,
  ]);

  return (
    <>
      {/* Delete Student Modal*/}
      <DeleteModal
        open={studentDeleteModalDetails.isOpen}
        onCancel={() =>
          setStudentDeleteModalDetails({
            isOpen: false,
            id: null,
            name: null,
          })
        }
        message={`Do you want to delete student ${studentDeleteModalDetails.name}?`}
        onDelete={() => {
          console.log(
            studentDeleteModalDetails.id,
            studentDeleteModalDetails.name
          );
          deleteStudent(studentDeleteModalDetails.id);
        }}
      />

      <div className="font-default text-dark-blue">
        <BreadCrumpHeader />

        <PageTitle title="Students" />

        <div className="flex flex-row gap-4 mt-4">
          <Card
            bordered={false}
            className={`my-0 ${
              studentStatus === "all" &&
              "bg-light-gray hover:shadow-none border-dark-dark-blue"
            }`}
            hoverable
            onClick={() => setStudentStatus("all")}
          >
            <Statistic
              title={<span className=" text-black">Total students</span>}
              value={studentStats.total}
              prefix={
                <PiStudentFill size={30} className=" block align-middle mr-2" />
              }
              className=" my-0 text-light-blue font-default"
            />
          </Card>
          <Card
            bordered={false}
            className={`my-0 ${
              studentStatus === "registered" &&
              "bg-light-gray hover:shadow-none border-dark-dark-blue"
            }`}
            hoverable
            onClick={() => setStudentStatus("registered")}
          >
            <Statistic
              title={<span className=" text-[#3f8600]">Registered</span>}
              value={studentStats.registered}
              suffix={`/ ${studentStats.total}`}
              prefix={<CheckOutlined className="mr-2" />}
              valueStyle={{ color: "#3f8600" }}
              className="font-default"
            />
          </Card>
          <Card
            bordered={false}
            className={`my-0 ${
              studentStatus === "hired" &&
              "bg-light-gray hover:shadow-none border-dark-dark-blue"
            }`}
            hoverable
            onClick={() => setStudentStatus("hired")}
          >
            <Statistic
              title={<span className=" text-light-blue">Hired</span>}
              value={studentStats.hired}
              prefix={<IoMdBriefcase className="mr-2" size={30} />}
              valueStyle={{ color: "#3056D3" }}
              className="font-default"
            />
          </Card>
          <Card
            bordered={false}
            className={`my-0 ${
              studentStatus === "seeking" &&
              "bg-light-gray hover:shadow-none border-dark-dark-blue"
            }`}
            hoverable
            onClick={() => setStudentStatus("seeking")}
          >
            <Statistic
              title={
                <span className=" text-[#cf1322]">
                  Waiting for a internship
                </span>
              }
              value={studentStats.total - studentStats.hired}
              prefix={<WarningOutlined className="mr-3" />}
              valueStyle={{ color: "#cf1322" }}
              bordered
              className="font-default"
            />
          </Card>
        </div>

        <div className="flex mt-2 gap-4">
          <Input.Search
            placeholder={"Search by email or name"}
            enterButton
            className=" w-1/4 shadow-sm flex-initial"
            size="large"
            style={{ borderRadius: "0px !important" }}
            onSearch={(value) => {
              setSearchKeyword(value);
            }}
            allowClear
            onClear={() => setSearchKeyword("")}
          />
          <Select
            placeholder="Degree Program"
            className="font-default custom-placeholder w-80 custom-select"
            size="large"
            allowClear
            onSelect={(value) => setSelectedDegreeProgram(value)}
            onClear={() => {
              setSelectedDegreeProgram(null);
              setSelectedPathway(null);
            }}
            dropdownRender={(menu) => (
              <div className="scrollable-dropdown">{menu}</div>
            )}
          >
            {degrees.map((i) => (
              <Select.Option key={i.id} label={i.name}>
                {i.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Pathway"
            className=" text-black font-default custom-placeholder w-72 custom-select"
            size="large"
            allowClear
            onSelect={(value) => setSelectedPathway(value)}
            onClear={() => setSelectedPathway(null)}
            disabled={!selectedDegreeProgram}
            dropdownRender={(menu) => (
              <div className="scrollable-dropdown">{menu}</div>
            )}
          >
            {pathways.map((i) => (
              <Select.Option key={i.id} label={i.name}>
                {i.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Cv status"
            notFoundContent={null}
            allowClear
            size="large"
            className=" text-black font-default custom-placeholder w-52 custom-select"
            onSelect={(value) => setSelectedCvStatus(value)}
            onClear={() => setSelectedCvStatus(null)}
          >
            {Object.entries(cvStatus).map(([key, value]) => (
              <Select.Option key={key} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className=" mt-2">
          <Table
            columns={tableColumns}
            size="middle"
            className="font-default custom-table"
            dataSource={students.map((s) => ({
              key: s.id,
              proPic: (
                <div className="border rounded-full w-fit ms-2">
                  <Avatar
                    src={
                      s.profilePicFirebaseId
                        ? studentLowProfilePicture(s.profilePicFirebaseId)
                        : null
                    }
                    icon={!s.profilePicFirebaseId && <UserOutlined />}
                    size={"large"}
                  />
                </div>
              ),
              name: `${s.firstName} ${s.lastName}`,
              studentId: s.studentId,
              status: s.isHired ? (
                <Status name={"Hired"} color={"green"} />
              ) : (
                <Status name={"SEEKING"} color={"red"} />
              ),
              company: s.companyId ? (
                <Link
                  href={`companies/${s.companyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.companyName}
                </Link>
              ) : (
                "N/A"
              ),
            }))}
            pagination={pagination.pagination}
            handlePaginationChange={handlePaginationChange}
          ></Table>
        </div>
      </div>
    </>
  );
};

export default Students;
