const User = require("../Model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
require("dotenv").config();
const sendEmail = require("../nodemailer/nodeMailer");
const Chat = require("../Model/Chat.model");
const axios = require("axios");
const { getIo } = require("../socket");
const { OpenAI } = require("openai");
const { TokenExpiredError } = jwt;


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SECRET_KEY = process.env.JWT_SECRET;

exports.Register = async (req, res) => {
  try {
    const { email, password, Name, phoneNumber, Companie, industry } = req.body;

    const existingUser = await User.findOne({ useremail: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userId: uuid.v4().slice(0, 3),
      useremail: email,
      userpassword: hashedPassword,
      userName: Name,
      userphoneNumber: phoneNumber,
      userCompanie: Companie,
      userindustry: industry,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ useremail: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.userpassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const currentuserid = user.userId;
    const userObjectId = user._id;
    const token = jwt.sign({ email }, SECRET_KEY);
    const userindustryLength = user.userindustry.length;
    const useremail = user.useremail;

    res.status(200).json({
      message: "Login successful",
      currentuserid,
      userObjectId,
      token,
      userindustryLength,
      useremail,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
console.log(email)
  try {
    const user = await User.findOne({ useremail: email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ otp }, SECRET_KEY, { expiresIn: "5m" });

    user.resetToken = token;
    await user.save();

    await sendEmail(
      email,
      "Your OTP for Password Reset",
      `Your OTP is ${otp}. It is valid for 10 minutes.`
    );

    res.status(201).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ useremail: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.userpassword = hashedPassword;

    await user.save();

    res.status(201).json("Password reset successful");
  } catch (error) {
    console.error("Error in password reset:", error);

    res.status(500).json("Server error");
  }
};
exports.getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ useremail: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.resetToken) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const decoded = jwt.verify(user.resetToken, SECRET_KEY);
    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified", userId: user._id });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ message: "OTP has expired. Please request a new one." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUsersRegisteredTodayAndYesterday = async (req, res) => {
  try {
    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const users = await User.find({
      createdAt: { $gte: startOfYesterday, $lt: endOfToday },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.addIndustry = async (req, res) => {
  try {
    const { email, industry } = req.body;

    const user = await User.findOne({ useremail: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    industry.forEach((ind) => {
      if (!user.userindustry.includes(ind) && ind !== "") {
        user.userindustry.push(ind);
      }
    });

    await user.save();

    res.status(201).json({ message: "Industry added successfully", user });
  } catch (error) {
    console.error("Error in adding industry:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.sendMessage = async (req, res) => {
//   const { userId, message } = req.body;
//   if (!message || !userId) {
//     return res.status(400).send('Message and userId are required');
//   }

//   try {
//     // Check if the userId exists in the database

//     const response = await axios.post(
//       'https://api-inference.huggingface.co/models/gpt2',
//       { inputs: message },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     const chatbotReply = response.data[0].generated_text;

//     const newChat = new Chat({
//       userId,
//       message,
//       reply: chatbotReply,
//       timestamp: new Date(),
//     });

//     await newChat.save();

//     // Emit the new message to the specific user
//     req.io.to(userId).emit('newMessage', newChat);

//     res.json(newChat);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// exports.getChatHistory = async (req, res) => {
//   const { userId } = req.params;
//   try {
//       const chats = await Chat.find({ userId }).sort({ timestamp: 1 });
//       res.json(chats);
//   } catch (error) {
//       res.status(500).send(error.message);
//   }}

// exports.sendMessage = async (req, res) => {

//   try {
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4o', // Use a model available in the free tier
//       messages: [
//         { role: 'user', content:"what is java" },
//       ],
//       max_tokens: 30, // Adjust the max tokens as needed
//     });
// console.log(response);
//     res.json({
//       reply: response.choices[0].message.content.trim(),
//     });
//   } catch (error) {
//     if (error.response && error.response.status === 429) {
//       // Handle rate limit error
//       res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
//     } else {
//       // Handle other errors
//       console.error(error);
//       res.status(500).json({ error: 'Something went wrong' });
//     }
//   }
// };

exports.sendMessage = async (req, res) => {
  const { userId, message } = req.body;
  if (!message || !userId) {
    return res.status(400).send("Message and userId are required");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
      max_tokens: 50,
    });

    const chatbotReply = response.choices[0].message.content.trim();
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const timestamp = `${hours}:${minutes} ${ampm}`;


    const newChat = new Chat({
      userId,
      message,
      reply: chatbotReply,
      timestamp,
    });
console.log(timestamp);

    await newChat.save();

    req.io.to(userId).emit("newMessage", newChat);

    res.json(newChat);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      res
        .status(429)
        .json({ error: "Rate limit exceeded. Please try again later." });
    } else {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};

exports.getChatHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const chats = await Chat.find({ userId }).sort({ timestamp: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteChatHistory = async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await Chat.deleteMany({ userId });
    res.json({ message: "Chat history deleted successfully", result });
  } catch (error) {
    console.error("Error deleting chat history:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.updateProfile = async (req, res) => {
  const { userId, username, email, phone } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  try {
    const existingUser = await User.findOne({ userId });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    existingUser.useremail = email;
    existingUser.userName = username;
    existingUser.userphoneNumber = phone;

    if (profileImage) {
      existingUser.profileImage = profileImage;
    }

    await existingUser.save();

    res.status(200).json(existingUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
