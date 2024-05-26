import { usePathname, useRouter } from "next/navigation";
import React from "react";

const AdminUsers = () => {
  const router = useRouter();
  const pathName = usePathname();

  return <div>AdminUsers</div>;
};

export default AdminUsers;
