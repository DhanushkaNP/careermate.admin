"use client";

import BreadCrumpHeader from "@/components/BreadCrumpHeader";
import PageTitle from "@/components/PageTitle";
import { Card, Statistic, Input, Select, Table, Avatar, Button } from "antd";
import React, { useEffect, useState } from "react";

import { PiBuildingsFill } from "react-icons/pi";
import { CheckOutlined, WarningOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import Status from "@/components/Status/Status";
import { useFacultyId } from "@/utils/University/uni-selectors";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import api, { formatFilters } from "@/utils/api";
import DeleteModal from "@/components/DeleteModal";

const Companies = () => {
  const tableColumns = [
    {
      title: "",
      dataIndex: "logo",
      width: "6%",
    },
    {
      title: "Company name",
      dataIndex: "name",
      width: "18%",
    },
    {
      title: "Industry",
      dataIndex: "industry",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "12%",
    },
    {
      title: "Total interns",
      dataIndex: "totalInterns",
    },
    {
      title: "",
      render: ({ key, name }) => (
        <div className=" flex justify-end gap-3 pe-4">
          <Button type="primary" onClick={() => {}} ghost>
            View
          </Button>
          <Button
            danger
            onClick={() => {
              setCompanyDeleteModalDetails({
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

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const [companyStats, setCompanyStats] = useState({
    approved: 0,
    pending: 0,
    blocked: 0,
  });

  const [companyDeleteModalDetails, setCompanyDeleteModalDetails] = useState({
    isOpen: false,
    id: null,
    name: null,
  });

  const facultyId = useFacultyId();
  const token = useUserToken();

  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [companyStatus, setCompanyStatus] = useState("approved");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState();

  const [industrySearchTerm, setIndustrySearchTerm] = useState(null);

  const fetchStats = async () => {
    await api
      .get(`Faculties/${facultyId}/Company/Stats`, null, token)
      .then((response) => {
        setCompanyStats({
          approved: response.stats.approvedCompaniesCount,
          pending: response.stats.pendingCompaniesCount,
          blocked: response.stats.blockedCompaniesCount,
        });
      });
  };

  const handleIndustrySearch = async (value) => {
    setIndustrySearchTerm(value);
    if (value) {
      try {
        const response = await api.get(`Faculty/${facultyId}/Industries`, {
          search: value,
          limit: 20,
        });
        setIndustries(response.items);
      } catch (error) {
        console.error("Failed to fetch Industries:", error);
        setIndustries([]);
      }
    } else {
      setIndustries([]);
    }
  };

  const fetchCompanies = async (page = 1, pageSize = 15) => {
    let offset = (page - 1) * pageSize;

    let filters = {};
    if (selectedIndustry) filters = { ...filters, industry: selectedIndustry };
    if (companyStatus) filters = { ...filters, status: companyStatus };

    let params = {
      offset,
      limit: pageSize,
      search: searchKeyword,
      ...formatFilters(filters),
    };

    try {
      const response = await api.get(
        `Faculties/${facultyId}/Company/List`,
        params,
        token
      );
      setCompanies(response.items);
      console.log(response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.count,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchCompanies(page, pageSize);
  };

  const deleteCompany = async () => {
    await api.delete(
      `Faculties/${facultyId}/Company/${companyDeleteModalDetails.id}`,
      token
    );
    setCompanyDeleteModalDetails({ isOpen: false, id: null, name: null });
    fetchCompanies();
  };

  useEffect(() => {
    fetchStats();
  }, [facultyId, token]);

  useEffect(() => {
    fetchCompanies();
  }, [companyStatus, searchKeyword, selectedIndustry]);

  return (
    <>
      {/* Delete companies modal */}
      <DeleteModal
        open={companyDeleteModalDetails.isOpen}
        onCancel={() =>
          setCompanyDeleteModalDetails({
            isOpen: false,
            id: null,
            name: null,
          })
        }
        message={`Do you want to delete company ${companyDeleteModalDetails.name}?`}
        onDelete={() => {
          deleteCompany(companyDeleteModalDetails.id);
        }}
      />

      <div className="font-default text-dark-blue">
        <BreadCrumpHeader />

        <PageTitle title="Companies" />

        <div className="flex flex-row gap-4 mt-4">
          <Card
            bordered={false}
            className={`my-0 ${
              companyStatus === "approved" &&
              "bg-light-gray hover:shadow-none border-dark-dark-blue"
            }`}
            hoverable
            onClick={() => setCompanyStatus("approved")}
          >
            <Statistic
              title={
                <span className=" text-light-blue">Approved Companies</span>
              }
              value={companyStats.approved}
              prefix={
                <PiBuildingsFill
                  size={30}
                  className=" block align-middle mr-2"
                />
              }
              className=" my-0 font-default"
              valueStyle={{ color: "#3056D3" }}
            />
          </Card>
          <Card
            bordered={false}
            className={`my-0 ${
              companyStatus === "waiting" &&
              "bg-light-gray hover:shadow-none border-dark-dark-blue"
            }`}
            hoverable
            onClick={() => setCompanyStatus("waiting")}
          >
            <Statistic
              title={
                <span className=" text-[#3f8600]">Waiting for approval</span>
              }
              value={companyStats.pending}
              prefix={<CheckOutlined className="mr-4" />}
              valueStyle={{ color: "#3f8600" }}
              className="font-default"
            />
          </Card>
          <Card
            bordered={false}
            className={`my-0 ${
              companyStatus === "blocked" &&
              "bg-light-gray hover:shadow-none border-dark-dark-blue"
            }`}
            hoverable
            onClick={() => setCompanyStatus("blocked")}
          >
            <Statistic
              title={<span className="text-black">Blocked</span>}
              value={companyStats.blocked}
              prefix={<WarningOutlined className="mr-3" />}
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
          />

          <Select
            showSearch
            placeholder="Industry"
            filterOption={false}
            notFoundContent={null}
            size="large"
            allowClear
            className="!w-80 custom-select"
            onSearch={handleIndustrySearch}
            value={industrySearchTerm}
            onSelect={(value, option) => {
              setSelectedIndustry(value);
              setIndustrySearchTerm(value); // Set the selected value's name as the search term
            }}
            onClear={() => {
              setIndustrySearchTerm("");
            }}
          >
            {industries.map((i) => (
              <Select.Option key={i.id} value={i.id}>
                {i.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className=" mt-2">
          <Table
            columns={tableColumns}
            size="middle"
            className="font-default custom-table"
            dataSource={companies.map((c) => ({
              key: c.id,
              totalInterns: c.totalInternsCount,
              logo: (
                <div className="border rounded-full w-fit ms-2">
                  <Avatar
                    src={c.logoUrl}
                    icon={!c.logoUrl && <UserOutlined />}
                    size={"large"}
                  />
                </div>
              ),
              name: c.name,
              industry: c.industryName,
              status: (() => {
                switch (c.status) {
                  case 1:
                    return <Status name={"Pending"} color={"blue"} />;
                  case 2:
                    return <Status name={"Approved"} color={"green"} />;
                  case 3:
                    return <Status name={"Blocked"} color={"red"} />;
                  default:
                    return null;
                }
              })(),
            }))}
            pagination={{
              ...pagination,
              onChange: handlePaginationChange,
            }}
          ></Table>
        </div>
      </div>
    </>
  );
};

export default Companies;
