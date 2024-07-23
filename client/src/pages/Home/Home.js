import axios from "axios";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div>
      Home
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
