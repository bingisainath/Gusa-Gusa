import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import { FiArrowUpLeft } from "react-icons/fi";
import Avatar from "../Avatar";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { FiPhoneCall } from "react-icons/fi";
import moment from "moment";

const VoiceCall = ({ active }) => {
  const [calls, setCalls] = useState([]);
  const [currentCall, setCurrentCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const navigate = useNavigate();

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const peerRef = useRef(null);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("get-call-history");

      socketConnection.on("call-history", (callHistory) => {
        console.log("history", callHistory);
        setCalls(callHistory);
      });

      // socketConnection.on("call-made", ({ offer, caller, callId }) => {
      //   setIsRinging(true);
      //   setCurrentCall({ offer, caller, callId });
      // });

      // socketConnection.on("call-answered", ({ answer, callId }) => {
      //   peerRef.current.signal(answer);
      //   setIsCalling(false);
      //   setCurrentCall((prev) => ({ ...prev, status: "ongoing" }));
      // });

      // socketConnection.on("call-rejected", () => {
      //   setIsCalling(false);
      //   alert("Call was rejected");
      // });

      // socketConnection.on("call-ended", () => {
      //   setCurrentCall(null);
      //   setIsCalling(false);
      //   setIsRinging(false);
      //   alert("Call ended");
      // });

      return () => {
        socketConnection.off("call-history");
        // socketConnection.off("call-made");
        // socketConnection.off("call-answered");
        // socketConnection.off("call-rejected");
        // socketConnection.off("call-ended");
      };
    }
  }, []);

  // const calls = [
  //   {
  //     name: "yo",
  //     email: "yo@gmail.com",
  //     time: "12:14 pm",
  //     duration: "40mins",
  //     profile_pic:
  //       "https://img.freepik.com/premium-vector/professional-design-background-business-vector-illustration-banner-office-card-concept-day_1013341-248017.jpg?ga=GA1.1.1827910680.1697219531&semt=ais_hybrid",
  //   },
  //   {
  //     name: "yo",
  //     email: "yo@gmail.com",
  //     time: "12:14 pm",
  //     duration: "40mins",
  //     profile_pic:
  //       "https://img.freepik.com/premium-vector/professional-design-background-business-vector-illustration-banner-office-card-concept-day_1013341-248017.jpg?ga=GA1.1.1827910680.1697219531&semt=ais_hybrid",
  //   },
  // ];

  const [room, setRoom] = useState("");

  // const joinRoom = () => {
  //   if (room) {
  //     navigate(`call/${room}`);
  //   }
  // };

  return (
    <div className="w-full">
      <div className="h-16 flex items-center">
        <h2 className="text-xl font-bold p-4 text-slate-800">Calls</h2>
      </div>
      <div className="bg-fuchsia-200 p-[0.5px]"></div>

      <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
        {calls.length === 0 && (
          <div className="mt-48">
            <div className="flex justify-center items-center my-4 text-slate-500">
              <FiArrowUpLeft size={50} />
            </div>
            <p className="text-lg text-center text-slate-400 ">
              {active == "call"
                ? "Explore users to start a conversation with."
                : "Create or join groups to start a conversation."}
            </p>
          </div>
        )}

        {/* <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button> */}

        {calls.map((user, index) => {
          return (
            <div className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer">
              <div>
                <Avatar
                  imageUrl={user?.receiver.profile_pic}
                  name="Name"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                  {user?.receiver?.name}
                </h3>
                <div className="text-slate-500 text-xs flex items-center gap-1">
                  <p className="text-ellipsis line-clamp-1">
                    {user?.receiver?.email}
                  </p>
                  <p className="text-xs ml-auto mr-3 w-fit">
                    {moment(user?.startTime).format("MM-DD-YYYY HH:mm")}
                  </p>
                </div>
              </div>

              <div className="flex items-center ml-auto mr-5">
                {!user?.status == "pending" ? (
                  <button className="text-red-600">
                    <FiPhoneCall size={24} />
                  </button>
                ) : (
                  <button className="text-secondary">
                    <FiPhoneCall size={24} />
                  </button>
                )}
                {/* <button className="text-primary">
                  <FiPhoneCall size={24} />
                </button> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoiceCall;
