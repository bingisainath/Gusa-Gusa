const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function getUserDetails(request, response) {
  try {
    // const token = request.cookies.token || "";

    const authHeader = request.headers.authorization;
    // const token = authHeader?.split(" ")[1];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // Fallback to cookies for web requests
      token = request.cookies?.token || "";
    }

    console.log("Tokeb :", token);

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const user = await getUserDetailsFromToken(token);

    // console.log("User :",user);

    return response.status(200).json({
      message: "user details",
      data: user,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = getUserDetails;
