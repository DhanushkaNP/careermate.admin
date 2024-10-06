"use client";

import api from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import {
  EnvironmentFilled,
  FireFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Input, Rate, Row } from "antd";
import React, { useEffect, useState } from "react";
import { BsBuildings } from "react-icons/bs";
import Status from "@/components/Status/Status";
import ProfileSkills from "@/components/Profiles/ProfileSkills";
import ContactsAndSocialMedia from "@/components/Profiles/ContactsAndSocialMedia";
import { useParams } from "next/navigation";
import Link from "next/link";
import { companyHighProfilePicture } from "@/utils/Firebase/FirebaseImageUrls";
import { useFacultyId } from "@/utils/University/uni-selectors";
import { CompanySize } from "@/shared/companySize";
import Form from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";

const formatDateToYearMonthStyle = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

const formatBioText = (text) => {
  return text.split("\n\n").map((paragraph, index) => (
    <p key={index} className="mb-4">
      {paragraph}
    </p>
  ));
};

const CompanyProfile = () => {
  const { id } = useParams();
  const facultyId = useFacultyId();
  const token = useUserToken();

  const [company, setCompany] = useState({});

  const [companyStatus, setCompanyStatus] = useState(1);

  const fetchCompany = async () => {
    await api
      .get(`Faculties/${facultyId}/Company/${id}`, null, token)
      .then((res) => {
        setCompany(res.item);
        setCompanyStatus(res.item.status);
      });
  };

  const approveCompany = async () => {
    await api
      .put(`Faculties/${facultyId}/Company/${id}/Approve`, null, token)
      .then(() => {
        setCompanyStatus(2);
      });
  };

  const blockCompany = async (isBlocked) => {
    await api
      .put(`Faculties/${facultyId}/Company/${id}/Block`, { isBlocked }, token)
      .then(() => {
        isBlocked ? setCompanyStatus(3) : setCompanyStatus(2);
      });
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  return (
    <>
      <div className="font-default flex flex-col mb-10 items-center ">
        <div className="max-w-5xl">
          <div className="w-full bg-white shadow p-4 rounded-md gap-6 flex items-center">
            <div className="rounded-full h-fit border">
              <Avatar
                size={140}
                icon={!company.firebaseLogoId && <UserOutlined />}
                src={
                  company.firebaseLogoId &&
                  companyHighProfilePicture(company.firebaseLogoId)
                }
              />
            </div>
            <div className=" w-full h-full pt-3">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <h3 className=" text-3xl font-bold ">{company.name}</h3>
                  <p className=" text-light-blue font-bold underline text-sm hover:cursor-pointer content-center">
                    {company.availableInternshipsCount} Jobs available
                  </p>
                </div>
              </div>
              {company.webUrl && (
                <Link
                  className=" text-light-blue font-bold underline hover:cursor-pointer content-center mt-1 text-lg"
                  href={company.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.webUrl}
                </Link>
              )}

              <p className=" items-end text-sm text-light-blue font-semibold ps-2">
                {company.followersCount} Followers
              </p>
              <div className="flex mt-2 gap-2 text-sm font-bold">
                <p className=" text-ice-blue content-center ps-2">
                  {company.companyRatings ? company.companyRatings : "0.0"}
                </p>
                <p>
                  <Rate
                    value={Math.round(company.companyRatings * 2) / 2}
                    className="text-ice-blue text-base"
                    allowHalf
                    disabled
                  />
                </p>
                {company.companyRatings == null && (
                  <p className=" text-sm text-light-gray font-extralight">
                    No ratings so far
                  </p>
                )}
              </div>
              <div className="flex justify-between">
                <div className="flex gap-6 mt-4 items-end">
                  {company.foundedOn && (
                    <div className="flex gap-2">
                      <div className="border rounded-full w-8 h-8 flex justify-center">
                        <FireFilled className="text-lg text-ice-blue" />
                      </div>
                      <div className="text-xs">
                        <p>Founded</p>
                        <p className=" font-bold">
                          {formatDateToYearMonthStyle(company.foundedOn)}
                        </p>
                      </div>
                    </div>
                  )}

                  {company.companySize && (
                    <div className="flex gap-2">
                      <div className="border rounded-full w-8 h-8 flex justify-center">
                        <TeamOutlined className="text-lg text-ice-blue" />
                      </div>
                      <div className="text-xs">
                        <p>Company size</p>
                        <p className=" font-bold">
                          {CompanySize[company.companySize]}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="border rounded-full w-8 h-8 flex justify-center">
                      <EnvironmentFilled className="text-lg text-ice-blue" />
                    </div>
                    <div className="text-xs">
                      <p>Location</p>
                      <p className=" font-bold">{company.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="border rounded-full w-8 h-8 flex justify-center items-center">
                      <BsBuildings className="text-lg text-ice-blue" />
                    </div>
                    <div className="text-xs">
                      <p>Industry</p>
                      <p className=" font-bold">{company.industryName}</p>
                    </div>
                  </div>
                </div>
                <div className="h-min self-end">
                  {companyStatus == 1 && (
                    <Status name={"Pending"} color={"blue"} />
                  )}
                  {companyStatus == 2 && (
                    <Status name={"Approved"} color={"green"} />
                  )}
                  {companyStatus == 3 && (
                    <Status name={"Blocked"} color={"black"} />
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                {companyStatus == 1 && (
                  <Button
                    type="primary"
                    size="small"
                    className="bg-black px-4"
                    onClick={approveCompany}
                  >
                    Approve
                  </Button>
                )}
                {companyStatus != 3 && (
                  <Button
                    size="small"
                    className="bg-black text-white px-4 border-none hover:bg-gray-600 focus:bg-gray-800 active:bg-gray-900 transition-colors duration-100"
                    style={{
                      color: "white",
                      backgroundColor: "black",
                      borderColor: "black",
                    }}
                    onClick={() => blockCompany(true)}
                  >
                    Block
                  </Button>
                )}
                {companyStatus == 3 && (
                  <Button
                    type="primary"
                    size="small"
                    className="bg-black px-4"
                    onClick={() => blockCompany(false)}
                  >
                    Unblock
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <Row gutter={10}>
              <Col span={14}>
                <div className="bg-white shadow rounded-md p-4 font-default max-w-4xl">
                  <h5 className="font-bold text-base">Company Bio</h5>
                  <p className=" text-justify">
                    {company.bio && formatBioText(company.bio)}
                  </p>
                </div>

                {/* Other details */}
                <div className="bg-white shadow rounded-md p-4 font-default mt-2 flex flex-col gap-4">
                  <h5 className="font-bold text-base">Other Details</h5>
                  <Form
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    layout="vertical"
                    className="custom-form"
                  >
                    <Row gutter={32}>
                      <Col span={12}>
                        <FormItem
                          label={
                            <span className="font-default text-dark-dark-blue font-semibold">
                              Phone number
                            </span>
                          }
                        >
                          <Input value={company.phoneNumber} />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          label={
                            <span className="font-default text-dark-dark-blue font-semibold">
                              Email
                            </span>
                          }
                        >
                          <Input value={company.email} />
                        </FormItem>
                      </Col>
                    </Row>

                    <FormItem
                      label={
                        <span className="font-default text-dark-dark-blue font-semibold">
                          Address
                        </span>
                      }
                    >
                      <TextArea value={company.address} />
                    </FormItem>

                    <FormItem
                      label={
                        <span className="font-default text-dark-dark-blue font-semibold">
                          Location
                        </span>
                      }
                    >
                      <Input value={company.location} />
                    </FormItem>
                  </Form>
                </div>
              </Col>

              <Col span={10}>
                {/* Skills company looking for */}
                <ProfileSkills
                  companyId={id}
                  title="Skills we are looking for"
                />

                {/* Contact */}
                <ContactsAndSocialMedia companyId={id} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;
