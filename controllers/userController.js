const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    console.log(req.user)
    // Fetch all users without filtering based on online status
    const users = await User.find().select('username email isOnline');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
