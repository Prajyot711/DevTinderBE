const validator = require("validator")

const validateSignupData = (req) => {
    const {firstName, lastName, emailId, password} = req.body

    if(!firstName || !lastName || !emailId || !password){
        throw new Error("This field is mandatory field")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Please enter valid email Id")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enSter strong password")
    }
}

const validateLoginData = (req) => {
    const {emailId, password} = req.body

    if(!emailId || !password){
        throw new Error("This field is mandatory field")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Please enter valid email Id")
    }
}

const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "gender", "age", "about", "photoUrl", "skills"]
    const isEditAllowed = Object.keys(req.body).every( field => allowedEditFields.includes(field))

    return isEditAllowed;
}

module.exports = {validateSignupData,validateLoginData, validateProfileEditData};