const express = require("express");
const { updateUserEmail, updateUsername, updatePassword, registerUser } = require("../controllers/userControllers");
const { protect } = require("../middleware/auth"); 
const router = express.Router();

// Update user's email
router.route('/updateEmail').post(protect, updateUserEmail);

// Update user's username
router.route('/updateUsername').post(protect, updateUsername);

// Update user's password
router.route('/updatePassword').post(protect, updatePassword);

// Register a new user
router.route('/register').post(registerUser);

module.exports = router;
