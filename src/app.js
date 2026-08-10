const express = require('express');
const connectDB = require("./config/database.js")
const app = express();
const User = require("./models/user.js")
const { validateSignupData, validateLoginData } = require("./utils/validation.js")
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middleware/auth.js")

app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {
  try {
    //validating signup data
    validateSignupData(req)

    const { firstName, lastName, emailId, password } = req.body

    //encryting the password
    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: passwordHash
    })
    await user.save()
    res.send("User Added Successfully")
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }

})

//login user
app.post("/login", async (req, res) => {
  try {
    validateLoginData(req)
    const { emailId, password } = req.body

    const user = await User.findOne({ emailId: emailId })

    if (!user) {
      throw new Error("User is not found!")
    }

    const isPasswordValid = await user.validatePassword(password)

    if (isPasswordValid) {
      //Create JWT Token
      const token = await user.getJWT()

      //Add token to cookie
      res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)})
      res.send("Login Successful!")
    } else {
      throw new Error("Password is incorrect!")
    }

  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

//Get Profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  }catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }

})

app.post("/sendConnectionRequest", userAuth, async (req,res) => {
  try{
    res.send("Connection Request send")
  }catch(err){
    res.status(400).send("ERROR: " + err.message)
  }
})







connectDB()
  .then(() => {
    console.log("Database connection Successful..!!")
    app.listen(3000, () => {
      console.log("Server is listed on port 3000")
    });
  }).catch((err) => {
    console.log("Database connection Failed...!")
  })


