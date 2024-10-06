"use client";

import api from "@/utils/api";
import { Select } from "antd";
import React, { useEffect, useState } from "react";

const DegreeFilter = ({
  onSelect,
  onClear,
  facultyId,
  selectedDegreeProgram,
  placeholder = "Degree Program",
}) => {
  const [degrees, setDegrees] = useState([]);

  const fetchDegrees = async () => {
    try {
      const response = await api.get(
        `Faculty/${facultyId}/Degrees/Suggestions`,
        { limit: 100 },
        null
      );
      setDegrees(response.items);
    } catch (error) {
      console.error("Failed to fetch degrees:", error);
      setDegrees([]);
    }
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  return (
    <Select
      placeholder={placeholder}
      className="font-default custom-placeholder w-80 custom-select"
      size="large"
      allowClear
      onSelect={(value) => onSelect(value)}
      onClear={() => onClear()}
      dropdownRender={(menu) => (
        <div className="scrollable-dropdown">{menu}</div>
      )}
      value={selectedDegreeProgram}
    >
      {degrees.map((i) => (
        <Select.Option key={i.id} label={i.name}>
          {i.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default DegreeFilter;
