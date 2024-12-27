const { sendVerificationCode, WelcomeEmail } = require("../middleware/email");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { transporter } = require("../middleware/emailConfig.js");
 const {
   Verification_Email_Template,
 
 } = require("../middleware/EmailTemplate.js");
 
async function handleUserSignUp(req, res) {
  try {
    const { name, email, password,role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already in use.");
    }

    // Hash the password before saving it to the database
    let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return res.status(500).json({
                success:false,
                message:'Error inn hashing Password',
            });
        }  // 10 is the salt rounds for bcrypt

    // Create the verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create the user with the hashed password and verification code
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,  // Save the hashed password
      verificationCode,
    });

    // Send the verification code (assume this function is defined in utils or another file)
    await sendVerificationCode(user.email, user.verificationCode);

    // Send response
    res.status(201).send({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).send({ error: "Error creating user", details: error.message });
  }
}

// async function handleUserSignUp(req,res){
//   try{
//       //get data
//       const {name, email, password, role} = req.body;
//       //check if user already exist
//       const existingUser = await User.findOne({email});

//       if(existingUser){
//           return res.status(400).json({
//               success:false,
//               message:'User already Exists',
//           });
//       }

//       //secure password
//       let hashedPassword;
//       try{
//           hashedPassword = await bcrypt.hash(password, 10);
//       }
//       catch(err) {
//           return res.status(500).json({
//               success:false,
//               message:'Error inn hashing Password',
//           });
//       }

//       //create entry for User
//       const user = await User.create({
//           name,email,password:hashedPassword,role
//       })

//       return res.status(200).json({
//           success:true,
//           message:'User Created Successfully',
//       });

//   }
//   catch(error) {
//       console.error(error);
//       return res.status(500).json({
//           success:false,
//           message:'User cannot be registered, please try again later',
//       });
//   }
// }



const fetchUserById = async (req, res) => {
  const { userId } = req.params; // Extract userId from route params
  try {
    const user = await User.findById(userId).select('-password -salt'); // Exclude sensitive fields
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


async function sendVerificationCodeToUser(req, res) {
  try {
    const { email } = req.body;
    console.log("Attempting to send verification code to:", email);

    // Generate a new random verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    console.log("Generated verification code:", verificationCode);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided email.",
      });
    }
    console.log("User found:", user);

    // Update the verification code in the user's record
    user.verificationCode = verificationCode;
    try {
      await user.save();
     
    } catch (saveError) {
      return res.status(500).json({
        success: false,
        message: "Failed to update verification code.",
      });
    }

    const emailResponse = await sendVerificationCode(
      user.email,
      verificationCode
    );
    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    console.error("Error sending verification code:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send verification code.",
    });
  }
}
async function handleUserLogin(req,res){
  try {

      //data fetch
      const {email, password} = req.body;
      //validation on email and password
      if(!email || !password) {
          return res.status(400).json({
              success:false,
              message:'PLease fill all the details carefully',
          });
      }

      //check for registered user
      let user = await User.findOne({email});
      //if not a registered user
      if(!user) {
          return res.status(401).json({
              success:false,
              message:'User is not registered',
          });
      }

      const payload = {
          email:user.email,
          id:user._id,
          role:user.role,
      };
      //verify password & generate a JWT token
      if(await bcrypt.compare(password,user.password) ) {
          //password match
          let token =  jwt.sign(payload, 
                              process.env.JWT_SECRET,
                              {
                                  expiresIn:"2h",
                              });

                              

          user = user.toObject();
          user.token = token;
          user.password = undefined;

          const options = {
              expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
              httpOnly:true,
          }

          res.cookie("babbarCookie", token, options).status(200).json({
              success:true,
              token,
              user,
              message:'User Logged in successfully',
          });
      }
      else {
          //passwsord do not match
          return res.status(403).json({
              success:false,
              message:"Password Incorrect",
          });
      }

  }
  catch(error) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:'Login Failure',
      });

  }
}
async function handleUserVerification(req,res){
 try {
   console.log("Request Body:", req.body);
   const {verificationCode} = req.body;
   const user = await User.findOne({
    verificationCode
   });
   console.log("User:", user); // Check if user is null
   if (!user) {
     return res
       .status(400)
       .json({ success: false, message: "invalid verification code" });
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








module.exports = {handleUserLogin , handleUserSignUp,handleUserVerification ,sendVerificationCodeToUser, fetchUserById}