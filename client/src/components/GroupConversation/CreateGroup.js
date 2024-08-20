// import React, { useEffect, useState } from "react";
// import { IoSearchOutline, IoClose } from "react-icons/io5";
// import Loading from "./Loading";
// import UserSearchCard from "./UserSearchCard";
// import toast from "react-hot-toast";
// import axios from "axios";

// const CreateGroup = ({ onClose }) => {
//   const [searchUser, setSearchUser] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [groupName, setGroupName] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   const handleSearchUser = async () => {
//     const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
//     try {
//       setLoading(true);
//       const response = await axios.post(URL, { search });
//       setLoading(false);
//       setSearchUser(response.data.data);
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//     }
//   };

//   useEffect(() => {
//     handleSearchUser();
//   }, [search]);

//   const handleSelectUser = (user) => {
//     console.log(selectedUsers);
//     if (selectedUsers.includes(user._id)) {
//       setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
//     } else {
//       setSelectedUsers([...selectedUsers, user._id]);
//     }
//   };

//   const handleCreateGroup = async () => {
//     const URL = `${process.env.REACT_APP_BACKEND_URL}/api/create-group`;
//     try {
//       if (!groupName) {
//         toast.error("Group name is required");
//         return;
//       }
//       if (selectedUsers.length === 0) {
//         toast.error("At least one user must be selected");
//         return;
//       }
//       setLoading(true);

//       const data = {
//         groupName,
//         groupProfilePic: "",
//         participants: selectedUsers, // Update to use participants instead of users
//       };

//       const response = await axios.post(URL, data, {
//         withCredentials: true, // Send credentials (cookies, etc.) with the request
//       });

//       setLoading(false);
//       toast.success("Group created successfully!");
//       onClose();
//     } catch (error) {
//       setLoading(false);
//       toast.error(error?.response?.data?.message || "Failed to create group");
//     }
//   };

//   return (
//     <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
//       <div className="w-full max-w-lg mx-auto mt-10">
//         {/**input group name */}
//         <div className="bg-white rounded h-14 overflow-hidden flex mb-2">
//           <input
//             type="text"
//             placeholder="Group name..."
//             className="w-full outline-none py-1 h-full px-4"
//             onChange={(e) => setGroupName(e.target.value)}
//             value={groupName}
//           />
//         </div>

//         {/**input search user */}
//         <div className="bg-white rounded h-14 overflow-hidden flex mb-2">
//           <input
//             type="text"
//             placeholder="Search user by name, email...."
//             className="w-full outline-none py-1 h-full px-4"
//             onChange={(e) => setSearch(e.target.value)}
//             value={search}
//           />
//           <div className="h-14 w-14 flex justify-center items-center">
//             <IoSearchOutline size={25} />
//           </div>
//         </div>

//         {/**display search user */}
//         <div className="bg-white mt-2 w-full p-4 rounded h-full max-h-[70vh] overflow-scroll">
//           {/**no user found */}
//           {searchUser.length === 0 && !loading && (
//             <p className="text-center text-slate-500">No user found!</p>
//           )}

//           {loading && (
//             <p>
//               <Loading />
//             </p>
//           )}

//           {searchUser.length !== 0 &&
//             !loading &&
//             searchUser.map((user) => (
//               <div key={user._id} className="flex items-center">
//                 <UserSearchCard user={user} onClose={onClose} />
//                 <input
//                   type="checkbox"
//                   checked={selectedUsers.includes(user._id)}
//                   onChange={() => handleSelectUser(user)}
//                   className="ml-2"
//                 />
//               </div>
//             ))}
//         </div>

//         {/**create group button */}
//         <div className="flex justify-end mt-4">
//           <button
//             onClick={handleCreateGroup}
//             className="bg-blue-500 text-white py-2 px-4 rounded"
//           >
//             Create Group
//           </button>
//         </div>
//       </div>

//       <div
//         className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
//         onClick={onClose}
//       >
//         <button>
//           <IoClose />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateGroup;

import React, { useEffect, useState } from "react";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import Loading from "../Loading";
import UserSearchCard from "../UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";

const CreateGroup = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSearchUser = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
    try {
      console.log("URL: ",URL);
      
      setLoading(true);
      const response = await axios.post(URL, { search });
      setLoading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  const handleSelectUser = (user) => {
    const userExists = selectedUsers.find(
      (selectedUser) => selectedUser.userId === user._id
    );

    if (userExists) {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser.userId !== user._id)
      );
    } else {
      setSelectedUsers([
        ...selectedUsers,
        { userId: user._id, userName: user.name, userEmail: user.email },
      ]);
    }
  };

  const handleCreateGroup = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/create-group`;
    try {
      if (!groupName) {
        toast.error("Group name is required");
        return;
      }
      if (selectedUsers.length === 0) {
        toast.error("At least one user must be selected");
        return;
      }
      setLoading(true);

      const data = {
        groupName,
        groupProfilePic: "",
        participants: selectedUsers,
      };

      const response = await axios.post(URL, data, {
        withCredentials: true,
      });

      setLoading(false);
      toast.success("Group created successfully!");
      onClose();
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Failed to create group");
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/** Input group name */}
        <div className="bg-white rounded h-14 overflow-hidden flex mb-2">
          <input
            type="text"
            placeholder="Group name..."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          />
        </div>

        {/** Input search user */}
        <div className="bg-white rounded h-14 overflow-hidden flex mb-2">
          <input
            type="text"
            placeholder="Search user by name, email..."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>

        {/** Display search user */}
        <div className="bg-white mt-2 w-full p-4 rounded h-full max-h-[70vh] overflow-scroll">
          {/** No user found */}
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">No user found!</p>
          )}

          {loading && (
            <p>
              <Loading />
            </p>
          )}

          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user) => (
              <div key={user._id} className="flex items-center">
                <UserSearchCard user={user} onClose={onClose} />
                <input
                  type="checkbox"
                  checked={selectedUsers.some(
                    (selectedUser) => selectedUser.userId === user._id
                  )}
                  onChange={() => handleSelectUser(user)}
                  className="ml-2"
                />
              </div>
            ))}
        </div>

        {/** Create group button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCreateGroup}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Create Group
          </button>
        </div>
      </div>

      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <button>
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
