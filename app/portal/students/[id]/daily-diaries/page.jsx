"use client";

import DailyDiaryStudentSummary from "@/components/DailyDiary/DailyDiaryStudentSummary";
import DailyDiaryStudentSummaryHeading from "@/components/DailyDiary/DailyDiraryStudentSummaryHeading";
import api, { formatFilters } from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/University/uni-selectors";
import { Button } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const StudentDailyDiaries = () => {
  const router = useRouter();
  const token = useUserToken();
  const facultyId = useFacultyId();
  const { id } = useParams();

  const [diaries, setDiaries] = useState([]);

  const fetchDiaries = async () => {
    let filters = {};
    filters = { ...filters, studentId: id };

    let params = {
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
    } catch (error) {
      console.error("Failed to fetch diaries:", error);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, [id]);

  return (
    <div className=" font-default">
      <div className=" flex justify-between">
        <p className=" text-light-blue font-medium text-base">
          Total <span className=" font-bold">80</span> documents to be review
        </p>
        <Button className=" font-default" onClick={() => router.back()}>
          Go back
        </Button>
      </div>

      <div className="mt-2">
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
    </div>
  );
};

export default StudentDailyDiaries;
