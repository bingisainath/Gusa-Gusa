const jwt = require("jsonwebtoken");

function tokenVerification(request, response, next) {
  const token = request.cookies.token || request.headers["x-access-token"];

  if (!token) {
    return response
      .status(403)
      .json({ message: "No token provided.", error: true });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        // Handle token expiration error
        return response
          .status(401)
          .json({
            message: "Session expired. Please log in again.",
            error: true,
          });
      } else {
        // Handle other verification errors
        return response
          .status(401)
          .json({ message: "Failed to authenticate token.", error: true });
      }
    }

    // If the token is valid, save the decoded token information in the request
    request.userId = decoded.id;
    request.userEmail = decoded.email;

    // Proceed to the next middleware or route handler
    next();
  });
}

module.exports = tokenVerification;
