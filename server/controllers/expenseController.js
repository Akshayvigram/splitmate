const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  const { title, amount, paidBy, sharedWith, groupId } = req.body;
  try {
    const expense = await Expense.create({ title, amount, paidBy, sharedWith, groupId });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ msg: 'Error adding expense' });
  }
};

exports.getGroupExpenses = async (req, res) => {
  const { groupId } = req.params;
  try {
    const expenses = await Expense.find({ groupId }).populate('paidBy').populate('sharedWith');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching expenses' });
  }
};