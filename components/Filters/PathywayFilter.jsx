"use client";

import api from "@/utils/api";
import { Select } from "antd";
import React, { useEffect, useState } from "react";

const PathywayFilter = ({
  onSelect,
  onClear,
  selectedDegreeProgram,
  selectedPathway,
  placeholder = "Pathway",
}) => {
  const [pathways, setPathways] = useState([]);

  const fetchPathways = async (value) => {
    try {
      const response = await api.get(
        `Degree/${selectedDegreeProgram}/Pathways/Suggestions`,
        { limit: 100 }
      );
      setPathways(response.items);
    } catch (error) {
      console.error("Failed to fetch pathways:", error);
      setPathways([]);
    }
  };

  useEffect(() => {
    if (selectedDegreeProgram == null) {
      setPathways([]);
      onClear();
    } else {
      fetchPathways();
    }
  }, [selectedDegreeProgram]);

  return (
    <Select
      placeholder={placeholder}
      className=" text-black font-default custom-placeholder w-72 custom-select"
      size="large"
      allowClear
      onSelect={(value) => onSelect(value)}
      onClear={() => onClear(null)}
      disabled={!selectedDegreeProgram}
      dropdownRender={(menu) => (
        <div className="scrollable-dropdown">{menu}</div>
      )}
      value={selectedPathway}
    >
      {pathways.map((i) => (
        <Select.Option key={i.id} label={i.name}>
          {i.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default PathywayFilter;
