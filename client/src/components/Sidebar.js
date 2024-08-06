import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { BiLogOut } from "react-icons/bi";
import { IoCall } from "react-icons/io5";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import SearchUser from "./SearchUser";
import AllChats from "./AllChats";
import { logout } from "../redux/userSlice";
import io from "socket.io-client";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import VoiceCall from "./VoiceCall";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [isChat, setIsChat] = useState(true);
  const [active,setActive] = useState("chat");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Socket initialization
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
      auth: { token: user.token },
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.emit("sidebar", user._id);

    socket.on("conversation", (data) => {
      console.log("conversation", data);

      // Separate individual and group conversations
      const individualConversations = data.individualConversations || [];
      const groupConversations = data.groupConversations || [];

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

      console.log("Side conversationUserData:", conversationUserData);
      console.log("Side groupConversations:", groupConversations);

      setAllUser(conversationUserData);
      setAllGroups(groupConversations);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
      console.log("Disconnected from socket server");
    };
  }, [user, isChat]);

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
              setActive("chat");
              navigate("/home");
            }}
            className={`w-12 h-12 mx-1 mb-1 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded ${
              active == "chat" && "bg-primary"
            }`}
            title="chat"
          >
            <IoChatbubbleEllipses size={20} />
          </div>

          <div
            onClick={() => {
              setIsChat(false);
              setActive("groupChat");
              navigate("/home");
            }}
            className={`w-12 h-12 mx-1 mb-1 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded ${
              active == "groupChat" && "bg-fuchsia-300"
            }`}
            title="group"
          >
            <HiUserGroup size={20} />
          </div>

          <div
            onClick={() => {
              setIsChat(false);
              setActive("call")
              navigate("/home");
            }}
            className={`w-12 h-12 mx-1 mb-1 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded ${
              active == "call" && "bg-fuchsia-300"
            }`}
            title="group"
          >
            <IoCall size={20} />
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
        <AllChats allChats={isChat ? allUser : allGroups} isChat={isChat} />
      </div>

      {/* <div>
        <VoiceCall />
      </div> */}

      {/** edit user details */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/** search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
