import "./App.css";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";

function App() {
  return (
    <>
      <Toaster />
      <main>
        <Suspense
          fallback={
            <div className="flex justify-center align-middle items-center">
              <Loading />
              {/* loading ... */}
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}

export default App;
