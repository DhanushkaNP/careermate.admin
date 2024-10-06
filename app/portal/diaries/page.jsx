"use client";

import BreadCrumpHeader from "@/components/BreadCrumpHeader";
import CustomPagination from "@/components/CustomPagination ";
import DailyDiaryStudentSummary from "@/components/DailyDiary/DailyDiaryStudentSummary";
import DailyDiaryStudentSummaryHeading from "@/components/DailyDiary/DailyDiraryStudentSummaryHeading";
import DegreeFilter from "@/components/Filters/DegreeFilter";
import PathywayFilter from "@/components/Filters/PathywayFilter";
import PageTitle from "@/components/PageTitle";
import api, { formatFilters } from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/University/uni-selectors";
import { Input, Select } from "antd";
import React, { useEffect, useState } from "react";

const Diaries = () => {
  const facultyId = useFacultyId();
  const token = useUserToken();

  const [diaries, setDiaries] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");

  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });

  const handlePaginationChange = (page, pageSize) => {};

  const fetchDiaries = async (page = 1, pageSize = 25) => {
    let offset = (page - 1) * pageSize;

    let filters = {};
    if (selectedDegreeProgram)
      filters = { ...filters, degree: selectedDegreeProgram };
    if (selectedPathway) filters = { ...filters, pathway: selectedPathway };

    let params = {
      offset,
      limit: pageSize,
      search: searchKeyword,
      ...formatFilters(filters),
    };

    try {
      const response = await api.get(
        `Faculties/${facultyId}/DailyDiary/CoordinatorApprovalRequested`,
        params,
        token
      );

      setDiaries(response.items);
      console.log(response.items);

      setPagination((prev) => ({
        ...prev,
        total: response.meta.count,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error("Failed to fetch diaries:", error);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, [selectedDegreeProgram, selectedPathway, searchKeyword]);

  return (
    <div className="font-default text-dark-blue flex flex-col min-h-screen gap-2">
      <BreadCrumpHeader />

      <PageTitle title="Diaries" />

      <div className="w-full flex gap-2">
        <Input.Search
          placeholder={"Search by student number or name"}
          enterButton
          className="w-1/3 shadow-sm flex-initial"
          size="large"
          style={{ borderRadius: "0px" }}
          onSearch={(value) => setSearchKeyword(value)}
        />

        <DegreeFilter
          onSelect={(value) => setSelectedDegreeProgram(value)}
          onClear={() => {
            setSelectedDegreeProgram(null);
            setSelectedPathway(null);
          }}
          facultyId={facultyId}
          selectedDegreeProgram={selectedDegreeProgram}
          placeholder="Student Degree Program"
        />
        <PathywayFilter
          onSelect={(value) => setSelectedPathway(value)}
          onClear={() => setSelectedPathway(null)}
          selectedDegreeProgram={selectedDegreeProgram}
          selectedPathway={selectedPathway}
          placeholder="Student Pathway"
        />
      </div>

      <p className=" text-light-blue font-medium text-base">
        Total <span className=" font-bold">80</span> documents to be review
      </p>
      <div>
        <DailyDiaryStudentSummaryHeading />

        {diaries.map((diary) => (
          <DailyDiaryStudentSummary
            key={diary.id}
            id={diary.id}
            studentName={diary.studentName}
            studentNumber={diary.studentNumber}
            companyName={diary.companyName}
            weekNumber={diary.weekNumber}
            approvalRequestTime={diary.supervisorApprovalRequestedDate}
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

export default Diaries;
