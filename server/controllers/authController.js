const User = require('../models/User');

const sendToken = (user, statusCode, res) => {
  const token = user.generateToken();
  res.status(statusCode).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ success: false, message: 'Email already registered' });
  const user = await User.create({ name, email, password });
  sendToken(user, 201, res);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  sendToken(user, 200, res);
};

exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
