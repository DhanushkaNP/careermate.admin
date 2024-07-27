import {
  FacebookFilled,
  GithubFilled,
  GlobalOutlined,
  LinkedinFilled,
  MailFilled,
  MediumSquareFilled,
  PhoneFilled,
} from "@ant-design/icons";
import React from "react";

const ContactAndSocialMediaItem = ({ value, type, id }) => {
  let icon;

  switch (type) {
    case 0:
      icon = <MailFilled />;
      break;
    case 1:
      icon = <PhoneFilled />;
      break;
    case 2:
      icon = <LinkedinFilled />;
      break;
    case 3:
      icon = <FacebookFilled />;
      break;
    case 4:
      icon = <GithubFilled />;
      break;
    case 5:
      icon = <MediumSquareFilled />;
      break;
    case 6:
      icon = <GlobalOutlined />;

    default:
      icon = <GlobalOutlined />;
      break;
  }

  <MailFilled />;

  return (
    <div className="flex justify-between">
      <div className="px-2 border-2 border-light-blue flex gap-4 text-light-blue font-semibold w-fit rounded-lg">
        {icon}
        <p>{value}</p>
      </div>
    </div>
  );
};

export default ContactAndSocialMediaItem;
