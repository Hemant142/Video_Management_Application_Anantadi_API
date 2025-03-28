const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");

const BlacklistModel = require("../models/blacklistModel"); // make sure this model exists
require("dotenv").config();


const userRouter = express.Router();
const SECRETKEY = process.env.SECRETKEY;


userRouter.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body, "REQ BODY");
  
    try {
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Please fill in all required fields" });
      }
  
      const existingUser = await UserModel.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ error: "User already registered" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new UserModel({ username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({
        message: "User registered successfully",
        user: { id: newUser._id, username: newUser.username, email: newUser.email },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
  

//  Login Route
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({ error: "User not found, please register first" });
      }
  
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      const token = jwt.sign(
        { userId: existingUser._id, username: existingUser.username },
        SECRETKEY,
        { expiresIn: "7d" }
      );
  
      res.status(200).json({
        message: "Login successful",
        user: { id: existingUser._id, username: existingUser.username, email: existingUser.email },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

//  Logout Route (Token Blacklisting)
userRouter.get("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(400).json({ error: "Token is required!" });
  }

  try {
    const blacklistEntry = await BlacklistModel.findOne({});

    if (!blacklistEntry) {
      await BlacklistModel.create({ blacklist: [token] });
    } else {
      await BlacklistModel.updateOne({}, { $push: { blacklist: token } });
    }

    res.status(200).json({ message: "User has been logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { userRouter };
