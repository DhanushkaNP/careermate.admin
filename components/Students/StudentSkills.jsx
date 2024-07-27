import { useUserToken } from "@/utils/Auth/auth-selectors";
import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import StudentSkillItem from "./StudentSkillItem";

const StudentSkills = ({ studentId }) => {
  const token = useUserToken();

  const [skillSetOne, setSkillSetOne] = useState([]);
  const [skillSetTwo, setSkillSetTwo] = useState([]);

  const fetchSkills = async () => {
    await api
      .get(`Students/${studentId}/Skill`, null, token)
      .then((response) => {
        const skills = response.items;
        const half = Math.ceil(skills.length / 2);
        setSkillSetOne(skills.slice(0, half));
        setSkillSetTwo(skills.slice(half, skills.length));
      });
  };

  useEffect(() => {
    fetchSkills();
  }, [studentId]);

  return (
    (skillSetOne.length > 0 || skillSetTwo.length > 0) && (
      <>
        <div className="bg-white shadow rounded-md p-4 font-default">
          <div className="flex justify-between">
            <h5 className="font-bold text-base">Skills</h5>{" "}
          </div>

          <div className="justify-between mt-2">
            <Row gutter={4}>
              <Col span={12}>
                <ul className="font-default font-semibold list-disc ps-4 w-full pe-3">
                  {skillSetOne.map((skill) => (
                    <StudentSkillItem id={skill.id} name={skill.name} />
                  ))}
                </ul>
              </Col>
              <Col span={12}>
                <ul className="font-default font-semibold list-disc ps-4 w-full pe-3">
                  {skillSetTwo.map((skill) => (
                    <StudentSkillItem id={skill.id} name={skill.name} />
                  ))}
                </ul>
              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  );
};

export default StudentSkills;
