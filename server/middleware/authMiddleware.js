const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || "";

  console.log("Checking the Token in middleware", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token, authorization denied", error: true });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid", error: true });
  }
};

module.exports = authMiddleware;
