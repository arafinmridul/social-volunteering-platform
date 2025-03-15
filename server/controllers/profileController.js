const User = require('../models/User');

// @desc   Get user profile
// @route  GET /api/users/profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc   Update user profile
// @route  PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update fields if provided in the request body
        user.name = req.body.name || user.name;
        user.gender = req.body.gender || user.gender;
        user.skills = req.body.skills || user.skills;
        user.interests = req.body.interests || user.interests;
        user.bio = req.body.bio || user.bio;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile };
