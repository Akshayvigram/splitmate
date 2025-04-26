const express = require('express');
const router = express.Router();
const { addExpense, getGroupExpenses } = require('../controllers/expenseController');

router.post('/', addExpense);
router.get('/:groupId', getGroupExpenses);

module.exports = router;