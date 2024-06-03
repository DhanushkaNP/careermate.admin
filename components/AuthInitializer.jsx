"use client";

import React, { useEffect } from "react";
import { getStoredAuthData } from "@/utils/Auth/auth-util";
import { useLogIn, useLogout } from "@/utils/Auth/auth-actions";
import { getStoredUniData } from "@/utils/University/uni-util";
import {
  useSetBatch,
  useSetUniversityFaculty,
} from "@/utils/University/uni-actions";

const AuthInitializer = ({ children }) => {
  const logIn = useLogIn();
  const logOut = useLogout();
  const setUniFaculty = useSetUniversityFaculty();
  const setBatch = useSetBatch();

  useEffect(() => {
    const storedAuthData = getStoredAuthData();
    const storedUniData = getStoredUniData();

    if (storedAuthData) {
      const { expirationTime, token, userId, isCoordinator, isAssitant } =
        storedAuthData;

      const expirationTimeInString = `${expirationTime}`;

      const formattedExpirationTime = Number(
        expirationTimeInString.replace(/,/g, "")
      );

      if (Date.now() > formattedExpirationTime * 1000) {
        logOut();
      } else {
        logIn(token, userId, expirationTime, isCoordinator, isAssitant);
      }

      if (storedUniData) {
        const { batchId, facultyId, universityId } = storedUniData;
        setUniFaculty(universityId, facultyId);
        setBatch(batchId);
      }
    }
  });

  return <>{children}</>;
};

export default AuthInitializer;
