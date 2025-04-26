const Group = require('../models/Group');

exports.createGroup = async (req, res) => {
  const { name, members } = req.body;
  try {
    const group = await Group.create({ name, members });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating group' });
  }
};

exports.getGroups = async (req, res) => {
  const { userId } = req.params;
  try {
    const groups = await Group.find({ members: userId }).populate('members');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching groups' });
  }
};