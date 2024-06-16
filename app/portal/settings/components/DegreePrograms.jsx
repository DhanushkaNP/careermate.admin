"use client";

import DeleteModal from "@/components/DeleteModal";
import CreateFormModal from "@/components/Form/CreateFormModal";
import UpdateFormModal from "@/components/Form/UpdateFormModal";
import RowDataContainer from "@/components/RowData/RowDataContainer";
import RowDataHeader from "@/components/RowData/RowDataHeader";
import RowDataItem from "@/components/RowData/RowDataItem";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { useBatchId, useFacultyId } from "@/utils/University/uni-selectors";
import api from "@/utils/api";
import { Form, Input } from "antd";
import React, { useEffect, useState } from "react";

const DegreePrograms = () => {
  const token = useUserToken();
  const facultyId = useFacultyId();

  const [degrees, setDegrees] = useState([]);
  const [pathways, setPathways] = useState([]);

  const [isCreateDegreeModalOpen, SetIsCreateDegreeModalOpen] = useState(false);
  const [degreeDeleteModalDetails, setDegreeDeleteModalDetails] = useState({
    isOpen: false,
    id: null,
    name: null,
  });
  const [degreeEditModalDetails, setDegreeEditModalDetails] = useState({
    isOpen: false,
    degreeId: null,
    name: null,
    acronym: null,
  });

  const [isCreatePathwayModalOpen, setIsCreatePathwayModalOpen] =
    useState(false);
  const [pathwayDeleteModalDetails, setPathwayDeleteModalDetails] = useState({
    isOpen: false,
    id: null,
    name: null,
  });
  const [pathwayEditModalDetails, setPathwayEditModalDetails] = useState({
    isOpen: false,
    pathwayId: null,
    name: null,
    code: null,
  });

  const [selectedDegree, setSelectedDegree] = useState(null);

  const fetchDegrees = async () => {
    try {
      await api
        .get(`Faculty/${facultyId}/Degrees`, null, token)
        .then((response) => {
          if (response.items == null) {
            console.log("No Degrees");
          }
          console.log(response);
          setDegrees(response.items);
        });
    } catch (error) {
      throw error;
    }
  };

  const fetchPathways = async () => {
    try {
      await api
        .get(`Degree/${selectedDegree}/Pathways`, null, token)
        .then((response) => {
          if (response.items.length > 0) {
            setPathways(response.items);
          }
        });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  useEffect(() => {
    fetchPathways();
  }, [selectedDegree]);

  const onCreateDegree = async (values) => {
    await api.post(
      `Faculty/${facultyId}/Degrees`,
      { name: values.name, acronym: values["acronym"] },
      token
    );
    fetchDegrees();
    SetIsCreateDegreeModalOpen(false);
  };

  const deleteDegree = async (id) => {
    await api.delete(`Faculty/${facultyId}/Degrees/${id}`, token);
    setDegreeDeleteModalDetails({ isOpen: false, id: null, name: null });
    fetchDegrees();
  };

  const UpdateDegree = async (values) => {
    await api.put(
      `Faculty/${facultyId}/Degrees/${degreeEditModalDetails.degreeId}`,
      {
        name: values["name"],
        acronym: values["acronym"],
      },
      token
    );
    fetchDegrees();
    setDegreeEditModalDetails({
      isOpen: false,
      degreeId: null,
      name: null,
      acronym: null,
    });
  };

  const degreeOnEditClickHandler = async (id) => {
    try {
      await api
        .get(`Faculty/${facultyId}/Degrees/${id}`, null, token)
        .then((response) => {
          console.log(response);
          setDegreeEditModalDetails({
            isOpen: true,
            degreeId: response.degree.id,
            name: response.degree.name,
            acronym: response.degree.acronym,
          });
        });
    } catch (error) {
      throw error;
    }
  };

  const onDegreeRowClickHandler = async (id) => {
    setPathways([]);
    setSelectedDegree(id);
    try {
    } catch (error) {}
  };

  const onCreatePathway = async (values) => {
    await api.post(
      `Degree/${selectedDegree}/Pathways`,
      {
        name: values.name,
        code: values.code,
      },
      token
    );
    fetchPathways();
    setIsCreatePathwayModalOpen(false);
  };

  const deletePathway = async (id) => {
    await api.delete(`Degree/${selectedDegree}/Pathways/${id}`, token);
    fetchPathways();
    setPathwayDeleteModalDetails({ isOpen: false, id: null, name: null });
  };

  const UpdatePathway = async (values) => {
    await api.put(
      `Degree/${selectedDegree}/Pathways/${pathwayEditModalDetails.pathwayId}`,
      {
        name: values["name"],
        code: values.code,
      },
      token
    );
    fetchPathways();
    setPathwayEditModalDetails({
      isOpen: false,
      degreeId: null,
      name: null,
      code: null,
    });
  };

  const pathwayEditClickHandler = async (id) => {
    try {
      await api
        .get(`Degree/${selectedDegree}/Pathways/${id}`, null, token)
        .then((response) => {
          setPathwayEditModalDetails({
            isOpen: true,
            pathwayId: response.pathway.id,
            name: response.pathway.name,
            code: response.pathway.code,
          });
        });
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      {/* Degree Create */}
      <CreateFormModal
        open={isCreateDegreeModalOpen}
        onCancel={() => SetIsCreateDegreeModalOpen(false)}
        title={"Add Degree"}
        onCreate={onCreateDegree}
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
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Acronym
            </span>
          }
          name={"acronym"}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>
      </CreateFormModal>

      {/* Degree delete */}
      <DeleteModal
        open={degreeDeleteModalDetails.isOpen}
        onCancel={() =>
          setDegreeDeleteModalDetails({
            isOpen: false,
            id: null,
            name: null,
          })
        }
        message={`Do you want to delete degree ${degreeDeleteModalDetails.name}?`}
        onDelete={() => deleteDegree(degreeDeleteModalDetails.id)}
      />
      {/* Update degree Modal */}
      <UpdateFormModal
        open={degreeEditModalDetails.isOpen}
        title={"Edit degree"}
        onCancel={() =>
          setDegreeEditModalDetails({
            isOpen: false,
            degreeId: null,
            name: null,
            acronym: null,
          })
        }
        initialValues={{
          name: degreeEditModalDetails.name,
          acronym: degreeEditModalDetails.acronym,
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

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Acronym
            </span>
          }
          name={"acronym"}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>
      </UpdateFormModal>

      {/* Create pathway Modal */}
      <CreateFormModal
        open={isCreatePathwayModalOpen}
        onCancel={() => setIsCreatePathwayModalOpen(false)}
        title={"Create a Pathway"}
        onCreate={onCreatePathway}
      >
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Name
            </span>
          }
          name={"name"}
          rules={[
            { required: true, message: "Please provide name for faculty!" },
          ]}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Code
            </span>
          }
          name={"code"}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>
      </CreateFormModal>

      {/* Delete Pathway Modal */}
      <DeleteModal
        open={pathwayDeleteModalDetails.isOpen}
        onCancel={() => {
          setPathwayDeleteModalDetails({
            isOpen: false,
            id: null,
            name: null,
          });
        }}
        message={`Do you want delete ${pathwayDeleteModalDetails.name}?`}
        onDelete={() => deletePathway(pathwayDeleteModalDetails.id)}
      />

      {/* update Pathway Modal */}
      <UpdateFormModal
        open={pathwayEditModalDetails.isOpen}
        message={"Update Pathway"}
        onCancel={() =>
          setPathwayEditModalDetails({
            isOpen: false,
            pathwayId: null,
            name: null,
            code: null,
          })
        }
        initialValues={{
          name: pathwayEditModalDetails.name,
          code: pathwayEditModalDetails.code,
        }}
        onUpdate={UpdatePathway}
      >
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Name
            </span>
          }
          name={"name"}
          rules={[
            { required: true, message: "Please provide name for faculty!" },
          ]}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Code
            </span>
          }
          name={"code"}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>
      </UpdateFormModal>

      <div className="w-full font-default min-h-96 max-h-fit">
        {/* Degrees in rows */}
        <RowDataContainer>
          <RowDataHeader
            title={"Degree Programs"}
            subTitle={"Manage degrees"}
            onButtonClick={() => SetIsCreateDegreeModalOpen(true)}
          />
          {degrees.map((d) => (
            <RowDataItem
              title={d.name}
              subtitle={d.acronym}
              key={d.id}
              id={d.id}
              onDeleteClickHandler={(id, name) => {
                setDegreeDeleteModalDetails({
                  isOpen: true,
                  id: id,
                  name: name,
                });
              }}
              onEditClickHandler={degreeOnEditClickHandler}
              onRowClick={onDegreeRowClickHandler}
              selectedRowItemId={selectedDegree}
            />
          ))}
        </RowDataContainer>

        {/* Pathways in rows */}
        {selectedDegree && (
          <RowDataContainer className=" pt-10">
            <RowDataHeader
              title={"Pathways"}
              subTitle={"Pathways of degree program"}
              onButtonClick={() => {
                setIsCreatePathwayModalOpen(true);
              }}
            />
            {pathways.map((f) => (
              <RowDataItem
                title={f.name}
                key={f.key}
                id={f.id}
                onDeleteClickHandler={(id, name) => {
                  setPathwayDeleteModalDetails({
                    isOpen: true,
                    id: id,
                    name: name,
                  });
                }}
                onEditClickHandler={pathwayEditClickHandler}
              />
            ))}
          </RowDataContainer>
        )}
      </div>
    </>
  );
};

export default DegreePrograms;
