const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

//DOTENV
dotenv.config();

//MONGODB CONNECTION
connectDB();

//REST OBJECT 
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//ROUTES
app.use('/api/v1/auth', require('./routes/userRoutes'));

//Home
app.get('/', (req, res) => {
    res.status(200).send({
        success: true,
        message: "Node Server Running"
    })
})

//PORT
const PORT = process.env.PORT || 8080;

//LISTEN
app.listen(PORT, () => {
    console.log(`Server Running ${PORT}`.bgGreen.white);
});

