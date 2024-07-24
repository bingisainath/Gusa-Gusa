import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import axiosHelper from "../../helper/axiosHelper";
import { setUser, setToken } from "../../redux/userSlice";
import "./Authentication.css";

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  // State for register
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState(null);

  const handleRegisterClick = () => setIsActive(true);
  const handleLoginClick = () => setIsActive(false);

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosHelper(
        "post",
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        { email: loginEmail, password: loginPassword }
      );
      console.log("login res", response);
      if (response.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        navigate("/home");
      } else {
        setLoginError("Failed to login. Please check your credentials.");
      }
    } catch (error) {
      setLoginError("Failed to login. Please check your credentials.");
    }
  };

  // Register function
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosHelper(
        "post",
        `${process.env.REACT_APP_BACKEND_URL}/api/register`,
        {
          name: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }
      );
      console.log("reg res", response);
      if (response.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        navigate("/home");
      } else {
        setRegisterError("Failed to register. Please try again.");
      }
    } catch (error) {
      setRegisterError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="body-container">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            {registerError && (
              <div style={{ color: "red" }}>{registerError}</div>
            )}
            <input
              type="text"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              id="registerUsername"
              name="registerUsername"
              autoComplete="name"
            />
            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              id="registerEmail"
              name="registerEmail"
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              id="registerPassword"
              name="registerPassword"
              autoComplete="new-password"
            />
            <button type="submit" className="submit">
              Sign Up
            </button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            {loginError && <div style={{ color: "red" }}>{loginError}</div>}
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              id="loginEmail"
              name="loginEmail"
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              id="loginPassword"
              name="loginPassword"
              autoComplete="current-password"
            />
            <a href="#">Forget Your Password?</a>
            <button type="submit" className="submit">
              Sign In
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome, Friend!</h1>
              <p>
                Enter your personal details to use all of the site's features
              </p>
              <button id="login" onClick={handleLoginClick}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Welcome Back!</h1>
              <p>
                Enter your personal details to use all of the site's features
              </p>
              <button id="register" onClick={handleRegisterClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
