"use client";

import { workPlaceTypes } from "@/shared/workPlaceTypes";
import PostStats from "./PostStats";
import api from "@/utils/api";
import { Avatar, Button, message } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import { useFacultyId } from "@/utils/University/uni-selectors";
import { useUserToken } from "@/utils/Auth/auth-selectors";

const InternshipPost = () => {
  const router = useRouter();

  const [postDetails, setPostsDetails] = useState(null);
  const [isPostApproved, setIsPostApproved] = useState(false);

  const facultyId = useFacultyId();
  const token = useUserToken();
  const { id } = useParams();

  const fetchData = async () => {
    await api
      .get(`Faculties/${facultyId}/InternshipPost/${id}`, null, token)
      .then((response) => {
        console.log(response.item);
        setPostsDetails(response.item);
        setIsPostApproved(response.item.isApproved);
      });
  };

  const deletePost = async () => {
    try {
      await api.delete(`Faculties/${facultyId}/InternshipPost/${id}`, token);
      message.success("Post deleted");
      router.back();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const approvePost = async () => {
    try {
      await api
        .put(`Faculties/${facultyId}/InternshipPost/${id}/Approve`, null, token)
        .then(() => {
          setIsPostApproved(true);
          message.success("Post approved");
        });
    } catch (error) {
      message.error("Approve failed");
    }
  };

  useEffect(() => {
    if (!facultyId) return;
    fetchData();
  }, [id]);

  return (
    postDetails && (
      <div className="mx-64 bg-white pt-12 shadow-sm border mb-24 pb-20 font-default">
        <div className="mx-10 ">
          <div className=" flex justify-between">
            <div className="border rounded-full">
              <Avatar
                size={80}
                src={
                  "https://calcey.com/wp-content/uploads/2022/10/Calcey-Profile-Picture-V2.png"
                }
                className=" z-0"
              />
            </div>
            <div>
              <PostStats name={"Jobs"} stat={4} />
              <PostStats name={"Applicants"} stat={2} className="mt-2" />
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div>
              <h3 className=" text-3xl font-bold">{postDetails.companyName}</h3>
              <h2 className="text-2xl">{postDetails.title}</h2>
            </div>
          </div>

          <div className=" flex justify-between mt-2">
            <h6 className="text-lg">Location: {postDetails.location}</h6>
            <h6 className="text-lg">
              Type: {workPlaceTypes[postDetails.type]}
            </h6>
          </div>

          {postDetails.flyer && (
            <div className="flex justify-center w-full">
              <img className="mt-2" src={postDetails.flyer} />
            </div>
          )}

          <div className=" mb-8">
            <p className="mt-4 text-justify internship-description text-base">
              {parse(postDetails.description)}
            </p>
          </div>

          <div className=" flex justify-end gap-2 mt-8 pt-6">
            {!isPostApproved && (
              <Button type="primary" onClick={approvePost}>
                Approve
              </Button>
            )}

            {isPostApproved && (
              <Button type="primary" disabled>
                Approved
              </Button>
            )}

            <Button danger className="px-10 font-semibold" onClick={deletePost}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default InternshipPost;
