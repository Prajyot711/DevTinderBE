const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength:4,
        maxLength:100
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password: {
        type: String
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("Gender is not valid!")
            }
        }
    },
    about:{
        type:String,
        default:"This is the default about of the user"
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNWr0iIiYwfxb1MpyodoY45N8QTPFp-sphaeHtF7gnrA&s=10"
    },
    skills:{
        type:[String],
    }
},{
    timestamps:true
});


module.exports = mongoose.model("User", userSchema)