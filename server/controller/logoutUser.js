// async function logout(request,response){
//     try {
//         const cookieOptions = {
//             http : true,
//             secure : true,
//             sameSite : 'None'
//         }

//         return response.cookie('token','',cookieOptions).status(200).json({
//             message : "session out",
//             success : true
//     })
//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true
//         })
//     }
// }

// module.exports = logout

const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel"); // Adjust the path to your User model

async function logout(request, response) {
  try {

    const authHeader = request.headers.authorization || "";
    const token = authHeader.split(" ")[1]; // Extract Bearer <token>

    token == "" ? req.cookies.token : "";

    if (!token) {
      return response.status(401).json({
        message: "No session found",
        error: true,
      });
    }

    // Decode the token to get user ID (adjust based on your JWT secret and structure)
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in your environment
    const userId = decoded.id; // Adjust based on your token payload structure

    // Update the lastLogin field with the current timestamp
    await UserModel.findByIdAndUpdate(
      userId,
      { lastLogin: new Date() },
      { new: true }
    );

    const cookieOptions = {
      httpOnly: true, // Fixed typo: 'http' to 'httpOnly'
      secure: true,
      sameSite: "None",
    };

    // Clear the token cookie and send success response
    return response.cookie("token", "", cookieOptions).status(200).json({
      message: "Session ended successfully",
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
    });
  }
}

module.exports = logout;
