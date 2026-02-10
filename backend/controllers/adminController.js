const User = require('../models/User');
const Upload = require('../models/ExcelUpload');
const UserActivity = require('../models/UserActivity');

const promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { role: 'admin' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User promoted to admin', user });
  } catch (err) {
    console.error('Promote user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const demoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { role: 'user' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User demoted to user', user });
  } catch (err) {
    console.error('Demote user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove uploads and activities
    await Upload.deleteMany({ userId: id });
    await UserActivity.deleteMany({ userId: id });

    res.json({ message: 'User and related data deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { promoteUser, demoteUser, deleteUser };
