"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import StudentCertificationItem from "./StudentCertificationItem";

const StudentCertifications = ({ editable, studentId }) => {
  const token = useUserToken();

  const [certifications, setCertifications] = useState([]);

  const fetchCertifications = async () => {
    await api
      .get(`Students/${studentId}/Certification`, null, token)
      .then((response) => {
        setCertifications(response.items);
        console.log(response.items);
      });
  };

  useEffect(() => {
    fetchCertifications();
  }, [studentId]);

  return (
    certifications.length > 0 && (
      <>
        <div className="bg-white shadow rounded-md pt-4 ps-4 pe-4 pb-1 font-default max-w-4xl mt-2">
          <div className="flex justify-between">
            <h5 className="font-bold text-base mb-2">
              Licenses & Certifications{" "}
            </h5>{" "}
          </div>

          <div>
            {certifications.map((certification) => (
              <StudentCertificationItem
                key={certification.id}
                id={certification.id}
                name={certification.name}
                issuingOrganization={certification.organization}
                issueMonth={certification.issuedMonth}
              />
            ))}
          </div>
        </div>
      </>
    )
  );
};

export default StudentCertifications;
