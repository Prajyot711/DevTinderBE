const jwt = require("jsonwebtoken")
const User = require("../models/user.js")

// const adminAuth = (req,res,next) => {
//         console.log("res 1");
//         const token = "xyz";
//         const isAuthorized = token === "xyz";
//         if(!isAuthorized){
//             res.status(401).send("Unauthorized")
//         }else{
//             next()
//         }
//     }

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies
        if(!token){
            throw new Error("Token is not valid!")
        }

        const decodedObj = await jwt.verify(token,"devTinder@2129")
        const {_id} = decodedObj

        const user = await User.findById(_id)
        if(!user){
            throw new Error("User is not Found")
        }
        req.user = user
        next()
    } catch (err) {
        res.status(400).send("Error: " + err.message)

    }

}

module.exports = { userAuth }