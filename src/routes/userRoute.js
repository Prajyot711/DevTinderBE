const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')
const User = require("../models/user");
const { parse } = require("dotenv");

const user_safe_data = "firstName lastName photoUrl age about skills";

userRouter.get("/user/request/received", userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
              toUserId : loggedInUser._id,
              status: "interested"
        }).populate("fromUserId", user_safe_data)

        if(!connectionRequest){
            return res.status(400).json({message: "No requests to show!"})
        }

        res.status(200).json({message: "Requests fetched successfully!",
            data: connectionRequest
        })
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;
        
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id, status:"accepted"},
                {fromUserId: loggedInUser._id, status:"accepted"}
            ]
        })
        .populate("fromUserId", user_safe_data)
        .populate("toUserId", user_safe_data)

        const data = connectionRequests.map(user => {
            if(user.fromUserId._id.toString() === loggedInUser._id.toString()){
                return user.toUserId;
            }
            return user.fromUserId;
        })

        res.status(200).json({message: "Done!",
            data,
        })
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

userRouter.get("/feed", userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page-1) * limit

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
            
        }).select(user_safe_data).skip(skip).limit(limit)
        res.send(users)
    }catch(err){
        res.status(400).send("Error: ", + err.message)
    }
})

module.exports = userRouter;