import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Home from "../pages/Home/index";
import MessagePage from "../components/OneToOneConversation/MessagePage";
import GroupMessagePage from "../components/GroupConversation/GroupMessagePage";
import AuthenticatePage from "../pages/Authentication/Authentication";
// import Room from "../components/VoiceConversation/TestingVediocall";
// import TestingPage from "../components/VideoConversation/TestingPage";
import VideoCall from "../components/VideoConversation/VideoPlayer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <AuthenticatePage />,
      },
      {
        path: "login",
        element: <AuthenticatePage />,
      },
      {
        path: "/home",
        element: <Home />,
        children: [
          {
            path: "user/:userId",
            element: <MessagePage />,
          },
          {
            path: "group/:groupId",
            element: <GroupMessagePage />,
          },
          // {
          //   path: "call/:callId",
          //   element: <TestingPage />,
          // },
          {
            path: "videoCall",
            element: <VideoCall />,
          },
        ],
      },
    ],
  },
]);

export default router;
