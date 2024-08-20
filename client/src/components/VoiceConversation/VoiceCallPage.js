// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
// import { FaAngleLeft } from "react-icons/fa6";
// import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa6";
// import moment from "moment";

// import Avatar from "../Avatar";
// import Loading from "../Loading";
// import backgroundImage from "../../assets/wallpaper.jpeg";

// const VoiceCallPage = () => {
//   const { callId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [callStartTime, setCallStartTime] = useState(null);
//   const [callDuration, setCallDuration] = useState("00:00:00");
//   const [callStatus, setCallStatus] = useState("ringing"); // "ringing" or "ongoing"
//   const socketConnection = useSelector(
//     (state) => state?.user?.socketConnection
//   );
//   const userData = location.state?.caller;

//   useEffect(() => {
//     // Handle socket events
//     if (socketConnection) {
//       socketConnection.on("call-answered", ({ callId }) => {
//         console.log("Call Answered");
//         if (callId === callId) {
//           setCallStatus("ongoing");
//           setLoading(false);
//           setCallStartTime(Date.now());
//         }
//       });

//       socketConnection.on("call-rejected", ({ callId }) => {
//         if (callId === callId) {
//           setCallStatus("rejected");
//           setLoading(false);
//           //rather navigating to home display call reject message
//           navigate("/home");
//         }
//       });

//       socketConnection.on("call-ended", ({ callId }) => {
//         if (callId === callId) {
//           setCallStatus("ended");
//           setLoading(false);
//           navigate("/home");
//         }
//       });
//     }

//     return () => {
//       if (socketConnection) {
//         socketConnection.off("call-answered");
//         socketConnection.off("call-rejected");
//         socketConnection.off("call-ended");
//       }
//     };
//   }, [socketConnection]);

//   useEffect(() => {
//     if (callStatus === "ongoing") {
//       const interval = setInterval(() => {
//         const duration = moment.duration(Date.now() - callStartTime);
//         setCallDuration(
//           `${String(duration.hours()).padStart(2, "0")}:${String(
//             duration.minutes()
//           ).padStart(2, "0")}:${String(duration.seconds()).padStart(2, "0")}`
//         );
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [callStartTime, callStatus]);

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//     // Add functionality to mute/unmute the mic using WebRTC or relevant library
//   };

//   const endCall = () => {
//     if (socketConnection) {
//       socketConnection.emit("end-call", { callId });
//     }
//     navigate("/home");
//     // Add functionality to end the call using WebRTC or relevant library
//     console.log("Call ended");
//   };

//   return (
//     <div
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//       className="bg-no-repeat bg-cover"
//     >
//       <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
//         <div className="flex items-center gap-4">
//           <Link to={"/home"} className="lg:hidden">
//             <FaAngleLeft size={25} />
//           </Link>
//           <div>
//             <Avatar
//               width={50}
//               height={50}
//               imageUrl={userData?.profile_pic}
//               name={userData?.name}
//               userId={userData?._id}
//             />
//           </div>
//           <div>
//             <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
//               {userData?.name}
//             </h3>
//           </div>
//         </div>
//       </header>

//       <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
//         {/* {loading && (
//           <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
//             <Loading />
//           </div>
//         )} */}
//         {callStatus === "ringing" ? (
//           <div className="p-4 text-center">
//             <p className="text-lg">Incoming call...</p>
//             <div className="flex flex-col items-center mt-4">
//               <Avatar
//                 width={300}
//                 height={300}
//                 imageUrl={userData?.profile_pic}
//                 name={"Name"}
//                 userId={"12345"}
//               />
//               <h3 className="font-semibold text-xl mt-10">{userData?.name}</h3>
//             </div>
//           </div>
//         ) : (
//           <div className="p-4 text-center">
//             <p className="text-lg">Ongoing call duration</p>
//             <p className="text-2xl font-bold">{callDuration}</p>
//             <div className="flex flex-col items-center mt-4">
//               <Avatar
//                 width={300}
//                 height={300}
//                 imageUrl={userData?.profile_pic}
//                 name={"Name"}
//                 userId={"12345"}
//               />
//               <h3 className="font-semibold text-xl mt-10">{userData?.name}</h3>
//             </div>
//           </div>
//         )}
//       </section>

//       <div className="fixed bottom-0 w-full bg-white p-4 flex justify-center items-center gap-8">
//         {callStatus === "ongoing" && (
//           <>
//             <button
//               onClick={toggleMute}
//               className={`p-4 rounded-full ${
//                 isMuted ? "bg-gray-500" : "bg-green-500"
//               } text-white`}
//             >
//               {isMuted ? (
//                 <FaMicrophoneSlash size={25} />
//               ) : (
//                 <FaMicrophone size={25} />
//               )}
//             </button>
//             <button
//               onClick={endCall}
//               className="p-4 rounded-full bg-red-500 text-white"
//             >
//               <FaPhoneSlash size={25} />
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VoiceCallPage;

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa6";
import moment from "moment";
import io from "socket.io-client";

