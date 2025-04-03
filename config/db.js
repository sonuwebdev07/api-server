const mongoose = require("mongoose");
const colors = require('colors');


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to Database Successfully : ${mongoose.connection.host}`.bgCyan.white);
    } catch (error) {
        console.log(`Error in DB : ${error}`.bgRed.white);
    }
}

module.exports = connectDB;