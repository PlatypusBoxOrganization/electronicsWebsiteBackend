const User = require("../models/user");

async function handleUserSignUp(req, res) {
  try {
    const { name, email, password } = req.body;
   
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already in use.");
    }
    // Create user
    const user = await User.create({ name, email, password });
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




module.exports = {handleUserLogin , handleUserSignUp }