const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');
const { expressjwt: jwt } = require('express-jwt');

//middleware 
const requireSignIn = jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"], })

//Register Controller
const registerController = async (req, res) => {
    try {
        const { first_name, last_name, email, mobile, password, address } = req.body;
        //Validation 
        if (!first_name) {
            return res.status(400).send({
                success: false,
                message: 'first name is Required',

            })
        }
        if (!last_name) {
            return res.status(400).send({
                success: false,
                message: 'last name is Required',

            })
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'email is Required',

            })
        }
        if (!mobile) {
            return res.status(400).send({
                success: false,
                message: 'Mobile Number is Required',

            })
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: 'password is Required minimun 6 characters',

            })
        }
        if (!address) {
            return res.status(400).send({
                success: false,
                message: 'Address is Required',

            })
        }

        // Existing User
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: 'User Already Exist !! '
            })
        }

        //hased Password
        const hashedPassword = await hashPassword(password);

        //Insert User to Database
        const user = await userModel({ first_name, last_name, email, mobile, password: hashedPassword, address }).save();
        return res.status(201).send({
            success: true,
            message: 'Registration Successfull Please Login..'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Registration !!! ',
            error: error,
        })
    }

};


//Login Controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //Validation 
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Please Provide Email or Password',

            })
        }
        // Find User
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(500).send({
                success: false,
                message: 'User Not Found !! '
            })
        }

        //Match Password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(500).send({
                success: false,
                message: 'Incorrect username or password',
            })
        }

        //TOKEN JWT
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d", });

        //undefind Password
        user.password = undefined;

        return res.status(201).send({
            success: true,
            message: 'Login Successfull...',
            token,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Login !!! ',
            error: error
        })
    }

};

//get user
const getUserController = async (req, res) => {
    try {
        //find user
        const user = await userModel.find({})
        res.status(201).send({
            success: true,
            message: 'Data Get Successfully',
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in User Get API !!! ',
            error
        })

    }

}

//Update User Controller 
const updateUserController = async (req, res) => {
    try {
        const { first_name, last_name, email, mobile, password, address } = req.body;
        //find user
        const user = await userModel.findOne({ email: email })

        //password Validation
        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: 'Password is required and should be more than 6 character !!! ',
                error: error,
            })
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;

        // Updated User
        const updatedUser = await userModel.findOneAndUpdate({ email }, {
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            email: email || user.email,
            mobile: mobile || user.mobile,
            password: hashedPassword || user.password,
            address: address || user.address

        }, { new: true });
        updatedUser.password = undefined;
        res.status(201).send({
            success: true,
            message: 'Profile Updated Successfully Please Login',
            updatedUser,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in User Update API !!! ',
            error,
        })

    }

}

module.exports = { registerController, loginController, updateUserController, requireSignIn, getUserController }