const express = require('express');
const router = express.Router();
const { createGroup, getGroups } = require('../controllers/groupController');

router.post('/', createGroup);
router.get('/:userId', getGroups);

module.exports = router;