const mongoose = require("mongoose")

const url = process.env.DB_URL;

const connectDB = async () => {
    await mongoose.connect(url)
}

module.exports = connectDB