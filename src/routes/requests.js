const express = require("express");
const {userAuth} = require("../middleware/userAuth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const user = require("../models/user.js");
const requestRouter = express.Router();


requestRouter.post("/request/send/:status/:userId", userAuth, async (req,res) => {
  try{
    const toUserId = req.params.userId;
    const fromUserId = req.user._id;
    const status =  req.params.status;

    const allowedStatus = ["interested", "ignored"];
    if(!allowedStatus.includes(status)){
      res.status(400).json({message: "Invalid status type " + status})
    }

    const toUser = await user.findById(toUserId)
    if(!toUser){
      return res.status(400).json({
        message: "User Not Found!"
      })
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or : [{toUserId,fromUserId},
            {toUserId:fromUserId, fromUserId:toUserId}
      ]
    })
    if(existingConnectionRequest){
      res.status(400).send("message: Connection request already sexists!")
    }
    
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })

    const data = await connectionRequest.save();
    res.json({
      message:status === 'interested' ? `${req.user.firstName} is interested in ${toUser.firstName}` : `${req.user.firstName} is not interested in ${toUser.firstName}`,
      data: data,
    })


  }catch(err){
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = requestRouter;