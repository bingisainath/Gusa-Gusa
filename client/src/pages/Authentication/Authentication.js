// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import "./Authentication.css";
// // import { useAuth } from "../../context/AuthContext";

// const LoginPage = () => {
//   const [isActive, setIsActive] = useState(false);
//   const navigate = useNavigate();

//   // State for login
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [loginError, setLoginError] = useState(null);

//   // State for register
//   const [registerUsername, setRegisterUsername] = useState("");
//   const [registerEmail, setRegisterEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");
//   const [registerError, setRegisterError] = useState(null);

//   const { login, register } = useAuth();

//   const handleRegisterClick = () => {
//     setIsActive(true);
//   };

//   const handleLoginClick = () => {
//     setIsActive(false);
//   };

//   //Function to handle Login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const loginResp = await login(loginEmail, loginPassword);
//       console.log("loginResp:", loginResp);
//       if (loginResp.status) {
//         navigate("/chat");
//       } else {
//         navigate("/chat");
//       }
//     } catch (err) {
//       setLoginError("Failed to login. Please check your credentials.");
//     }
//   };

//   ////Function to handle Register
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const registerResp = await register(
//         registerUsername,
//         registerEmail,
//         registerPassword
//       );
//       console.log("registerResp:", registerResp);
//     } catch (err) {
//       setRegisterError("Failed to register. Please try again.");
//     }
//   };

//   return (
//     <div className={`container ${isActive ? "active" : ""}`} id="container">
//       <div className="form-container sign-up">
//         <form onSubmit={handleRegister}>
//           <h1>Create Account</h1>
//           {registerError && <div style={{ color: "red" }}>{registerError}</div>}
//           <input
//             type="text"
//             placeholder="Username"
//             value={registerUsername}
//             onChange={(e) => setRegisterUsername(e.target.value)}
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={registerEmail}
//             onChange={(e) => setRegisterEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={registerPassword}
//             onChange={(e) => setRegisterPassword(e.target.value)}
//           />
//           <button type="submit">Sign Up</button>
//         </form>
//       </div>
//       <div className="form-container sign-in">
//         <form onSubmit={handleLogin}>
//           <h1>Sign In</h1>
//           {loginError && <div style={{ color: "red" }}>{loginError}</div>}
//           <input
//             type="email"
//             placeholder="Email"
//             value={loginEmail}
//             onChange={(e) => setLoginEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={loginPassword}
//             onChange={(e) => setLoginPassword(e.target.value)}
//           />
//           <a href="#">Forget Your Password?</a>
//           <button type="submit">Sign In</button>
//         </form>
//       </div>
//       <div className="toggle-container">
//         <div className="toggle">
//           <div className="toggle-panel toggle-left">
//             <h1>Welcome Back!</h1>
//             <p>Enter your personal details to use all of the site's features</p>
//             <button className="hidden" id="login" onClick={handleLoginClick}>
//               Sign In
//             </button>
//           </div>
//           <div className="toggle-panel toggle-right">
//             <h1>Welcome, Friend!</h1>
//             <p>Enter your personal details to use all of the site's features</p>
//             <button
//               className="hidden"
//               id="register"
//               onClick={handleRegisterClick}
//             >
//               Sign Up
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import axios from "axios";
import React, { useEffect } from "react";

const LoginPage = () => {
  return <div>LoginPage</div>;
};

export default LoginPage;