import Avatar from "../Avatar";
import backgroundImage from "../../assets/wallpaper.jpeg";
import Loading from "../Loading";

const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
});

const VoiceCallPage = () => {
  const { callId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.caller;
  const [isMuted, setIsMuted] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callDuration, setCallDuration] = useState("00:00:00");
  const [callStatus, setCallStatus] = useState(
    userData.call === "receiver" ? "ongoing" : "ringing"
  ); // "ringing" or "ongoing"

  console.log("call id :",callId);
  

  // const socketConnection = useSelector(
  //   (state) => state?.user?.socketConnection
  // );

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    const setupWebRTC = async () => {
      if (!socketConnection) {
        console.log("Socket Connection is not Available");
        return;
      }

      // Initialize peer connection
      peerConnectionRef.current = new RTCPeerConnection();
      console.log("Peer Connection Initialized");

      // Set up audio stream handling
      try {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("Local Stream Obtained:", localStreamRef.current);
        localStreamRef.current.getTracks().forEach((track) => {
          console.log("Adding Track to Peer Connection:", track);
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });

        peerConnectionRef.current.ontrack = (event) => {
          console.log("Remote Stream Received:", event.streams[0]);
          remoteStreamRef.current = event.streams[0];

          const audio = document.createElement("audio");
          audio.srcObject = remoteStreamRef.current;
          audio
            .play()
            .then(() => console.log("Remote audio playback started"))
            .catch((err) => console.error("Error playing remote audio:", err));
        };

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Sending ICE Candidate:", event.candidate);
            socketConnection.emit("ice-candidate", {
              callId,
              candidate: event.candidate,
            });
          }
        };

        socketConnection.on("ice-candidate", ({ candidate }) => {
          console.log("Received ICE Candidate:", candidate);
          peerConnectionRef.current
            .addIceCandidate(new RTCIceCandidate(candidate))
            .catch((err) => console.error("Error adding ICE Candidate:", err));
        });

        socketConnection.on("offer", async ({ offer }) => {
          console.log("Received Offer");
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          console.log("Sending Answer");
          socketConnection.emit("answer", { callId, answer });
        });

        socketConnection.on("answer", async ({ answer }) => {
          console.log("Received Answer");
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        });

        // Handle socket events
        socketConnection.on("call-answered", ({ callId }) => {
          console.log("Call Answered");
          if (callId === callId) {
            setCallStatus("ongoing");
            setCallStartTime(Date.now());
          }
        });

        socketConnection.on("call-rejected", ({ callId }) => {
          console.log("Call Rejected");
          if (callId === callId) {
            setCallStatus("rejected");
            navigate("/home");
          }
        });

        socketConnection.on("call-ended", ({ callId }) => {
          console.log("Call Ended");
          if (callId === callId) {
            setCallStatus("ended");
            setCallDuration("00:00:00");
            navigate("/home");
          }
        });

        return () => {
          socketConnection.off("call-answered");
          socketConnection.off("call-rejected");
          socketConnection.off("call-ended");
        };
      } catch (error) {
        console.error("Error setting up WebRTC:", error);
      }
    };

    setupWebRTC();
  }, [socketConnection, callId]);

  useEffect(() => {
    if (callStatus === "ongoing") {
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    const tracks = localStreamRef.current?.getTracks();
    if (tracks) {
      tracks.forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = !isMuted;
        }
      });
    }
  };

  const endCall = () => {
    console.log("socketConnection : ",socketConnection);

    if (socketConnection) {
      socketConnection.emit("end-call", { callId });
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    setCallDuration("00:00:00");
    console.log("Call ended");
    navigate("/home");
  };

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
            <p className="text-lg">Incoming call...</p>
            <div className="flex flex-col items-center mt-4">
              <Avatar
                width={300}
                height={300}
                imageUrl={userData?.profile_pic}
                name={"Name"}
                userId={"12345"}
              />
              <h3 className="font-semibold text-xl mt-10">{userData?.name}</h3>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-lg">Ongoing call duration</p>
            <p className="text-2xl font-bold">{callDuration}</p>
            <div className="flex flex-col items-center mt-4">
              <Avatar
                width={300}
                height={300}
                imageUrl={userData?.profile_pic}
                name={"Name"}
                userId={"12345"}
              />
              <h3 className="font-semibold text-xl mt-10">{userData?.name}</h3>
            </div>
          </div>
        )}
      </section>

      <div className="fixed bottom-0 w-full bg-white p-4 flex justify-center items-center gap-8">
        {callStatus === "ongoing" && (
          <>
            <button
              onClick={toggleMute}
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
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 text-white"
            >
              <FaPhoneSlash size={25} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceCallPage;
