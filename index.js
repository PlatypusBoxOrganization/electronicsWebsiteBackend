require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");
const { db } = require("./db/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");

const { checkForAuthenticationCookie } = require("./middleware/authentication");
const corsConfig = {
  origin: "http://localhost:3000", // Allow all origins
  credentials: true, // Correct property to allow credentials
  methods: ["GET", "POST", "PUT", "DELETE"], // Correct property name for allowed methods
};
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/order", orderRoute);

const server = () => {
  db();
  app.listen(PORT, () => {
    console.log(`server started at PORT ${PORT}`);
  });
};

server();
