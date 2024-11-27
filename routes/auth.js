const express = require("express") ; 
const { handleUserSignUp, handleUserLogin, handleUserVerification,  } = require("../controllers/auth");
const router = express.Router() ; 

router.post("/signup",handleUserSignUp) ; 
router.post("/verify", handleUserVerification);
router.post("/login",handleUserLogin) ; 

module.exports = router ; 