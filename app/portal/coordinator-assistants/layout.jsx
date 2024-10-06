"use client";

import { useIsCoordinator } from "@/utils/Auth/auth-selectors";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CoordinatorAssistantLayout = ({ children }) => {
  const isCoordinator = useIsCoordinator();
  const router = useRouter();

  useEffect(() => {
    if (!isCoordinator) {
      router.push("/portal/students");
    }
  }, [isCoordinator]);

  return <>{children}</>;
};

export default CoordinatorAssistantLayout;
