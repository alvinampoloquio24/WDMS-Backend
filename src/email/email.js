const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", "config", ".env"),
});
// Function to send email
async function sendEmail(referenceNumber, contributionName, amount, date, to) {
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
    subject: "Contribution Payment", // Subject line
    text: `Dear Member,

    We are thrilled to confirm that your payment has been successfully processed! 🎉 Thank you for choosing [Your Company Name] for your [product/service] needs. Here are the details of your transaction:
    
    Transaction ID: [Transaction ID]
    Date: [Date of Transaction]
    Amount: [Amount Paid]
    
    Your payment is now complete, and your order is being processed. You can expect to receive further updates regarding the delivery/shipping of your [product/service] soon.
    
    Should you have any questions or concerns regarding your payment or order, please don't hesitate to contact our customer support team at [Your Customer Support Email] or [Your Customer Support Phone Number]. We're here to assist you every step of the way!
    
    Thank you once again for choosing [Your Company Name]. We appreciate your business!
    
    Best regards,
    
    Death Fund Management
    `,
    html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <h2 style="text-align: center; font-size: 24px; color: #4a90e2; margin-bottom: 20px;">Dear Member,</h2>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">We are thrilled to confirm that your payment has been successfully processed! 🎉 . Here are the details of your transaction:</p>
      <div style="background-color: #e9f1fd; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
          <p style="font-size: 16px; color: #4a90e2; margin: 5px 0;"><strong>Contribution Name:</strong> ${contributionName}</p>
          <p style="font-size: 16px; color: #4a90e2; margin: 5px 0;"><strong>Reference Number:</strong> ${referenceNumber}</p>
          <p style="font-size: 16px; color: #4a90e2; margin: 5px 0;"><strong>Amount:</strong> ${amount}</p>
          <p style="font-size: 16px; color: #4a90e2; margin: 5px 0;"><strong>Date:</strong> ${date}</p>
      </div>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">Your payment is now complete, and your contribution is being processed.</p>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">If you have any questions or concerns regarding your payment, please don't hesitate to contact us. We're here to assist you every step of the way!</p>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">Thank you once again for choosing Death Fund Management. We appreciate your business!</p>
      <p style="text-align: center; margin-top: 30px; color: #888; font-size: 14px;">Best regards,<br/>Death Fund Management</p>
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
