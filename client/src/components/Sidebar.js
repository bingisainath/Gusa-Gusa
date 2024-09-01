import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  useRef,
  useContext,
} from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { BiLogOut } from "react-icons/bi";
import { IoCall } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdPhoneCallback, MdVideoCall } from "react-icons/md";
import { HiPhoneMissedCall } from "react-icons/hi";
import { FaBullseye } from "react-icons/fa6";

import { SocketContext } from "../context/Context";
// import VoiceCall from "./VoiceConversation/VoiceCall";
// import EditUserDetails from "./EditUserDetails";
// import SearchUser from "./SearchUser";
// import AllChats from "./AllChats";
import { logout } from "../redux/userSlice";
import Avatar from "./Avatar";
import Loading from "./Loading";

const EditUserDetails = lazy(() => import("./EditUserDetails"));
const SearchUser = lazy(() => import("./SearchUser"));
const AllChats = lazy(() => import("./AllChats"));
const VoiceCall = lazy(() => import("./VoiceConversation/VoiceCall"));

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [me, setMe] = useState("");
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [isChat, setIsChat] = useState(true);
  const [active, setActive] = useState("chat");
  const [incomingCall, setIncomingCall] = useState(false); // State for incoming call
  const [caller, setCaller] = useState(null); // State to store caller info
  const [callId, setCallId] = useState(null); // State to store call ID
  // const [callHistory, setCallHistory] = useState([]);

  const [incomingCallData, setIncomingCallData] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const socketRef = useRef();

  const {
    answerCall,
    call,
    callAccepted,
    callUser,
    rejectCall,
    startVideoCall,
  } = useContext(SocketContext);

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
    auth: { token: user.token },
  });

  // Socket initialization
  useEffect(() => {
    socket.on("conversation", (data) => {
      // console.log("conversation", data);

      // Separate individual and group conversations
      const individualConversations = data.individualConversations || [];
      const groupConversations = data.groupConversations || [];

      const conversationUserData = individualConversations.map(
        (conversationUser) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        }
      );

      setAllUser(conversationUserData);
      setAllGroups(groupConversations);
    });

    socketConnection.on(
      "incomingCall",
      ({ from, name: callerName, signal }) => {
        setIncomingCall(true);
        console.log("Incoming call from:", from);
        const incomingData = {
          from: from,
          callerName: callerName,
          signal: signal,
        };
        setIncomingCallData(incomingData);
        // setCall({ isReceivingCall: true, from, name: callerName, signal });
      }
    );

    // Listen for call rejection from the other user
    socketConnection.on("callRejected", ({ from }) => {
      try {
        console.log("Call rejected in receiver Side", from);
        toast.error("Call Rejected");
      } catch (e) {
        console.log("error in rejecting the call : ", e);
      }
    });

    // Cleanup on component unmount
    // return () => {
    //   socket.disconnect();
    //   console.log("Disconnected from socket server");
    // };
  }, [user, isChat, socketConnection]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    localStorage.clear();
  };

  const initiateCall = async (receiverId) => {
    console.log("starting the vedio call");

    startVideoCall();
    const targetUserId = receiverId;

    console.log("receiverId : ", targetUserId);

    callUser(receiverId, user._id);
    navigate("/home/videoCall");
  };

  const handleAcceptCall = () => {
    answerCall(incomingCallData);
    setIncomingCall(false);
    startVideoCall();
    navigate("/home/videoCall");
  };

  const handleRejectCall = () => {
    // Emit callRejected event to notify the caller
    // socketConnection.emit("callRejected", { to: incomingCallData.from });
    rejectCall(incomingCallData.from);
    setIncomingCall(false); // Close the incoming call popup for the user
  };

  const openSearchUserCall = () => {
    setOpenSearchUser(true);
  };

  return (
    <div className="w-full h-full grid grid-cols-[58px,1fr] bg-white">
      <div className="bg-fuchsia-200 w-14 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <div
            onClick={() => {
              setIsChat(true);
              setActive("chat");
              navigate("/home");
            }}
            className={`w-12 h-12 mx-1 mb-1 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded ${
              active == "chat" && "bg-primary"
            }`}
            title="chat"
          >
            <IoChatbubbleEllipses size={20} />
          </div>

          <div
            onClick={() => {
              setIsChat(false);
              setActive("groupChat");
              navigate("/home");
            }}
            className={`w-12 h-12 mx-1 mb-1 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded ${
              active == "groupChat" && "bg-fuchsia-300"
            }`}
            title="group"
          >
            <HiUserGroup size={20} />
          </div>

          <div
            onClick={() => {
              // setIsChat(false);
              setActive("call");
              navigate("/home");
            }}
            className={`w-12 h-12 mx-1 mb-1 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded ${
              active == "call" && "bg-fuchsia-300"
            }`}
            title="call"
          >
            <IoCall size={20} />
          </div>

          <div
            title="add friend"
            onClick={openSearchUserCall}
            className="w-12 h-12 mx-1 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded"
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={35}
              height={35}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            title="logout"
            className="w-12 h-12 mx-1 mt-3 flex justify-center items-center cursor-pointer hover:bg-fuchsia-300 rounded"
            onClick={handleLogout}
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      {/* {active == "chat" ? (
        <AllChats allChats={allUser} active={active} />
      ) : active == "groupChat" ? (
        <AllChats allChats={allGroups} active={active} />
      ) : (
        <VoiceCall active={active} />
      )} */}
      <Suspense
        fallback={
          <div className="flex justify-center align-middle items-center">
            <Loading />
            {/* loading ... */}
          </div>
        }
      >
        {active === "chat" ? (
          <AllChats allChats={allUser} active={active} />
        ) : active === "groupChat" ? (
          <AllChats allChats={allGroups} active={active} />
        ) : (
          <VoiceCall active={active} />
        )}
      </Suspense>

      {/** edit user details */}
      {editUserOpen && (
        // <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
        <Suspense
          fallback={
            <div className="flex justify-center align-middle items-center">
              <Loading />
              {/* loading ... */}
            </div>
          }
        >
          <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
        </Suspense>
      )}

      {/** search user */}
      {openSearchUser && (
        // <SearchUser
        //   onClose={() => setOpenSearchUser(false)}
        //   onCall={initiateCall}
        // />
        <Suspense
          fallback={
            <div className="flex justify-center align-middle items-center">
              <Loading />
              {/* loading ... */}
            </div>
          }
        >
          <SearchUser
            onClose={() => setOpenSearchUser(false)}
            onCall={initiateCall}
          />
          //{" "}
        </Suspense>
      )}

      {/** Incoming Call Popup */}
      {/* {call.isReceivingCall && !callAccepted && ( */}
      {incomingCall && (
        <div className="fixed top-5 right-5 bg-primary shadow-lg p-4 rounded-lg border border-gray-300 p-11 items-center">
          <p className="text-lg font-semibold">Incoming Call</p>
          <div className="flex flex-row items-center mt-2">
            <p className="mr-2">From:</p>
            <p>{caller?.name}</p>
          </div>
          <div className="mt-4 flex">
            {/* <div className="mr-2">
              <button
                onClick={() => handleAcceptCall(false)}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
              >
                <MdPhoneCallback size={24} />
              </button>
            </div> */}
            <div className="mr-2">
              <button
                onClick={() => handleAcceptCall()}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
              >
                <MdVideoCall size={24} />
              </button>
            </div>
            <div className="ml-2">
              <button
                onClick={handleRejectCall}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
              >
                <HiPhoneMissedCall size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
