// client/pages/VideoCall.js
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../context/Context";

import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa6";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";

const VideoCall = () => {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
    leaveCall,
    callStatus,
  } = useContext(SocketContext);
  const navigate = useNavigate();

  console.log("call Status : ", callStatus);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (callStatus == "rejected" || callStatus == "ended") {
      // Stop all media tracks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      navigate("/home");
    }
  }, [callStatus]);

  const toggleMic = () => {
    if (stream) {
      const enabled = stream.getAudioTracks()[0].enabled;
      stream.getAudioTracks()[0].enabled = !enabled;
      setIsMuted(!enabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const enabled = stream.getVideoTracks()[0].enabled;
      stream.getVideoTracks()[0].enabled = !enabled;
      setIsVideoOff(!enabled);
    }
  };

  const endCall = () => {
    console.log("Call ended");
    leaveCall();
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-800">
      <div className="relative flex flex-row items-center justify-center h-full w-full">
        {stream && (
          <div className="relative w-full h-full flex justify-center items-center">
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {callAccepted && !callEnded && (
          <div className="relative w-full h-full flex justify-center items-center">
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="absolute top-0 flex gap-4 p-4">
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
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
