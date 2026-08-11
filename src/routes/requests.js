const express = require("express");
const {userAuth} = require("../middleware/userAuth.js")

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req,res) => {
  try{
    res.send("Connection Request send")
  }catch(err){
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = requestRouter;