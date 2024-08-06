import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";

const GroupProfile = ({ onClose, groupData }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 bg-slate-700 bg-opacity-40 flex justify-center items-center p-2 z-10">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg relative p-4">
        {/* Close button */}
        <div
          className="absolute top-4 right-4 text-2xl lg:text-4xl cursor-pointer hover:text-red-600"
          onClick={onClose}
        >
          <IoClose />
        </div>

        {/* Group details */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={groupData?.profilePic || "default-profile-pic-url"} // Replace with a default image URL if needed
            alt="Group Profile"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-800">{groupData?.name}</h2>
        </div>

        {/* Participants list */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          {loading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : (
            <ul className="space-y-2">
              {groupData?.participants?.length ? (
                groupData.participants.map((participant, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 border rounded shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{participant.userName}</p>
                      <p className="text-sm text-gray-600">{participant.userEmail}</p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-600">No participants found</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupProfile;
