// client/Context.js
import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useDispatch, useSelector } from "react-redux";

import { setOnlineUser, setSocketConnection } from "../redux/userSlice";

const SocketContext = createContext();

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [callStatus, setCallStatus] = useState("notStarted"); // notStarted,onGoing,ended,rejected
  const [startVideo, setStartVideo] = useState(false);
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  const dispatch = useDispatch();

  const socket = io(process.env.REACT_APP_BACKEND_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  // console.log("My socket ID : ", socket.id);

  socket.on("onlineUser", (data) => {
    console.log(data);
    dispatch(setOnlineUser(data));
  });

  dispatch(setSocketConnection(socket));

  useEffect(() => {
    // Request video and audio permissions from the user
    // if (startVideo) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          // console.log("myVideo ref:", myVideo.current);
          // myVideo.current.srcObject = currentStream;
          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
          // if (stream && myVideo.current) {
          //   console.log("Setting myVideo srcObject:", stream);
          //   myVideo.current.srcObject = stream;
          // }
        });
    // }

    socket.on("me", (id) => setMe(id));

    // Listen for an event that asks this client to provide their socket ID
    socket.on("send-socket-id", ({ from }, callback) => {
      console.log(`Received request for socket ID from user: ${from}`);
      // Respond with this client's socket ID
      callback({ success: true, socketId: socket.id });
    });

    // Listen for an event that asks this client to provide their socket ID
    socket.on("send-id", ({ socketId }) => {
      console.log(`Got socket ID from user: ${socketId}`);
      // Respond with this client's socket ID
    });

    // socket.on("incomingCall", ({ from, name: callerName, signal }) => {
    //   console.log("Incoming call from:", from);
    //   setCall({ isReceivingCall: true, from, name: callerName, signal });
    // });
  }, [startVideo]);

  const startVideoCall = () => {
    setStartVideo(true);
  };

  const answerCall = (incomingCallData) => {
    setCall(incomingCallData);
    setStartVideo(true);
    console.log("answerCall the call from user : ", incomingCallData);

    setCallStatus("onGoing");

    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: incomingCallData.from });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });
    peer.signal(incomingCallData.signal);
    connectionRef.current = peer;
  };

  const callUser = (id, myId) => {
    console.log("My Id :", me);
    console.log("User Id :", id);
    setCallStatus("notStarted");

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: myId,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    setCallStatus("ended");
    setStartVideo(false);
    // // Stop all media tracks
    // if (stream) {
    //   stream.getTracks().forEach((track) => track.stop());
    // }

    // Stop all media tracks if they exist
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          console.error("Error stopping track:", error);
        }
      });
    }

    if (connectionRef?.current) {
      connectionRef.current.destroy();
    }

    socket.emit("endCall", { to: call.from });
  };

  const rejectCall = (receiverId) => {
    // Notify the caller that the call was rejected
    console.log("Call rejected in caller Side", receiverId);
    socket.emit("rejectCall", { receiverId: receiverId });
    setCallStatus("rejected");
    // Optionally reset the call state without accepting it
    setCall({});
    setCallAccepted(false);
    setCallEnded(false);
    setStartVideo(false);
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        rejectCall,
        callStatus,
        startVideoCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
