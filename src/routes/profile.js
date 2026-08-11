const express = require("express")
const {userAuth} = require("../middleware/userAuth.js")
const profileRouter = express.Router();
const {validateProfileEditData} = require("../utils/validation.js")
//Get Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  }catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }

})

//edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {

    if(!validateProfileEditData(req)){
      throw new Error("Edit not allowed!")
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])

    await loggedInUser.save()

    res.json({'message' : `${loggedInUser.firstName} , Your profile is updated`, 'data' : loggedInUser})
  }catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }

})

module.exports = profileRouter