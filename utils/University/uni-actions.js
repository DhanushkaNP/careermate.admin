"use client";

import { useDispatch } from "react-redux";
import {
  removeUniversity,
  setBatch,
  setUniversityFaculty,
} from "@/app/redux/features/university-slice";

export const useSetUniversityFaculty = () => {
  const dispatch = useDispatch();
  return (universityId, facultyId) => {
    dispatch(setUniversityFaculty({ universityId, facultyId, batchId: null }));
  };
};

export const useSetBatch = () => {
  const dispatch = useDispatch();
  return (batchId) => {
    dispatch(setBatch({ batchId }));
  };
};

export const useRemoveUniversity = () => {
  const dispatch = useDispatch();
  return () => dispatch(removeUniversity());
};
