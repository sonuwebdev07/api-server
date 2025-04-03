const express = require('express');
const { registerController, loginController, updateUserController, requireSignIn, getUserController } = require('../controllers/userController');

const router = express.Router();

//Routes
// Register || POST
router.post('/register', registerController);

// Login || POST
router.post('/login', loginController);

// Get || GET
router.get('/get-user', getUserController);

//Update || PUT
router.put('/update-user', requireSignIn, updateUserController);

//Exports
module.exports = router;