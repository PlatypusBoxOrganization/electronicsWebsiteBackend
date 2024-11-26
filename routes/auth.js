const express = require("express") ; 
const { handleUserSignUp, handleUserLogin, handleUserVerification,  } = require("../controllers/auth");
const router = express.Router() ; 

router.post("/signup",handleUserSignUp) ; 
router.post("/login",handleUserLogin) ; 
router.post("/verify",handleUserVerification) ;
module.exports = router ; 