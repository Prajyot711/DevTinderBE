const express = require('express');
require("dotenv").config();
const connectDB = require("./config/database.js")
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require("../src/routes/auth.js")
const profileRouter = require("../src/routes/profile.js")
const requestRouter = require("../src/routes/requests.js");
const userRouter = require('../src/routes/userRoute.js');
const cors = require("cors");
const paymentRouter = require('./routes/payment.js');
const port = process.env.PORT


app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", paymentRouter)


connectDB()
  .then(() => {
    console.log("Database connection Successful..!!")
    app.listen(port, () => {
      console.log("Server is listed on port 3000")
    });
  }).catch((err) => {
    console.log("Database connection Failed...!")
  })


