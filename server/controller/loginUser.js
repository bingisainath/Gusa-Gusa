const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(request, response) {
  const { email, password } = request.body;
  console.log("Login Called :", request.body);
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return response
        .status(400)
        .json({ message: "Invalid Credentials", error: true });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response
        .status(400)
        .json({ message: "Incorrect Password", error: true });
    }

    await user.save();

    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      http: true,
      secure: true,
      sameSite: "None",
    };

    return response.cookie("token", token, cookieOptions).status(200).json({
      message: "Login successfully",
      token: token,
      success: true,
    });
    
  } catch (error) {
    console.error(error.message);
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
    // res.status(500).send("Server error");
  }
}

module.exports = login;
