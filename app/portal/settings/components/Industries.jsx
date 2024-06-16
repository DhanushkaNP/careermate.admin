"use client";

import DeleteModal from "@/components/DeleteModal";
import CreateFormModal from "@/components/Form/CreateFormModal";
import UpdateFormModal from "@/components/Form/UpdateFormModal";
import RowDataContainer from "@/components/RowData/RowDataContainer";
import RowDataHeader from "@/components/RowData/RowDataHeader";
import RowDataItem from "@/components/RowData/RowDataItem";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/University/uni-selectors";
import api from "@/utils/api";
import { Form, Input } from "antd";
import React, { useState, useEffect } from "react";

const Industries = () => {
  const facultyId = useFacultyId();
  const token = useUserToken();

  const [industries, setIndustries] = useState([]);

  const [isCreatIndustriesModalOpen, setIsCreatIndustriesModalOpen] =
    useState(false);
  const [industryDeleteModalDetails, setIndustryDeleteModalDetails] = useState({
    isOpen: false,
    id: null,
    name: null,
  });

  const [industryEditModalDetails, setIndustryEditModalDetails] = useState({
    isOpen: false,
    industryId: null,
    name: null,
  });

  const fetchIndustries = async () => {
    try {
      await api
        .get(`Faculty/${facultyId}/Industries`, null, token)
        .then((response) => {
          if (response.items == null) {
            console.log("No indsutries");
          }
          console.log(response);
          setIndustries(response.items);
        });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const onCreateIndustry = async (values) => {
    console.log("post");
    await api.post(
      `Faculty/${facultyId}/Industries`,
      { name: values.name },
      token
    );
    fetchIndustries();
    setIsCreatIndustriesModalOpen(false);
  };

  const deleteIndustry = async (id) => {
    await api.delete(`Faculty/${facultyId}/Industries/${id}`, token);
    setIndustryDeleteModalDetails({ isOpen: false, id: null, name: null });
    fetchIndustries();
  };

  const industriesEditClickHandler = async (id) => {
    try {
      await api
        .get(`Faculty/${facultyId}/Industries/${id}`, null, token)
        .then((response) => {
          console.log(response);
          setIndustryEditModalDetails({
            isOpen: true,
            industryId: response.industry.id,
            name: response.industry.name,
          });
        });
    } catch (error) {
      throw error;
    }
  };

  const UpdateDegree = async (values) => {
    await api.put(
      `Faculty/${facultyId}/Industries/${industryEditModalDetails.industryId}`,
      {
        name: values["name"],
      },
      token
    );
    fetchIndustries();
    setIndustryEditModalDetails({
      isOpen: false,
      industryId: null,
      name: null,
    });
  };

  return (
    <>
      {/* Industry Create */}
      <CreateFormModal
        open={isCreatIndustriesModalOpen}
        onCancel={() => setIsCreatIndustriesModalOpen(false)}
        title={"Add Industry"}
        onCreate={onCreateIndustry}
      >
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Name
            </span>
          }
          name={"name"}
          rules={[{ required: true, message: "Please input degree name!" }]}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>
      </CreateFormModal>

      {/* Industry delete */}
      <DeleteModal
        open={industryDeleteModalDetails.isOpen}
        onCancel={() =>
          setIndustryDeleteModalDetails({
            isOpen: false,
            id: null,
            name: null,
          })
        }
        message={`Do you want to delete industry ${industryDeleteModalDetails.name}?`}
        onDelete={() => deleteIndustry(industryDeleteModalDetails.id)}
      />

      {/* Update industry Modal */}
      <UpdateFormModal
        open={industryEditModalDetails.isOpen}
        title={"Edit Industry"}
        onCancel={() =>
          setIndustryEditModalDetails({
            isOpen: false,
            industryId: null,
            name: null,
          })
        }
        initialValues={{
          name: industryEditModalDetails.name,
        }}
        onUpdate={UpdateDegree}
      >
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Name
            </span>
          }
          name={"name"}
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>
      </UpdateFormModal>

      <div className="w-full font-default min-h-96 max-h-fit">
        <RowDataContainer className="">
          <RowDataHeader
            title={"Industries"}
            subTitle={"Add indsutries that you want to offer with the system"}
            onButtonClick={() => {
              setIsCreatIndustriesModalOpen(true);
            }}
          />
          {industries.map((f) => (
            <RowDataItem
              title={f.name}
              key={f.key}
              id={f.id}
              onDeleteClickHandler={(id, name) => {
                setIndustryDeleteModalDetails({
                  isOpen: true,
                  id: id,
                  name: name,
                });
              }}
              onEditClickHandler={industriesEditClickHandler}
            />
          ))}
        </RowDataContainer>
      </div>
    </>
  );
};

export default Industries;
