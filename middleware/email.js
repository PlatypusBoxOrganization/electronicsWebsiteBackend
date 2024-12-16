const { Verification_Email_Template, Welcome_Email_Template } = require("./EmailTemplate.js");
const { transporter } = require("./emailConfig.js");

const sendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"ElectronicsWeb" <sindhuku3@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Verify Your Email", // Subject line
      text: "Verify Your Email", // plain text body
      html: Verification_Email_Template.replace("{verificationCode}", verificationCode),
    }) // html body
    console.log("email sent successfully", response);
  }
  catch (error) {
    console.log(error);
  }
};

const WelcomeEmail = async (name, email) => {
  try {
    const response = await transporter.sendMail({
      from: '"ElectronicsWeb" <sindhuku3@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Email Verification Successfull", // Subject line
      text: "Welcome to the Community", // plain text body
      html: Welcome_Email_Template.replace(
        "{name}",
        name
      ),
    }); // html body
    console.log("welcome email sent successfully", response);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { sendVerificationCode, WelcomeEmail }