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
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await UserModel.findById(decode.id).select("-password");
      return user;
    } catch (error) {
      return { data: "Token Invalid", message: error };
    }
  } catch (error) {
    return { data: "Token Invalid", message: error };
  }
};

module.exports = getUserDetailsFromToken;
