"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, Button, Col, message, Row } from "antd";
import { DeleteOutlined, LinkOutlined, UserOutlined } from "@ant-design/icons";
import { SlGraduation } from "react-icons/sl";
import { MdOutlineLocationOn } from "react-icons/md";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import api from "@/utils/api";
import StudentCertifications from "@/Components/Students/StudentCertifications";
import StudentSkills from "@/Components/Students/StudentSkills";
import ContactsAndSocialMedia from "@/Components/Students/ContactsAndSocialMedia";
import StudentExperiences from "@/Components/Students/StudentExperiences";
import { studentHighProfilePicture } from "@/utils/Firebase/FirebaseImageUrls";
import { useFacultyId } from "@/utils/University/uni-selectors";
import { FcApproval } from "react-icons/fc";
import { CiWarning } from "react-icons/ci";

const CompanyStudentProfile = () => {
  const router = useRouter();

  const { id } = useParams();
  const facultyId = useFacultyId();
  const token = useUserToken();

  const [student, setStudent] = useState({});
  const [cvStatus, setCvStatus] = useState(0);

  const fetchStudent = async () => {
    await api
      .get(`Faculties/${facultyId}/Student/${id}`, null, token)
      .then((res) => {
        setStudent(res.item);
        setCvStatus(res.item.cvStatus);
      });
  };

  const downloadCv = async () => {
    router.push(
      `http://localhost:62200/api/Faculties/${facultyId}/Student/${id}/CV`
    );
  };

  const approveCv = async () => {
    await api
      .post(
        `Faculties/${facultyId}/Student/${id}/CV/Approve`,
        { isApproved: true },
        token
      )
      .then(() => {
        message.success("CV Approved");
        setCvStatus(2);
      });
  };

  const rejectCv = async () => {
    await api
      .post(
        `Faculties/${facultyId}/Student/${id}/CV/Approve`,
        { isApproved: false },
        token
      )
      .then(() => {
        message.success("CV Rejected");
        setCvStatus(3);
      });
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  return (
    <div>
      {student && (
        <div className="font-default flex flex-col items-center mb-10 pt-16 pb-10">
          <div className=" max-w-5xl">
            <div className=" w-full bg-white shadow flex p-4 rounded-md gap-5">
              <div className="rounded-full h-fit">
                <Avatar
                  size={128}
                  src={
                    student.profilePicFirebaseId &&
                    studentHighProfilePicture(student.profilePicFirebaseId)
                  }
                  icon={!student.profilePicFirebaseId && <UserOutlined />}
                />
              </div>
              <div className=" w-full h-full">
                <div className="flex justify-between">
                  <h3 className=" text-3xl font-bold ">
                    {student.firstName + " " + student.lastName}
                  </h3>
                </div>

                <h5 className=" text-base font-medium mt-1">
                  {student.headline}
                </h5>
                <div className="flex mt-2 gap-2 text-sm">
                  <SlGraduation size={16} />
                  <p className="">{student.degreeName}</p>
                  <span className="font-extrabold">&middot;</span>
                  <p>{student.pathwayName}</p>
                </div>

                {student.location && (
                  <div className="flex gap-2 mt-2 text-light-gray font-medium text-sm">
                    <MdOutlineLocationOn size={20} />
                    <p>{student.location}</p>
                  </div>
                )}

                <div className="mt-4">
                  {cvStatus == 1 && (
                    <div className="flex gap-2 text-light-blue items-center">
                      <div className="flex text-sm gap-2">
                        <LinkOutlined className=" text-dark-gray" />
                        <p
                          href={`http://localhost:62200/api/Faculties/${facultyId}/Student/${id}/CV`}
                          className=" underline hover:cursor-pointer"
                          onClick={downloadCv}
                        >
                          Click to download CV
                        </p>
                      </div>
                      <span>|</span>
                      <div className="flex gap-2">
                        <Button size="small" type="primary" onClick={approveCv}>
                          Approve CV
                        </Button>
                        <Button size="small" danger onClick={rejectCv}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                  {cvStatus == 2 && (
                    <div className="flex gap-2 text-light-blue">
                      <div className="flex text-sm gap-2">
                        <LinkOutlined className=" text-dark-gray" />
                        <p
                          href={`http://localhost:62200/api/Faculties/${facultyId}/Student/${id}/CV`}
                          className=" underline hover:cursor-pointer"
                          onClick={downloadCv}
                        >
                          Click to download CV
                        </p>
                        <DeleteOutlined className=" text-dark-gray hover:cursor-pointer " />
                      </div>
                      <span>|</span>
                      <p className="font-semibold text-sm text-green">
                        CV Approved
                      </p>

                      <FcApproval size={20} />
                    </div>
                  )}

                  {cvStatus == 3 && (
                    <div className="flex gap-2 text-light-blue">
                      <div className="flex text-sm gap-2">
                        <LinkOutlined className=" text-dark-gray" />
                        <p
                          href={`http://localhost:62200/api/Faculties/${facultyId}/Student/${id}/CV`}
                          className=" underline hover:cursor-pointer"
                          onClick={downloadCv}
                        >
                          Click to download CV
                        </p>
                      </div>
                      <span>|</span>
                      <p className="font-semibold text-sm text-red">
                        CV Rejected
                      </p>
                      <CiWarning size={20} className="text-red" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2">
              <Row gutter={10}>
                <Col span={14}>
                  {/* About */}
                  {student.about && (
                    <div className="bg-white shadow rounded-md p-4 font-default max-w-4xl">
                      <h5 className="font-bold text-base">About</h5>
                      <p className=" text-justify">{student.about}</p>
                    </div>
                  )}

                  {/* Experience */}
                  <StudentExperiences studentId={id} />

                  {/* Certifications */}
                  <StudentCertifications studentId={id} />
                </Col>
                <Col span={10}>
                  {/* Skills */}
                  <StudentSkills studentId={id} />

                  {/* Contact */}
                  <ContactsAndSocialMedia studentId={id} />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyStudentProfile;
