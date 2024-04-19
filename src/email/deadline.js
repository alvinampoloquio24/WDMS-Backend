const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", "config", ".env"),
});
// Function to send email
async function sendEmail(contributionName, amount, date, to) {
  if (typeof amount !== "number") {
    amount = parseFloat(amount); // Convert to float
  }
  const formattedAmount = amount.toLocaleString();
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your password
    },
    debug: true, // Enable debugging
  });

  // Message object
  let mailOptions = {
    from: process.env.EMAIL, // Sender address
    to: to,
    subject: `Reminder: Upcoming Deadline for Contribution`, // Subject line
    text: `Dear Member,

    I hope this email finds you well. I'm writing to remind you about the upcoming deadline for contributions. We have only one day left before the deadline, and it's crucial that we receive your contribution within this timeframe.

    Your input is invaluable to the success of our project, and we truly appreciate your dedication and effort in this regard. Your contribution in honor of ${contributionName} will not only enhance the quality of our project but also contribute significantly to our collective goals.

    Please ensure that your contribution is submitted by ${date}, as we are working on a tight schedule and every contribution matters. If you encounter any challenges or require any assistance, please don't hesitate to reach out to me or the relevant team member.

    Thank you once again for your commitment and cooperation. Together, we can achieve great things!

    Best regards,

    Death Fund Management Team`,
    html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <h2 style="text-align: center; font-size: 24px; color: #4a90e2; margin-bottom: 20px;">Dear Member,</h2>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">I hope this email finds you well. I'm writing to remind you about the upcoming deadline for contributions. We have only one day left before the deadline, and it's crucial that we receive your contribution within this timeframe.</p>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">Your input is invaluable to the success of our project, and we truly appreciate your dedication and effort in this regard. Your contribution in honor of ${contributionName} will not only enhance the quality of our project but also contribute significantly to our collective goals.</p>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">Please ensure that your contribution is submitted by ${date}, as we are working on a tight schedule and every contribution matters. If you encounter any challenges or require any assistance, please don't hesitate to reach out to me or the relevant team member.</p>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">Thank you once again for your commitment and cooperation. Together, we can achieve great things!</p>
      <p style="text-align: center; margin-top: 30px; color: #888; font-size: 14px;">Best regards,<br/>Death Fund Management Team</p>
  </div>
`,
  };

  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error occurred while sending email:", err);
  }
}

// Call the function to send email
module.exports = sendEmail;
