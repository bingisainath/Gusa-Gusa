import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  auth: { token: localStorage.getItem("token") }, // Replace with your auth token logic
});

const VoiceCall = ({ userId }) => {
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.on("call-made", (data) => {
      setReceivingCall(true);
      setCaller(data.socket);
      setCallerSignal(data.offer);
    });

    socket.on("answer-made", (data) => {
      setCallAccepted(true);
      connectionRef.current.signal(data.answer);
    });

    socket.on("ice-candidate", (data) => {
      connectionRef.current.signal(data.candidate);
    });

    return () => {
      socket.off("call-made");
      socket.off("answer-made");
      socket.off("ice-candidate");
    };
  }, []);

  const callUser = (id) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("call-user", {
        offer: data,
        to: id,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("answer-made", (data) => {
      setCallAccepted(true);
      peer.signal(data.answer);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("make-answer", {
        answer: data,
        to: caller,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <div>
      <div>
        {stream && <video playsInline muted ref={userVideo} autoPlay />}
      </div>
      <div>
        {callAccepted && !callEnded ? (
          <video playsInline ref={partnerVideo} autoPlay />
        ) : null}
      </div>
      <div>
        {receivingCall && !callAccepted ? (
          <div>
            <h1>{caller} is calling...</h1>
            <button onClick={answerCall}>Answer</button>
          </div>
        ) : (
          <button onClick={() => callUser(userId)}>Call</button>
        )}
      </div>
      <div>
        {callAccepted && !callEnded ? (
          <button onClick={leaveCall}>End Call</button>
        ) : null}
      </div>
    </div>
  );
};

export default VoiceCall;
