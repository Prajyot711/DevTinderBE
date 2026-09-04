const express = require("express")
const { validateSignupData, validateLoginData } = require("../utils/validation.js")
const User = require("../models/user.js")
const bcrypt = require("bcrypt")
const {userAuth} = require("../middleware/userAuth.js")


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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
    const savedUser = await user.save();
    const token = await savedUser.getJWT()

    //Add token to cookie
    res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)})
    res.status(200).json({message : "Signup Successful!", data : savedUser})
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }

})

//login user
authRouter.post("/login", async (req, res) => {
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
      res.status(200).json({message : "Login Successful!", data : user})
    } else {
      throw new Error("Password is incorrect!")
    }

  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

//logout user

authRouter.post("/logout", async (req,res) => {
    try{
        res.cookie('token' , null , {expires: new Date(Date.now())})
        res.send('Logout Successful!')
    }catch(err){

    }
})

module.exports = authRouter