import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { FiPhoneCall } from "react-icons/fi";

const UserSearchCard = ({ user, onClose, onCall }) => {
  const handleCallUser = () => {
    onCall(user._id); // Pass the user's ID to the onCall function
  };

  return (
    <div className="flex items-center row-auto gap-3 p-3 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:border-primary rounded cursor-pointer">
      <Link
        to={"/home/user/" + user?._id}
        onClick={onClose}
        className="flex items-center"
      >
        <div className="mr-4">
          <Avatar
            width={50}
            height={50}
            name={user?.name}
            userId={user?._id}
            imageUrl={user?.profile_pic}
          />
        </div>
        <div>
          <div className="font-semibold text-ellipsis line-clamp-1">
            {user?.name}
          </div>
          <p className="text-sm text-ellipsis line-clamp-1">{user?.email}</p>
        </div>
      </Link>
      <button onClick={handleCallUser} className="text-primary">
        <FiPhoneCall size={24} />
      </button>
    </div>
  );
};

export default UserSearchCard;
