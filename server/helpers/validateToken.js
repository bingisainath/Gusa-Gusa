const jwt = require("jsonwebtoken");

async function validateToken(request, response) {
  try {
    const authHeader = request.headers.authorization || "";
    const token = authHeader.split(" ")[1]; // Extract Bearer <token>

    if (!token) {
      return response.status(401).json({
        message: "Token missing",
        status: false,
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return response.status(200).json({
          message: "Token is Invalid",
          status: false,
        });
      }
      return response.status(200).json({
        message: "Token is Invalid",
        status: false,
      });
    }

    return response.status(200).json({
      message: "Token is valid",
      status: true,
    });
  } catch (error) {
    return response.status(401).json({
      message: "Invalid or expired token",
      status: false,
    });
  }
}

module.exports = validateToken;
