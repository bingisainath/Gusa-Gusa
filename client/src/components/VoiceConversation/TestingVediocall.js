import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "peerjs";

const socket = io("http://localhost:8000");

function Room() {
  const { roomId } = useParams();
  const [myVideoStream, setMyVideoStream] = useState(null);
  const [myPeer] = useState(
    () =>
      new Peer(undefined, { path: "/peerjs", host: "/", port: "8000" })
  );
  const videoGrid = useRef(null);

  useEffect(() => {
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

        socket.emit("join-room", roomId, myPeer.id, "User");

        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    socket.on("createMessage", (message, userName) => {
      console.log(`${userName}: ${message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, myPeer]);

  const connectToNewUser = (userId, stream) => {
    console.log("my peer : ", myPeer);

    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      console.log("New User Video Stream:", userVideoStream);
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();
    });
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

  const toggleMic = () => {
    if (myVideoStream) {
      const enabled = myVideoStream.getAudioTracks()[0].enabled;
      myVideoStream.getAudioTracks()[0].enabled = !enabled;
      console.log("Mic Enabled:", !enabled);
    }
  };

  const toggleVideo = () => {
    if (myVideoStream) {
      const enabled = myVideoStream.getVideoTracks()[0].enabled;
      myVideoStream.getVideoTracks()[0].enabled = !enabled;
      console.log("Video Enabled:", !enabled);
    }
  };

  const inviteOthers = () => {
    prompt(
      "Copy this link and share it with others to join the room:",
      window.location.href
    );
  };

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      <div ref={videoGrid} id="video-grid"></div>
      <div className=" bg-cyan-500">
        <button onClick={toggleMic} className=" bg-red-300 m-1 p-1">Toggle Mic</button>
        <button onClick={toggleVideo} className=" bg-red-300 m-1 p-1">Toggle Video</button>
        <button onClick={inviteOthers} className=" bg-red-300 m-1 p-1">Invite Others</button>
      </div>
    </div>
  );
}

export default Room;
