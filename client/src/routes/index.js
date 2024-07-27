import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Home from "../pages/Home/index";
import MessagePage from "../components/MessagePage";
import GroupMessagePage from "../components/GroupMessagePage";
import AuthenticatePage from "../pages/Authentication/Authentication";

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
        // children: [
        //   {
        //     path: ":userId",
        //     element: <MessagePage />,
        //   },
        // ],
        children: [
          {
            path: "user/:userId",
            element: <MessagePage />,
          },
          {
            path: "group/:groupId",
            element: <GroupMessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
