"use client";

import React, { useEffect, useState } from "react";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import api from "@/utils/api";
import ContactAndSocialMediaItem from "./ContactAndSocialMediaItem";

const ContactsAndSocialMedia = ({ studentId, companyId }) => {
  const token = useUserToken();

  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    if (studentId) {
      await api
        .get(`Students/${studentId}/Contact`, null, token)
        .then((response) => {
          setContacts(response.items);
        });
    } else if (companyId) {
      await api
        .get(`Companies/${companyId}/Contact`, null, token)
        .then((response) => {
          setContacts(response.items);
        });
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [studentId]);

  return (
    contacts.length > 0 && (
      <>
        <div className="bg-white shadow rounded-md p-4 font-default mt-2 ">
          <div className=" flex justify-between">
            <h5 className="font-bold text-base mb-2">
              Contacts & Social media
            </h5>{" "}
          </div>
          <div className="flex flex-col gap-4 mt-2">
            {contacts.map((item) => (
              <ContactAndSocialMediaItem
                key={item.id}
                id={item.id}
                type={item.type}
                value={item.data}
              />
            ))}
          </div>
        </div>
      </>
    )
  );
};

export default ContactsAndSocialMedia;
