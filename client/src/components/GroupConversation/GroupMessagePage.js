import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";

import uploadFile from "../../helper/uploadFile";
import Avatar from "../Avatar";
import Loading from "../Loading";
import backgroundImage from "../../assets/wallpaper.jpeg";
import GroupProfile from "./GroupProfile";
import MessagesSection from "../messageSection";

const GroupMessagePage = () => {
  // const params = useParams();
  const { groupId } = useParams();

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  const [groupData, setGroupData] = useState({
    name: "",
    profile_pic: "",
    _id: "",
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const [openGroupProfile, setOpenGroupProfile] = useState(false);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  // Toggle the upload menu
  const handleUploadImageVideoOpen = useCallback(() => {
    setOpenImageVideoUpload((prev) => !prev);
  }, []);

  // Handle image upload with error handling
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const uploadResult = await uploadFile(file);
      setMessage((prev) => ({ ...prev, imageUrl: uploadResult.url }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setLoading(false);
      setOpenImageVideoUpload(false);
    }
  };

  // Handle video upload with error handling
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const uploadResult = await uploadFile(file);
      setMessage((prev) => ({ ...prev, videoUrl: uploadResult.url }));
    } catch (error) {
      console.error("Video upload failed:", error);
    } finally {
      setLoading(false);
      setOpenImageVideoUpload(false);
    }
  };

  const handleClearUploadImage = useCallback(() => {
    setMessage((prev) => ({ ...prev, imageUrl: "" }));
  }, []);

  const handleClearUploadVideo = useCallback(() => {
    setMessage((prev) => ({ ...prev, videoUrl: "" }));
  }, []);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("group-message-page", groupId);
      socketConnection.emit("seen", groupId, true);

      socketConnection.on("message-group", (data) => {
        setGroupData(data);
      });
      socketConnection.on("group-message", (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, groupId]);

  const handleOnChange = useCallback((e) => {
    const { value } = e.target;
    setMessage((prev) => ({
      ...prev,
      text: value,
    }));
  }, []);

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (message.text || message.imageUrl || message.videoUrl) {
        if (socketConnection) {
          const newMessageData = {
            sender: user?._id,
            text: message.text,
            imageUrl: message.imageUrl,
            videoUrl: message.videoUrl,
            msgByUserId: user?._id,
            groupId,
            senderName: user?.name,
            senderEmail: user?.email,
          };

          socketConnection.emit("group new message", newMessageData);
          setMessage({ text: "", imageUrl: "", videoUrl: "" });
        }
      }
    },
    [message, socketConnection, groupId, user?._id]
  );

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/home"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={groupData?.profile_pic}
              name={groupData?.name}
              userId={groupData?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {groupData?.name}
            </h3>
          </div>
        </div>

        <div>
          <button
            className="cursor-pointer hover:text-secondary"
            onClick={() => {
              console.log("Checking");
              setOpenGroupProfile(true);
            }}
          >
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/***show all message */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        {/**all message show here */}
        <MessagesSection
          messages={allMessage}
          user={user}
          currentMessage={currentMessage}
        />

        {/**upload Image display */}
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <LazyLoadImage
                src={message.imageUrl}
                alt="Uploaded Image"
                effect="blur"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}

        {/**upload video display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      {/**send message */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
          >
            <FaPlus size={20} />
          </button>

          {/**video and image */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />

                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/**input box */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type here message..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="text-primary hover:text-secondary">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>

      {/** search user */}
      {openGroupProfile && (
        <GroupProfile
          onClose={() => setOpenGroupProfile(false)}
          groupData={groupData}
        />
      )}
    </div>
  );
};

export default GroupMessagePage;
