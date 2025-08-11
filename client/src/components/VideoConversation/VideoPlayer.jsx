// // client/pages/VideoCall.js
// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { SocketContext } from "../../context/Context";

// import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa6";
// import { IoVideocam, IoVideocamOff } from "react-icons/io5";

// const VideoCall = () => {
//   const {
//     name,
//     callAccepted,
//     myVideo,
//     userVideo,
//     callEnded,
//     stream,
//     call,
//     leaveCall,
//     callStatus,
//   } = useContext(SocketContext);
//   const navigate = useNavigate();

//   console.log("call Status : ", callStatus);
//   console.log("call Name : ", name);

//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);

//   useEffect(() => {
//     if (myVideo.current && stream) {
//       myVideo.current.srcObject = stream;
//     }
//   }, [stream]);

//   useEffect(() => {
//     if (callStatus == "rejected" || callStatus == "ended") {
//       // Stop all media tracks
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//       navigate("/home");
//     }
//   }, [callStatus, stream, navigate]);

//   const toggleMic = () => {
//     if (stream && stream.getAudioTracks().length > 0) {
//       const audioTrack = stream.getAudioTracks()[0];
//       const isEnabled = audioTrack.enabled;
//       audioTrack.enabled = !isEnabled;
//       setIsMuted(!isEnabled); // Update state after toggling
//     }
//   };

//   const toggleVideo = () => {
//     if (stream && stream.getVideoTracks().length > 0) {
//       const videoTrack = stream.getVideoTracks()[0];
//       const isEnabled = videoTrack.enabled;
//       videoTrack.enabled = !isEnabled;
//       setIsVideoOff(!isEnabled); // Update state after toggling
//     }
//   };

//   const endCall = () => {
//     console.log("Call ended");
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     leaveCall();
//     navigate("/home");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-800">
//       <div className="relative flex flex-row items-center justify-center h-full w-full">
//         {stream && (
//           <div className="relative w-full h-full flex justify-center items-center">
//             <video
//               playsInline
//               muted
//               ref={myVideo}
//               autoPlay
//               className="w-full h-full object-cover"
//             />
//           </div>
//         )}
//         {callAccepted && !callEnded && (
//           <div className="relative w-full h-full flex justify-center items-center">
//             <video
//               playsInline
//               ref={userVideo}
//               autoPlay
//               className="w-full h-full object-cover"
//             />
//           </div>
//         )}
//         <div className="absolute top-0 flex gap-4 p-4">
//           <button
//             onClick={toggleMic}
//             className={`p-4 rounded-full ${
//               isMuted ? "bg-gray-500" : "bg-green-500"
//             } text-white`}
//           >
//             {isMuted ? (
//               <FaMicrophoneSlash size={25} />
//             ) : (
//               <FaMicrophone size={25} />
//             )}
//           </button>
//           <button
//             onClick={toggleVideo}
//             className={`p-4 rounded-full ${
//               !isVideoOff ? "bg-gray-500" : "bg-green-500"
//             } text-white`}
//           >
//             {!isVideoOff ? (
//               <IoVideocamOff size={25} />
//             ) : (
//               <IoVideocam size={25} />
//             )}
//           </button>
//           <button
//             onClick={endCall}
//             className="p-4 rounded-full bg-red-500 text-white"
//           >
//             <FaPhoneSlash size={25} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCall;

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

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (callAccepted && !callEnded) {
      // Start the timer
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      setTimerId(timer);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [callAccepted, callEnded]);

  useEffect(() => {
    if (callStatus === "rejected" || callStatus === "ended") {
      // Stop all media tracks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (timerId) clearInterval(timerId);
      navigate("/home");
    }
  }, [callStatus, stream, navigate, timerId]);

  const toggleMic = () => {
    if (stream && stream.getAudioTracks().length > 0) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
  
      // Ensure that you are not playing the local stream's audio
      if (myVideo.current) {
        myVideo.current.muted = true; // Prevent local audio from playing
      }
    }
  };

  const toggleVideo = () => {
    if (stream && stream.getVideoTracks().length > 0) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (timerId) clearInterval(timerId);
    leaveCall();
    navigate("/home");
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(1, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-800 relative">
      <div className="absolute top-4 left-4 text-white text-lg font-semibold">
        Call Duration: {formatDuration(callDuration)}
      </div>

      <div className="relative flex flex-row items-center justify-center h-full w-full">
        {/* {stream && (
          <div className="relative w-full h-full flex justify-center items-center">
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        )} */}
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
        <div className="absolute bottom-10 flex gap-4 p-4">
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
