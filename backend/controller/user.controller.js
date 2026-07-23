import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connection.model.js";
import Comment from "../models/comments.model.js";

const convertUserDataToPDF = (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);
  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name:${userData.userId.name}`);
  doc.fontSize(14).text(`Email:${userData.userId.email}`);
  doc.fontSize(14).text(`Username:${userData.userId.username}`);
  doc.fontSize(14).text(`Bio:${userData.bio}`);
  doc.fontSize(14).text(`Current Position:${userData.currentPost}`);
  doc.fontSize(14).text("Past Work");
  if (userData.pastWork && Array.isArray(userData.pastWork)) {
    userData.pastWork.forEach((work, index) => {
      doc.fontSize(14).text(`Company Name:${work.company}`);
      doc.fontSize(14).text(`Position:${work.position}`);
      doc.fontSize(14).text(`Years:${work.years}`);
    });
  }
  doc.end();
  return outputPath;
};
export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const uesr = await User.findOne({ email });
    if (uesr) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const profile = new Profile({ userId: newUser._id });
    await profile.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  const user = await User.findOne({ token });
  user.profilePicture = req.file.filename;
  await user.save();
  return res
    .status(200)
    .json({ message: "Profile picture updated successfully" });
};

export const updateUserProfile = async (req, res) => {
  const { token, ...newUserData } = req.body;
  const user = await User.findOne({ token });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { username, email } = newUserData;
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    if (existingUser || String(existingUser._id) !== String(user._id)) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
  }
  Object.assign(user, newUserData);
  await user.save();
  return res.status(200).json({ message: "User profile updated successfully" });
};

export const getUserAndProfile = async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ token });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const userProfile = await Profile.findOne({ userId: user._id }).populate(
    "userId",
    "name email username profilePicture",
  );
  return res.status(200).json({ user: userProfile });
};

export const updateProfileData = async (req, res) => {
  const { token, ...newProfileData } = req.body;
  const userProfile = await User.findOne({ token });
  if (!userProfile) {
    return res.status(404).json({ message: "User not found" });
  }
  const profile_to_update = await Profile.findOne({ userId: userProfile._id });
  Object.assign(profile_to_update, newProfileData);
  await profile_to_update.save();
  return res.status(200).json({ message: "Profile data updated successfully" });
};

export const getAllUserProfiles = async (req, res) => {
  const profiles = await Profile.find().populate(
    "userId",
    "name email username profilePicture",
  );
  return res.status(200).json({ profiles });
};

export const downloadProfile = async (req, res) => {
  const user_id = req.query.user_id;
  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name email username profilePicture",
  );
  let outputPath = await convertUserDataToPDF(userProfile);
  return res.json({ message: outputPath });
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectioId } = req.body;
  const user = await User.findOne({ token });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const connectionUser = await User.findById({ _id: connectioId });
  if (!connectionUser) {
    return res.status(404).json({ message: "Connection user not found" });
  }

  const existingRequest = await ConnectionRequest.findOne({
    userId: user._id,
    connectionId: connectioId,
  });

  if (existingRequest) {
    return res.status(400).json({ message: "Connection request already sent" });
  }

  const request = new ConnectionRequest({
    userId: user._id,
    connectionId: connectioId,
  });
  await request.save();

  return res
    .status(200)
    .json({ message: "Connection request sent successfully" });
};

export const getMyConnectionsRequests = async (req, res) => {
  const { token } = req.body;
  const user = await User.findOne({ token });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const connection = await ConnectionRequest.find({
    userId: user._id,
  }).populate("connectionId", "name email username profilePicture");

  return res.status(200).json({ connection });
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.body;
  const user = await User.findOne({ token });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const connections = await ConnectionRequest.find({
    connectionId: user._id,
  }).populate("userId", "name email username profilePicture");
  return res.status(200).json({ connections });
};

export const acceptConnectionRequest = async (req, res) => {
  const { toke, requestId, action_type } = req.body;
  const user = await User.findOne({ token: toke });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const connection = await ConnectionRequest.findOne({ _id: requestId });
  if (!connection) {
    return res.status(404).json({ message: "Connection request not found" });
  }
  if (action_type === "accept") {
    connection.status_accepted = true;
  } else {
    connection.status_accepted = false;
  }
  await connection.save();
  return res
    .status(200)
    .json({ message: "Connection request updated successfully" });
};
