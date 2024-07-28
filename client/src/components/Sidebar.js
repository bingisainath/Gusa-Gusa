import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Divider from "./Divider";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import io from "socket.io-client";

import AllChats from "./AllChats";
import { logout, setOnlineUser, setSocketConnection } from "../redux/userSlice";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [isChat, setIsChat] = useState(true);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversation", (data) => {
        console.log("conversation", data);

        // Separate individual and group conversations
        const individualConversations = data.individual || [];
        const groupConversations = data.groups || [];

        const conversationUserData = individualConversations.map(
          (conversationUser) => {
            if (
              conversationUser?.sender?._id === conversationUser?.receiver?._id
            ) {
              return {
                ...conversationUser,
                userDetails: conversationUser?.sender,
              };
            } else if (conversationUser?.receiver?._id !== user?._id) {
              return {
                ...conversationUser,
                userDetails: conversationUser.receiver,
              };
            } else {
              return {
                ...conversationUser,
                userDetails: conversationUser.sender,
              };
            }
          }
        );

        console.log("Side conversationUserData :", conversationUserData);
        console.log("Side groupConversations :", groupConversations);

        setAllUser(conversationUserData);
        setAllGroups(groupConversations);
      });
    }
  }, [socketConnection, isChat]);

  // console.log("allChats : ",allChats);
  //  useEffect(() => {
  //   if (socketConnection) {
  //     socketConnection.emit("sidebar", user._id);

  //     const handleConversation = (data) => {
  //       console.log("conversation", data);

  //       const individualConversations = data.individual || [];
  //       const groupConversations = data.groups || [];

  //       const conversationUserData = individualConversations.map((conversationUser) => {
  //         if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
  //           return {
  //             ...conversationUser,
  //             userDetails: conversationUser?.sender,
  //           };
  //         } else if (conversationUser?.receiver?._id !== user?._id) {
  //           return {
  //             ...conversationUser,
  //             userDetails: conversationUser.receiver,
  //           };
  //         } else {
  //           return {
  //             ...conversationUser,
  //             userDetails: conversationUser.sender,
  //           };
  //         }
  //       });

  //       setChats(conversationUserData);
  //       console.log("isChat",isChat);
  //       console.log("conversationUserData :",conversationUserData);
  //       console.log("groupConversations :",groupConversations);

  //       // if (isChat) {
  //       //   setChats(conversationUserData);
  //       // } else {
  //       //   setChats(groupConversations);
  //       // }

  //       // console.log("chats :",chats);
  //     };

  //     socketConnection.on("conversation", handleConversation);

  //     // Cleanup function to remove listener when component unmounts or dependencies change
  //     return () => {
  //       socketConnection.off("conversation", handleConversation);
  //     };
  //   }
  // }, [socketConnection, user, isChat]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    localStorage.clear();
  };

  return (
    <div className="w-full h-full grid grid-cols-[58px,1fr] bg-white">
      <div className="bg-fuchsia-200 w-14 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <div
            onClick={() => {
              setIsChat(true);
              navigate("/home");
            }}
            className={`w-12 h-12 mx-1 mb-1 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded ${
              isChat && "bg-fuchsia-300"
            }`}
            title="chat"
          >
            <IoChatbubbleEllipses size={20} />
          </div>

          <div
            onClick={() => {
              setIsChat(false);
              navigate("/home");
            }}
            className={`w-12 h-12 mx-1 mb-1 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded ${
              !isChat && "bg-fuchsia-300"
            }`}
            title="group"
          >
            <HiUserGroup size={20} />
          </div>

          <div
            title="add friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 mx-1 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded"
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={35}
              height={35}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            title="logout"
            className="w-12 h-12 mx-1 mt-3 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded"
            onClick={handleLogout}
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div>
        {isChat ? (
          <AllChats allChats={allUser} isChat={isChat} />
        ) : (
          <AllChats allChats={allGroups} isChat={isChat} />
        )}
      </div>

      {/**edit user details*/}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/**search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
