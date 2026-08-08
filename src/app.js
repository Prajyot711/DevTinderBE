const express = require('express');
const connectDB = require("./config/database.js")
const app = express();
const User = require("./models/user.js")

app.use(express.json())

app.post("/signup",async (req,res)=>{

  const user = new User(req.body)
  try{
    await user.save()
    res.send("User Added Successfully")
  }catch(err){
    res.status(400).send("Error saving the User:" + err.message)
  }
  
})

//Find user
// app.get("/users", async (req,res) => {
//   const userEmail = req.body.emailId;

//   try{
//     const users = await User.find({emailId: userEmail})
//     if(userEmail.length === 0 ){
//       res.status(404).send("User not found!")
//     }else{
//       res.send(users)
//     }
//   }catch(err){
//       res.status(400).send("Sorry, Something went wrong...!")
//   }
// })

//find 1 user
app.get("/users", async (req,res) => {
  const userEmail = req.body.emailId;

  try{
    const user = await User.findOne({emailId: userEmail})
    if(!user){
      res.status(404).send("User not found!")
    }else{
      res.send(user)
    }
  }catch(err){
      res.status(400).send("Sorry, Something went wrong...!")
      
  }
})

//delete user

app.delete("/users", async (req,res) => {
    const userId = req.body.userId

    try{
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted successfully!")
    }catch(err){
        res.status(400).send("Sorry, Something went wrong...!")
    }
})

app.patch("/users", async (req,res) => {
    const userId = req.body.userId;
    const data = req.body;

    try{
        const user = await User.findByIdAndUpdate(userId,data,{
          returnDocument:"before",
          runValidators:true
        })
        console.log(user)
        res.send("User updated successfully!")
    }catch(err){
        res.status(400).send("Update Failed:" + err.message)
    }
})







connectDB() 
  .then(()=>{
    console.log("Database connection Successful..!!")
    app.listen(3000, () => {
      console.log("Server is listed on port 3000")
    });
  }).catch((err)=>{
    console.log("Database connection Failed...!")
  })
 

