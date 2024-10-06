import api from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { Divider } from "antd";
import React, { useEffect, useState } from "react";

const DailyDiaryStudentStats = ({ studentId }) => {
  const [stats, setStats] = useState(null);

  const token = useUserToken();

  const fetchDailyDiaryStats = async () => {
    await api
      .get(`Students/${studentId}/DailyDiary/Stats`, null, token)
      .then((res) => {
        console.log("stats", res);
        setStats(res.item);
      });
  };

  useEffect(() => {
    fetchDailyDiaryStats();
  }, [studentId]);

  return (
    <div className="bg-white shadow rounded-md p-4 font-default mt-2 flex flex-col gap-2">
      <h5 className="font-bold text-base">Daily diary details</h5>
      <Divider className="my-0" />
      <div className="flex gap-2 flex-col">
        <h6 className="text-sm">Completed diaries: 10</h6>
        <h6 className="text-sm">Deadline passed and submitted : 5</h6>
        <h6 className="text-sm">Current week: 10/24</h6>
        <h6 className="text-sm">Coordinator approval requested: 4</h6>
      </div>
    </div>
  );
};

export default DailyDiaryStudentStats;
