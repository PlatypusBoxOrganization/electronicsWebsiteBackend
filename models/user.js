const mongoose = require("mongoose") ;
const { createTokenForUser } = require("../services/authentication");
const {createHmac , randomBytes} = require("crypto") ;  
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "/images/default.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordCode: String,
    resetPasswordExpiresAt: Date,
    verificationCode: String,
    verficationCodeExpiresAt: Date,
  },
  { timestamps: true }
);

//hashing of password
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});
//matching of password given by user with password which we already have in our db for that user
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not found");
    const salt = user.salt;
    const hashedpassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedpassword !== userProvidedHash) {
      throw new Error("incorrect password");
    }
    const token = createTokenForUser(user);
    console.log(token);
    return token;
  }
);
const User = mongoose.model("user", userSchema);

module.exports = User;