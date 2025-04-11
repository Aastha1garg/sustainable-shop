const axios = require("axios");
require("dotenv").config();

const EXOTEL_SID = process.env.EXOTEL_SID;
const EXOTEL_TOKEN = process.env.EXOTEL_TOKEN;
const EXOTEL_FROM_NUMBER = process.env.EXOTEL_FROM_NUMBER; // Exotel's approved sender ID

const otpStorage = {}; // Store OTPs temporarily

// **Send OTP using Exotel API**
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStorage[phone] = otp;

  try {
    const response = await axios.post(
      `https://api.exotel.com/v1/Accounts/$zomato228/Sms/send`,
      new URLSearchParams({
        From: EXOTEL_FROM_NUMBER,
        To: phone,
        Body: `Your OTP code is ${otp}`,
      }),
      {
        auth: {
          username: zomato228,
          password: EXOTEL_TOKEN,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.json({ message: "OTP sent successfully", data: response.data });
  } catch (err) {
    return res.status(500).json({ error: err.response?.data || err.message });
  }
};

// **Verify OTP**
exports.verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  if (otpStorage[phone] === parseInt(otp)) {
    delete otpStorage[phone]; // Remove OTP after verification
    return res.json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
};
