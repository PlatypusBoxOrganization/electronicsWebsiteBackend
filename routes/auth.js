const express = require("express") ; 
const { handleUserSignUp, handleUserLogin, handleUserVerification, sendVerificationCodeToUser, fetchUserById  } = require("../controllers/auth");
const router = express.Router() ; 

router.post("/signup",handleUserSignUp) ; 
router.post("/verify", handleUserVerification);
router.post("/resend-otp",sendVerificationCodeToUser)
router.post("/login",handleUserLogin) ; 
router.get('/user/:userId', fetchUserById);

module.exports = router ; 