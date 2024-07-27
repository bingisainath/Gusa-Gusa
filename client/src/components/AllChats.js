import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowUpLeft } from "react-icons/fi";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

import Avatar from "./Avatar";
import CreateGroup from "../components/CreateGroup";

const AllChats = ({  isChat }) => {
  const user = useSelector((state) => state?.user);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [chats, setChats] = useState([]);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  // console.log("allChats : ",allChats);
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      const handleConversation = (data) => {
        console.log("conversation", data);

        const individualConversations = data.individual || [];
        const groupConversations = data.groups || [];

        const conversationUserData = individualConversations.map((conversationUser) => {
          if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
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
        });

        if (isChat) {
          setChats(conversationUserData);
        } else {
          setChats(groupConversations);
        }

        console.log("chats :",chats);
      };

      socketConnection.on("conversation", handleConversation);

      // Cleanup function to remove listener when component unmounts or dependencies change
      return () => {
        socketConnection.off("conversation", handleConversation);
      };
    }
  }, [socketConnection, user, isChat]);

  // useEffect(() => {
  //   setChats(allChats);
  // }, [allChats]);

  return (
    <div className="w-full">
      <div className="h-16 flex items-center">
        <h2 className="text-xl font-bold p-4 text-slate-800">Message</h2>
        {!isChat && (
          <div onClick={() => setOpenCreateGroup(true)}>
            <AiOutlineUsergroupAdd size={35} title={"new group"} />
          </div>
        )}
      </div>
      <div className="bg-fuchsia-200 p-[0.5px]"></div>

      <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
        {chats.length === 0 && (
          <div className="mt-12">
            <div className="flex justify-center items-center my-4 text-slate-500">
              <FiArrowUpLeft size={50} />
            </div>
            <p className="text-lg text-center text-slate-400">
              {isChat
                ? "Explore users to start a conversation with."
                : "Create or join groups to start a conversation."}
            </p>
          </div>
        )}

        {chats.map((conv, index) => {
          const path = isChat
            ? `/home/user/${conv?.userDetails?._id}`
            : `/home/group/${conv?._id}`;
          return (
            <NavLink
              to={path}
              key={conv?._id}
              className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
            >
              <div>
                <Avatar
                  imageUrl={conv?.userDetails?.profile_pic || conv?.groupImage}
                  name={conv?.userDetails?.name || conv?.groupName}
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                  {conv?.userDetails?.name || conv?.groupName}
                </h3>
                <div className="text-slate-500 text-xs flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    {conv?.lastMsg?.imageUrl && (
                      <div className="flex items-center gap-1">
                        <span>
                          <FaImage />
                        </span>
                        {!conv?.lastMsg?.text && <span>Image</span>}
                      </div>
                    )}
                    {conv?.lastMsg?.videoUrl && (
                      <div className="flex items-center gap-1">
                        <span>
                          <FaVideo />
                        </span>
                        {!conv?.lastMsg?.text && <span>Video</span>}
                      </div>
                    )}
                  </div>
                  <p className="text-ellipsis line-clamp-1">
                    {conv?.lastMsg?.text}
                  </p>
                </div>
              </div>
              {Boolean(conv?.unseenMsg) && (
                <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                  {conv?.unseenMsg}
                </p>
              )}
            </NavLink>
          );
        })}
      </div>

      {/**create group */}
      {openCreateGroup && (
        <CreateGroup onClose={() => setOpenCreateGroup(false)} />
      )}
    </div>
  );
};

export default AllChats;
