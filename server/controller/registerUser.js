const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(request, response) {
  try {
    const { name, email, password, profile_pic } = request.body;

    const checkEmail = await UserModel.findOne({ email }); //{ name,email}  // null

    if (checkEmail) {
      return response.status(400).json({
        message: "Already user exits",
        error: true,
      });
    }

    //password into hashpassword
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);

    const newUserPayload = {
      name,
      email,
      profile_pic,
      password: hashpassword,
    };

    const user = new UserModel(newUserPayload);
    const userSaved = await user.save();

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
      message: "User Created Successfully",
      token: token,
      success: true,
    });

    // return response.status(201).json({
    //   message: "User created successfully",
    //   data: userSave,
    //   success: true,
    // });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = registerUser;
