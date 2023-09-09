const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // User model

// Register a new user
async function registerUser(req, res) {
    const { name, username, email, password } = req.body;
    
    try {
        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user document
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword // Use the hashed password here
        });
        
        // Save the user document to the database
        await newUser.save();
       
        res.json({ success: true, message: 'User registered successfully!' }); 

    } catch (error) {
        console.error("Error while registering user: ", error);
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
}

// Authenticate a user
async function authUser(req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Authentication failed' });
    }
}

// Update user's email
async function updateUserEmail(req, res) {
    const { userId } = req.user; // Assuming you have user information stored in req.user
    const { newEmail } = req.body;

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update the email
        user.email = newEmail;
        await user.save();

        res.json({ success: true, message: 'Email updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating email' });
    }
}

// Update user's username
async function updateUsername(req, res) {
    const { userId } = req.user; // Assuming you have user information stored in req.user
    const { newUsername } = req.body;

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update the username
        user.username = newUsername;
        await user.save();

        res.json({ success: true, message: 'Username updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating username' });
    }
}

// Update user's password
async function updatePassword(req, res) {
    const { userId } = req.user; // Assuming you have user information stored in req.user
    const { currentPassword, newPassword } = req.body;

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the provided current password matches the stored hashed password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        // Hash the new password and update the user's password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds
        user.password = hashedNewPassword;
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating password' });
    }
}

module.exports = {
    registerUser,
    authUser,
    updateUserEmail,
    updateUsername,
    updatePassword
};
