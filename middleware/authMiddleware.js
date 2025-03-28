const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY); // Use the same secret key
    req.user = await UserModel.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not found, authorization denied" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authMiddleware };
