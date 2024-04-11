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
    subject: `Honoring the Legacy of ${contributionName}`, // Subject line
    text: `Dear Member,

    It is with a mixture of sadness and profound gratitude that we gather to honor the remarkable legacy of ${contributionName}. In their time with us, ${contributionName} left an indelible mark on our organization, and their spirit continues to inspire us all. Today, we are privileged to announce a significant contribution made to our fund in memory of ${contributionName}. This contribution stands as a testament to ${contributionName}'s enduring impact and commitment to our shared goals. Here are the details:

    Name: ${contributionName}
    Amount: ${formattedAmount}
    Deadline: ${date}

    We extend our deepest appreciation to the family and loved ones of ${contributionName} for their generosity and support during this difficult time. Together, we honor ${contributionName}'s memory by continuing the vital work they started.

    With heartfelt regards,

    Fund Management Team
    `,
    html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <h2 style="text-align: center; font-size: 24px; color: #4a90e2; margin-bottom: 20px;">Dear Member,</h2>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">It is with a mixture of sadness and profound gratitude that we gather to honor the remarkable legacy of ${contributionName}. In their time with us, ${contributionName} left an indelible mark on our organization, and their spirit continues to inspire us all. Today, we are privileged to announce a significant contribution made to our fund in memory of ${contributionName}. This contribution stands as a testament to ${contributionName}'s enduring impact and commitment to our shared goals. Here are the details:</p>
      <div style="background-color: #e9f1fd; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
          <p style="font-size: 16px; color: #4a90e2; margin: 5px 0;"><strong>Contribution Name:</strong> ${contributionName}</p>
          <p style="font-size: 16px; color: #4a90e2; margin: 5px 0;"><strong>Amount:</strong> ${amount}</p>
          <p style="font-size: 16px; color: #4a90e2; margin: 5px 0;"><strong>Deadline:</strong> ${date}</p>
      </div>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">We extend our deepest appreciation to the family and loved ones of ${contributionName} for their generosity and support during this difficult time. Together, we honor ${contributionName}'s memory by continuing the vital work they started.</p>
      <p style="text-align: center; margin-top: 30px; color: #888; font-size: 14px;">With heartfelt regards,<br/>Fund Management Team</p>
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
