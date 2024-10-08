import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CallIcon from "@mui/icons-material/Call";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";

const SidebarItem = ({ name, Icon, classes, active, path = "/" }) => {
  // console.log(name, active);

  return (
    <Link
      href={path}
      className={`${classes} text-lg flex items-center w-full my-2 h-12  pl-5 rounded-l-full cursor-pointer ${
        active && active === name && "bg-acc"
      }`}
    >
      <Icon className="mr-3" />
      <div className="w-[80%]">{name}</div>
    </Link>
  );
};
const Sidebar = ({ classes, activeTab, username }) => {
  // const router = useRouter();
  const router = useRouter();
  const logOut = () => {
    localStorage.clear();
    // console.log(localStorage);
    router.push("/login");
  };
  return (
    <div className={`${classes} bg-altDark fixed left-0 h-screen text-light`}>
      <Link
        href="/"
        className="h-24 flex items-center justify-center text-5xl tracking-widest w-full border-b-2 border-solid border-light"
      >
        LOGO
      </Link>

      <div className="pl-6 my-6 ">
        <SidebarItem
          path="/question"
          name="Home"
          Icon={HomeIcon}
          active={activeTab}
        />
        <SidebarItem
          path="/survey"
          name="Know About Yourself"
          Icon={ChatBubbleIcon}
          active={activeTab}
        />
        <SidebarItem
          path="/apt"
          name="Make an Appointment"
          Icon={EmojiEmotionsIcon}
          active={activeTab}
        />
        <SidebarItem
          name="Notifications"
          Icon={NotificationsIcon}
          active={activeTab}
        />
        <SidebarItem name="Contact" Icon={CallIcon} active={activeTab} />
      </div>
      <div className="pl-6 my-6 pt-6 border-t-2 border-solid border-light w-full bottom-0">
        <SidebarItem name={username} Icon={AccountCircleIcon} />
        <SidebarItem name="Privacy Policy" Icon={PrivacyTipIcon} />
        <div
          onClick={logOut}
          className={`text-lg flex items-center w-full my-2 h-12 pl-5 rounded-l-full cursor-pointer`}
        >
          <LogoutIcon className="mr-3" />
          <div className="w-[80%]">Log Out</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
