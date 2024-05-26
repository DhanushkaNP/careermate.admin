"use client";

const { useAppSelector } = require("@/app/redux/store");

export const useUniversityId = () =>
  useAppSelector((state) => state.uniReducer.values.universityId);
export const useFacultyId = () =>
  useAppSelector((state) => state.uniReducer.values.facultyId);
export const useBatchId = () =>
  useAppSelector((state) => state.uniReducer.values.batchId);
