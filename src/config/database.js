const mongoose = require("mongoose")
require("dotenv").config();

const url = process.env.DB_URL;

const connectDB = async () => {
    await mongoose.connect(url)
}

module.exports = connectDB