import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendMail from "../utils/nodeMailer.js";

//user register
const register = async (req, res) => {
  try {
    const { username, email, password ,department, semester } = req.body;
    if (!username || !email || !password || !department || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      email,
      password: hashPassword,
      department,
      semester
    });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, userEmail: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser,token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatchpassword = await bcrypt.compare(password, userExists.password);
    if (!isMatchpassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: userExists._id, userEmail: userExists.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "User logged in successfully", token, userExists });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//send otp
const sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    await sendMail({
      to: email,
      subject: "Reset Your Password",
      text: `We received a request to reset your password. Your OTP is ${otp}. It will expire in 10 minutes.`,
      html: `
  <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f7f7f7;
    padding: 40px 0;
    margin: 0;
  ">
    <div style="
      max-width: 500px;
      background: #ffffff;
      margin: auto;
      padding: 30px 25px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    ">
      
      <!-- Logo or Title -->
      <h2 style="
        text-align: center;
        color: #2563eb;
        margin-bottom: 10px;
        font-size: 26px;
      ">
        🔐 Reset Your Password
      </h2>

      <p style="
        color: #555;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 20px;
      ">
        Hello ${userExists.username} 👋,<br>
        We received a request to reset your password.  
        Use the OTP code below to complete your verification:
      </p>

      <!-- OTP Box -->
      <div style="
        background: #2563eb;
        color: #ffffff;
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        padding: 18px 0;
        border-radius: 10px;
        letter-spacing: 6px;
        margin: 25px 0;
      ">
        ${otp}
      </div>

      <p style="
        color: #666;
        font-size: 15px;
        line-height: 1.6;
      ">
        This OTP is valid for 
        <strong>10 minutes</strong>.  
        If you did not request a password reset, please ignore this email.
      </p>

      <!-- Footer -->
      <div style="
        border-top: 1px solid #eee;
        margin-top: 30px;
        padding-top: 15px;
        text-align: center;
      ">
        <p style="color: #999; font-size: 13px; margin: 0;">
          © ${new Date().getFullYear()} Your App • All Rights Reserved
        </p>
      </div>
    </div>
  </div>
`,
    });
    userExists.isVerify = false;
    userExists.otp = otp.toString();
    userExists.otpExpiration = Date.now() + 600000;
    await userExists.save();
    return res.status(200).json({ message: "OTP sent successfully", otp, id: userExists._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// verify otp
const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (userExists.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (!userExists.otp || !userExists.otpExpiration) {
      return res.status(400).json({ message: "No OTP requested" });
    }
    if (userExists.otpExpiration < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    userExists.isVerify = true;
    userExists.otp = undefined;
    userExists.otpExpiration = undefined;

    await userExists.save();
    return res
      .status(200)
      .json({ message: "OTP verified successfully", userExists });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// forgotpassword
const forgotpassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }
    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (userExists.isVerify === false) {
      return res.status(400).json({ message: "User is not verified" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    userExists.password = hashPassword;
    await userExists.save();

    return res.status(200).json({ message: "Password change sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//logout
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// dashboard
const dashboard = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    return res.status(200).json({ message: "Welcome to the dashboard", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  register,
  login,
  sendotp,
  verifyotp,
  forgotpassword,
  logout,
  dashboard,
};
