const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/api/contact", (req, res) => {
  const { username, phoneNumber, email, subject, message } = req.body;

  // Email options
  const mailOptions = {
    from: email,
    to: process.env.RECIEVE_EMAIL,
    subject: `Contact Form Submission: ${subject}`,
    html: `
    <div style="font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <p style="font-size: 16px; color: #555;">
        <strong>Name:</strong> ${username}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Phone Number:</strong> ${phoneNumber}<br>
        <strong>Subject:</strong> ${subject}<br>
      </p>
      <h3 style="color: #333;">Message:</h3>
      <p style="font-size: 16px; color: #555; border: 1px solid #e0e0e0; padding: 10px; border-radius: 5px; background-color: #fff;">
        ${message}
      </p>
    </div>
  `,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Message sent successfully");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
