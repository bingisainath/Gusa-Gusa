const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      return {
        message: "User not found",
        logout: true,
      };
    }
    
    return user;

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        message: "Token expired, please log in again",
        logout: true,
      };
    }

    return {
      message: "Invalid token, please log in again",
      logout: true,
    };
  }

  //   const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  //   const user = await UserModel.findById(decode.id).select("-password");

  //   return user;
};

module.exports = getUserDetailsFromToken;
