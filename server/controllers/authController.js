
  
  const User = require('../models/User');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');

  
  exports.getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json({ user });
    } catch (err) {
      res.status(500).json({ msg: 'Error fetching user' });
    }
  };
  
  exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ msg: 'User already exists' });
  
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });
  
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ msg: 'Error registering user' });
    }
  };
  
  exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ user, token });
    } catch (err) {
      res.status(500).json({ msg: 'Error logging in' });
    }
  };