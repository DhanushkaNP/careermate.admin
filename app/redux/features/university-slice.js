import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  values: {
    universityId: null,
    facultyId: null,
    batchId: null,
  },
};

export const uni = createSlice({
  name: "uni",
  initialState,
  reducers: {
    setUniversityFaculty: (state, action) => {
      const { universityId, facultyId } = action.payload;
      localStorage.removeItem("uniData");
      localStorage.setItem(
        "uniData",
        JSON.stringify({
          ...action.payload,
        })
      );
      return { values: { universityId, facultyId, batchId: null } };
    },

    setBatch: (state, action) => {
      const { batchId } = action.payload;
      localStorage.removeItem("uniData");
      localStorage.setItem(
        "uniData",
        JSON.stringify({
          ...state.values,
          batchId,
        })
      );
      return {
        values: {
          ...state.values,
          batchId,
        },
      };
    },

    removeUniversity: () => {
      localStorage.removeItem("uniData");
      return initialState;
    },
  },
});

export const { setUniversityFaculty, setBatch, removeUniversity } = uni.actions;
export default uni.reducer;
