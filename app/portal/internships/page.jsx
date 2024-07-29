"use client";

import React, { useEffect, useState } from "react";
import { Card, Statistic, Input, Button, Select, message } from "antd";
import BreadCrumpHeader from "@/components/BreadCrumpHeader";
import PageTitle from "@/components/PageTitle";
import { BsFilePost } from "react-icons/bs";
import { WarningOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import InternshipPostSummary from "@/components/Internship/InternshipPostSummary";
import api, { formatFilters } from "@/utils/api";
import { useFacultyId } from "@/utils/University/uni-selectors";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import CustomPagination from "@/components/CustomPagination ";

const Internships = () => {
  const token = useUserToken();
  const facultyId = useFacultyId();

  const [stats, setStats] = useState({ approvedPosts: 0, waitingPosts: 0 });
  const [posts, setPosts] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [postStatus, setPostStatus] = useState("approved");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const router = useRouter();

  const fetchStats = async () => {
    try {
      await api
        .get(`Faculties/${facultyId}/InternshipPost/Stats`, null, token)
        .then((response) => {
          setStats({
            approvedPosts: response.numberOfApprovedPosts,
            waitingPosts: response.numberOfWaitingPosts,
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await api.get(`Faculty/${facultyId}/Industries`);
      setIndustries(response.items);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  const fetchPosts = async (page = 1, pageSize = 10) => {
    let offset = (page - 1) * pageSize;

    let filters = { status: postStatus };
    if (selectedIndustry) filters = { ...filters, industry: selectedIndustry };

    let params = {
      offset,
      limit: pageSize,
      search: searchKeyword,
      ...formatFilters(filters),
    };

    try {
      const response = await api.get(
        `Faculties/${facultyId}/InternshipPost/List`,
        params,
        token
      );
      setPosts(response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.count,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchIndustries();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [postStatus, searchKeyword, selectedIndustry]);

  const onDeletePost = async (id) => {
    try {
      await api.delete(`Faculties/${facultyId}/InternshipPost/${id}`, token);
      fetchPosts();
      fetchStats();
      message.success("Post deleted");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const approvePost = async (id) => {
    try {
      await api
        .put(`Faculties/${facultyId}/InternshipPost/${id}/Approve`, null, token)
        .then(() => {
          fetchPosts();
          fetchStats();
        });
      message.success("Post approved");
    } catch (error) {
      message.error("Approve failed");
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchPosts(page, pageSize);
  };

  return (
    <div className="font-default text-dark-blue flex flex-col min-h-screen">
      <BreadCrumpHeader />
      <PageTitle title="Internships" />

      <div className="flex flex-row gap-4 mt-4">
        <Card
          bordered={false}
          className={`my-0 ${
            postStatus === "approved" &&
            "bg-light-gray hover:shadow-none border-dark-dark-blue"
          }`}
          hoverable
          onClick={() => setPostStatus("approved")}
        >
          <Statistic
            title={<span className="text-light-blue">Approved posts</span>}
            value={stats.approvedPosts}
            prefix={
              <BsFilePost size={24} className="block align-middle mr-2" />
            }
            className="my-0 font-default"
            valueStyle={{ color: "#3056D3" }}
          />
        </Card>

        <Card
          bordered={false}
          className={`my-0 ${
            postStatus === "waiting" &&
            "bg-light-gray hover:shadow-none border-dark-dark-blue"
          }`}
          hoverable
          onClick={() => setPostStatus("waiting")}
        >
          <Statistic
            title={<span className="text-[#cf1322]">Waiting for approval</span>}
            value={stats.waitingPosts}
            prefix={<WarningOutlined className="mr-3" />}
            className="font-default"
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </div>

      <div className="flex justify-between mt-2">
        <div className="w-full flex gap-2">
          <Input.Search
            placeholder={"Search by email or name"}
            enterButton
            className="w-1/4 shadow-sm flex-initial"
            size="large"
            style={{ borderRadius: "0px" }}
            onSearch={(value) => setSearchKeyword(value)}
          />

          <Select
            showSearch
            optionFilterProp="children"
            className="font-default"
            size="large"
            placeholder="Select an Industry"
            onSelect={(value) => setSelectedIndustry(value)}
            maxCount={5}
            allowClear
            onClear={() => setSelectedIndustry(null)}
          >
            {industries.map((i) => (
              <Select.Option key={i.id} label={i.name}>
                {i.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Button
          type="primary"
          className="flex-initial flex gap-2 bg-light-blue"
          onClick={() => {
            router.push("internships/create-post");
          }}
        >
          <span className="font-default">Create a post</span>
        </Button>
      </div>

      <div className="flex-grow">
        {posts.map((p) => (
          <InternshipPostSummary
            key={p.id}
            id={p.id}
            company={p.companyName}
            jobTitle={p.title}
            isApproved={p.isApproved}
            location={p.location}
            jobType={p.type}
            showApprove={postStatus === "waiting" ? true : false}
            companyLogoFirebaseId={p.firebaseLogoId}
            onDelete={onDeletePost}
            onApprove={approvePost}
          />
        ))}
      </div>

      <CustomPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePaginationChange}
      />
    </div>
  );
};

export default Internships;
