// // client/pages/VideoCall.js
// import React, { useContext, useEffect, useState } from "react";
// import { Grid, Typography, Paper, makeStyles } from "@material-ui/core";
// import { useNavigate } from "react-router-dom";
// import { SocketContext } from "../../context/Context";

// // import { FaAngleLeft } from "react-icons/fa6";
// import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa6";
// import { IoVideocam, IoVideocamOff } from "react-icons/io5"

// const useStyles = makeStyles((theme) => ({
//   video: {
//     width: "550px",
//     [theme.breakpoints.down("xs")]: {
//       width: "300px",
//     },
//   },
//   gridContainer: {
//     justifyContent: "center",
//     [theme.breakpoints.down("xs")]: {
//       flexDirection: "column",
//     },
//   },
//   paper: {
//     padding: "10px",
//     border: "2px solid black",
//     margin: "10px",
//   },
// }));

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
//   } = useContext(SocketContext);
//   const classes = useStyles();
//   const navigate = useNavigate();

//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);

//   // Ensure the video ref is available and set the srcObject once the component is mounted
//   useEffect(() => {
//     console.log("My Video : ", myVideo);
//     console.log("My Video : ", name);
//     console.log("My Video : ", myVideo);
//     if (myVideo.current && stream) {
//       myVideo.current.srcObject = stream;
//     }
//   }, [navigate, callAccepted]);

//   // useEffect(() => {
//   //   if (userVideo.current && callAccepted) {
//   //     userVideo.current.srcObject = stream;
//   //   }
//   // }, [callAccepted, userVideo]);

//   // Toggle Mic
//   const toggleMic = () => {
//     if (stream) {
//       const enabled = stream.getAudioTracks()[0].enabled;
//       stream.getAudioTracks()[0].enabled = !enabled;
//       setIsMuted(!enabled)
//       console.log("Mic Enabled:", !enabled);
//     }
//   };

//   // Toggle Video
//   const toggleVideo = () => {
//     if (stream) {
//       const enabled = stream.getVideoTracks()[0].enabled;
//       stream.getVideoTracks()[0].enabled = !enabled;
//       setIsVideoOff(!enabled);
//     }
//   };

//   const endCall = () => {
//     // console.log("socketConnection : ", socketConnection);

//     // if (socketConnection) {
//     //   socketConnection.emit("end-call", { callId });
//     // }
//     // setCallDuration("00:00:00");
//     // console.log("Call ended");
//     navigate("/home");
//   };

//   return (
//     <div>
//       <Grid container className={classes.gridContainer}>
//         {stream && (
//           <Paper className={classes.paper}>
//             <Grid item xs={12} md={6}>
//               <Typography variant="h5" gutterBottom>
//                 {name || "Name"}
//               </Typography>
//               <video
//                 playsInline
//                 muted
//                 ref={myVideo}
//                 autoPlay
//                 className={classes.video}
//               />
//             </Grid>
//           </Paper>
//         )}
//         {callAccepted && !callEnded && (
//           <Paper className={classes.paper}>
//             <Grid item xs={12} md={6}>
//               <Typography variant="h5" gutterBottom>
//                 {call.name || "Name"}
//               </Typography>
//               <video
//                 playsInline
//                 ref={userVideo}
//                 autoPlay
//                 className={classes.video}
//               />
//             </Grid>
//             <Grid
//               item
//               xs={12}
//               md={6}
//               style={{ textAlign: "center", marginTop: 20 }}
//             >
//               <button
//                 onClick={() => {
//                   leaveCall();
//                   navigate("/");
//                 }}
//               >
//                 End Call
//               </button>
//             </Grid>
//           </Paper>
//         )}
//       </Grid>
//       <div className="relative w-full bottom-10 p-4 gap-8 flex justify-center">
//         <>
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
//               isVideoOff ? "bg-gray-500" : "bg-green-500"
//             } text-white`}
//           >
//             {isVideoOff ? (
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
//         </>
//       </div>
//     </div>
//   );
// };

// export default VideoCall;

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
  } = useContext(SocketContext);
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

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
