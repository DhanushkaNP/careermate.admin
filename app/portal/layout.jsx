"use client";

import React, { useEffect, useState } from "react";
import { RiAdminFill } from "react-icons/ri";
import { PiStudentFill, PiBuildingsFill } from "react-icons/pi";
import { MdOutlineWorkOutline } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import { Button, Divider, Layout, Menu, theme } from "antd";
import Link from "next/link";
import { useIsAuth, useIsCoordinator } from "@/utils/Auth/auth-selectors";
import { useRouter } from "next/navigation";
import { useLogout } from "@/utils/Auth/auth-actions";

const { Sider } = Layout;

const NavMenuLayout = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useIsAuth();
  const logOut = useLogout();

  const isCoordinator = useIsCoordinator();

  const [selectedKeys, setSelectedKeys] = useState(["1.1"]);
  const handleMenuClick = (e) => {
    setSelectedKeys([e.key]);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signIn");
    }
  }, [logOut, isAuthenticated]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div className=" bg-dark-bg h-screen font-default">
      <div>
        <Layout hasSider className="bg-dark-bg ">
          <Sider
            theme="light"
            className="shadow-md w-1/2 h-screen"
            width={240}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <div className="align-middle text-center font-bold text-xl mt-4">
              <Link
                className="font-inika text-dark-blue hover:text-dark-blue"
                href={"/sysadmin/portal/users"}
              >
                CareerMate Admin
              </Link>
            </div>
            <Divider className=" mt-0 mb-2" />
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={selectedKeys}
              defaultSelectedKeys={"1.1"}
              onClick={handleMenuClick}
              items={[
                isCoordinator && {
                  key: 1,
                  icon: (
                    <RiAdminFill
                      size={20}
                      className={`font-default text-sm ${
                        selectedKeys.some((key) => key.startsWith("1."))
                          ? "fill-light-blue"
                          : "fill-dark-gray"
                      }`}
                    />
                  ),
                  label: (
                    <span className={`font-default text-sm }`}>
                      Admin users
                    </span>
                  ),
                  style: { color: "#2B3674" },
                  children: [
                    {
                      key: "1.1",
                      label: (
                        <Link
                          href={"/portal/coordinators"}
                          className="font-default text-sm fill-dark-dark-blue"
                        >
                          Coordinators
                        </Link>
                      ),
                    },
                    {
                      key: "1.2",
                      label: (
                        <Link
                          href={"/portal/coordinator-assistants"}
                          className="font-default text-sm fill-dark-dark-blue"
                        >
                          Coordinator Assistants
                        </Link>
                      ),
                    },
                  ],
                },
                {
                  key: 2,
                  icon: (
                    <PiStudentFill
                      size={24}
                      className={`font-default text-sm ${
                        selectedKeys.some((key) => key.startsWith("2"))
                          ? "fill-light-blue"
                          : "fill-dark-gray"
                      }`}
                    />
                  ),
                  label: (
                    <Link href={"/portal/students"} className="font-default">
                      Students
                    </Link>
                  ),
                  style: { color: "#2B3674" },
                },
                {
                  key: 3,
                  icon: (
                    <PiBuildingsFill
                      size={24}
                      className={`font-default text-sm ${
                        selectedKeys.some((key) => key.startsWith("3"))
                          ? "fill-light-blue"
                          : "fill-dark-gray"
                      }`}
                    />
                  ),
                  label: (
                    <Link
                      href={"/portal/companies"}
                      className="font-default fill-dark-blue"
                    >
                      Companies
                    </Link>
                  ),
                  style: { color: "#2B3674" },
                },
                {
                  key: 4,
                  icon: (
                    <MdOutlineWorkOutline
                      size={24}
                      className={`font-default text-sm ${
                        selectedKeys.some((key) => key.startsWith("4"))
                          ? "fill-light-blue"
                          : "fill-dark-gray"
                      }`}
                    />
                  ),
                  label: (
                    <Link
                      href={"/portal/internships"}
                      className="font-default fill-dark-blue"
                    >
                      Internships
                    </Link>
                  ),
                  style: { color: "#2B3674" },
                },
                {
                  key: 5,
                  icon: (
                    <FaBook
                      size={24}
                      className={`font-default text-sm ${
                        selectedKeys.some((key) => key.startsWith("5"))
                          ? "fill-light-blue"
                          : "fill-dark-gray"
                      }`}
                    />
                  ),
                  label: (
                    <Link
                      href={"/portal/diaries"}
                      className="font-default fill-dark-blue"
                    >
                      Diaries
                    </Link>
                  ),
                  style: { color: "#2B3674" },
                },
                isCoordinator && {
                  key: 6,
                  icon: (
                    <IoSettingsOutline
                      size={24}
                      className={`font-default text-sm ${
                        selectedKeys.some((key) => key.startsWith("5"))
                          ? "fill-light-blue"
                          : "fill-dark-gray"
                      }`}
                    />
                  ),
                  label: (
                    <Link
                      href={"/portal/settings"}
                      className="font-default fill-dark-blue"
                    >
                      Settings
                    </Link>
                  ),
                  style: { color: "#2B3674" },
                },
              ].filter(Boolean)} // filter to remove `false` items
            />

            <div className="text-center mb-4 absolute bottom-0 mx-auto w-full">
              <Button
                type="primary"
                ghost
                className=" px-20 font-medium"
                onClick={() => logOut()}
              >
                Sign out
              </Button>
            </div>
          </Sider>
          <Layout className="bg-dark-bg ms-64 me-4 pt-10">{children}</Layout>
        </Layout>
      </div>
    </div>
  );
};

export default NavMenuLayout;
