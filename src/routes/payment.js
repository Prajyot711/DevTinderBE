const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay")

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try{
        const order = await razorpayInstance.orders.create({
            "amount":50000,
            "currency":"INR",
            "receipt": "receipt#1",
            "partial_payment":false,
            "notes": {
                "firstName":"value3",
                "lastName":"value2",
                "membershipType":"silver",
            }
        });

        console.log(order);
        res.status(200).json({message:"success!", data:order})
    }catch(err){
        res.status(400).send("ERROR :" + err.message)
    }
})

module.exports = paymentRouter;