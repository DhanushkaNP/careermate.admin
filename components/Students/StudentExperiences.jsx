import api from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import React, { useEffect, useState } from "react";
import StudentExperienceItem from "./StudentExperienceItem";

const StudentExperiences = ({ editable, studentId }) => {
  const token = useUserToken();

  const [experiences, setExperiences] = useState([]);

  const fetchExperiences = async () => {
    await api
      .get(`Students/${studentId}/Experience`, null, token)
      .then((response) => {
        setExperiences(response.items);
        console.log(response.items);
      });
  };

  useEffect(() => {
    fetchExperiences();
  }, [studentId]);

  return (
    experiences.length > 0 && (
      <>
        <div className="bg-white shadow rounded-md pt-4 ps-4 pe-4 pb-1 font-default max-w-4xl mt-2">
          <div className="flex justify-between">
            <h5 className="font-bold text-base mb-2">Experience</h5>
          </div>

          {experiences.map((experience) => (
            <StudentExperienceItem key={experience.id} {...experience} />
          ))}
        </div>
      </>
    )
  );
};

export default StudentExperiences;
