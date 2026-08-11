const express = require('express');
const connectDB = require("./config/database.js")
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require("../src/routes/auth.js")
const profileRouter = require("../src/routes/profile.js")
const requestRouter = require("../src/routes/requests.js")


app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)


connectDB()
  .then(() => {
    console.log("Database connection Successful..!!")
    app.listen(3000, () => {
      console.log("Server is listed on port 3000")
    });
  }).catch((err) => {
    console.log("Database connection Failed...!")
  })


