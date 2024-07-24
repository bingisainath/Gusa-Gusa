import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Home from "../pages/Home/index";
import MessagePage from "../components/MessagePage";
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
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
