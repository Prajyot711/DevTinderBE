const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 100
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email Id is not valid: " + value)
            }
        }
    },
    password: {
        type: String,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong " + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error("Gender is not valid!")
            }
        }
    },
    about: {
        type: String,
        default: "This is the default about of the user"
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNWr0iIiYwfxb1MpyodoY45N8QTPFp-sphaeHtF7gnrA&s=10",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo URL is not valid: " + value)
            }
        }
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({ _id: user._id }, "devTinder@2129", {
        expiresIn: "1d"
    })

    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid
}


module.exports = mongoose.model("User", userSchema)