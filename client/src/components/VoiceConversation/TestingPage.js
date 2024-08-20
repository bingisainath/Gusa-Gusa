import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa6";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import moment from "moment";
import io from "socket.io-client";
import Peer from "peerjs";

import Avatar from "../Avatar";
import backgroundImage from "../../assets/wallpaper.jpeg";
import Loading from "../Loading";

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
});

const CallPage = () => {
  const { callId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(location.state?.caller);
  // const [myPeer, setMyPeer] = useState(userData?.peerId);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStartTime, setCallStartTime] = useState("00:00:00");
  // const [myAudioStream, setMyAudioStream] = useState(null);
  const [myVideoStream, setMyVideoStream] = useState(null);
  const [callDuration, setCallDuration] = useState("00:00:00");

  const myPeer = useSelector((state) => state?.user?.myPeerData);
  const receiverPeer = useSelector((state) => state?.user?.receiverPeerData);

  // const [receiverPeerId, setReceiverPeerId] = useState(
  //   userData?.call == "caller" ? receiverPeer : null
  // );

  // console.log("myPeerId : ", myPeer);
  // console.log("receiverPeer : ", receiverPeerId);

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const [callStatus, setCallStatus] = useState(
    userData.call === "receiver" ? "ongoing" : "ringing"
  ); // "ringing" or "ongoing"

  // const audioGrid = useRef(null);
  const videoGrid = useRef(null);

  useEffect(() => {
    console.log("1st Use Effect triggered");

    const myVideo = document.createElement("video");
    myVideo.muted = true;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Media Stream:", stream);
        setMyVideoStream(stream);
        addVideoStream(myVideo, stream);

        myPeer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            console.log("User Video Stream:", userVideoStream);
            addVideoStream(video, userVideoStream);
          });
        });

        // Handle socket events
        socketConnection.on("call-answered", ({ peerId }) => {
          console.log("Call Answered");
          setCallStatus("ongoing");
          setCallStartTime(Date.now());
          connectToNewUser(peerId);
        });

        socketConnection.on("call-rejected", ({ callId }) => {
          console.log("Call Rejected");
          if (callId === callId) {
            setCallStatus("rejected");
            navigate("/home");
          }
        });

        socketConnection.on("call-ended", ({ callId }) => {
          console.log("socketConnection Call Ended");
          if (callId === callId) {
            setCallStatus("ended");
            setCallDuration("00:00:00");
            navigate("/home");
          }
        });

        // socket.emit("join-room", roomId, myPeer.id, "User");

        // socket.on("user-connected", (userId) => {
        //   connectToNewUser(userId, stream);
        // });
      });

    // return () => {
    //   socketConnection.disconnect();
    // };
  }, [socketConnection, callId, myPeer, receiverPeer]);

  useEffect(() => {
    console.log("caller Socket UseEffect Triggered");

    // Handle socket events
    socket.on("call-answered", ({ peerId }) => {
      console.log("Call Answered", peerId);
      setCallStatus("ongoing");
      setCallStartTime(Date.now());
      connectToNewUser(peerId);
    });

    socket.on("call-rejected", ({ callId }) => {
      console.log("Call Rejected");
      if (callId === callId) {
        setCallStatus("rejected");
        navigate("/home");
      }
    });

    socket.on("call-ended", ({ callId }) => {
      console.log("socketConnection Call Ended");
      if (callId === callId) {
        setCallStatus("ended");
        setCallDuration("00:00:00");
        navigate("/home");
      }
    });
  }, [socket]);

  const connectToNewUser = (userId, stream) => {
    console.log(userData?.call);
    if (userData?.call == "receiver") {
      console.log("receiver myPeerId : ", myPeer);
      console.log("receiver receiverPeer : ", receiverPeer);

      const call = myPeer.call(receiverPeer, stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        console.log("New User Video Stream:", userVideoStream);
        addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });
    } else {
      console.log("caller myPeerId : ", myPeer);
      console.log("caller receiverPeer : ", userId);

      const call = myPeer.call(userId, stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        console.log("New User Video Stream:", userVideoStream);
        addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });
    }
  };

  const addVideoStream = (video, stream) => {
    if (videoGrid.current) {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      videoGrid.current.append(video);
    }
  };

  // Toggle Mic
  const toggleMic = () => {
    if (myVideoStream) {
      const enabled = myVideoStream.getAudioTracks()[0].enabled;
      myVideoStream.getAudioTracks()[0].enabled = !enabled;
      console.log("Mic Enabled:", !enabled);
    }
  };

  // Toggle Video
  const toggleVideo = () => {
    if (myVideoStream) {
      const enabled = myVideoStream.getVideoTracks()[0].enabled;
      myVideoStream.getVideoTracks()[0].enabled = !enabled;
      setIsVideoOff(!enabled);
    }
  };

  useEffect(() => {
    if (callStatus === "ongoing") {
      console.log("callStartTime", callStartTime);
      const interval = setInterval(() => {
        const duration = moment.duration(Date.now() - callStartTime);
        setCallDuration(
          `${String(duration.hours()).padStart(2, "0")}:${String(
            duration.minutes()
          ).padStart(2, "0")}:${String(duration.seconds()).padStart(2, "0")}`
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [callStartTime, callStatus]);

  const endCall = () => {
    console.log("socketConnection : ", socketConnection);

    if (socketConnection) {
      socketConnection.emit("end-call", { callId });
    }
    setCallDuration("00:00:00");
    console.log("Call ended");
    navigate("/home");
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover h-full"
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
              imageUrl={userData?.profile_pic}
              name={userData?.name}
              userId={userData?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {userData?.name}
            </h3>
          </div>
        </div>
      </header>
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        {callStatus === "ringing" ? (
          <div className="p-4 text-center">
            <p className="text-2xl font-semibold">Ringing...</p>
            {/* <video width="320" height="240" controls></video> */}
            <div className="flex flex-col items-center mt-4">
              <Avatar
                width={300}
                height={300}
                imageUrl={userData?.profile_pic}
                name={"Name"}
                userId={"12345"}
              />
              <h3 className="text-3xl font-bold mt-10">{userData?.name}</h3>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-lg">Ongoing call duration</p>
            <p className="text-2xl font-bold">{callDuration}</p>
            <div ref={videoGrid} id="video-grid"></div>
          </div>
        )}
      </section>

      <div className="relative w-full bottom-10 p-4 gap-8 flex justify-center">
        <>
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full ${
              isMuted ? "bg-gray-500" : "bg-green-500"
            } text-white`}
          >
            {isMuted ? (
              <FaMicrophoneSlash size={25} />
            ) : (
              <FaMicrophone size={25} />
            )}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              isVideoOff ? "bg-gray-500" : "bg-green-500"
            } text-white`}
          >
            {isVideoOff ? (
              <IoVideocamOff size={25} />
            ) : (
              <IoVideocam size={25} />
            )}
          </button>
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500 text-white"
          >
            <FaPhoneSlash size={25} />
          </button>
        </>
      </div>
    </div>
  );
};

export default CallPage;
