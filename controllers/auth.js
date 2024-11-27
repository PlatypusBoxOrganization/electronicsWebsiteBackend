const { sendVerificationCode, WelcomeEmail } = require("../middleware/email");
const User = require("../models/user");

async function handleUserSignUp(req, res) {
  try {
    const { name, email, password } = req.body;
   
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already in use.");
    }
    // Create user
    const verificationCode = Math.floor(100000+Math.random()*90000).toString() ; 
    const user = await User.create({ name, email, password ,verificationCode});
   await sendVerificationCode(user.email,user.verificationCode) ; 
    res.status(201).send({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error creating user", details: error.message });
  }
}

// Login Handler
async function handleUserLogin(req, res) {

const { email, password } = req.body;
try {
  const token = await User.matchPasswordAndGenerateToken(email, password);
  console.log(`token : ${token}`) ; 
  return res.status(200).json({
    message: "User login successful",
    token, // Send the token to the client
  });
} catch (error) {
  return res.status(500).json({
    error: "Error logging in",
  });
}
}
async function handleUserVerification(req,res){
 try {
   console.log("Request Body:", req.body);
   const { code } = req.body;
   const user = await User.findOne({
     verificationCode: code,
   
   });
   console.log("User:", user); // Check if user is null
   if (!user) {
     return res
       .status(400)
       .json({ success: false, message: "Invalid or Expired Code" });
   }
   user.isVerified = true;
  //  user.verificationCode = undefined;
 
 
console.log("Before Save:", user); // Log before save
await user.save();
console.log("After Save:", user);  
   console.log("User Updated:", user);
   await WelcomeEmail(user.name, user.email);
   return res
     .status(200)
     .json({ success: true, message: "Email Verified Successfully" });
 } catch (error) {
   console.error("Error occurred:", error);
   return res
     .status(500)
     .json({ success: false, message: "Internal server error" });
 }
};








module.exports = {handleUserLogin , handleUserSignUp,handleUserVerification }