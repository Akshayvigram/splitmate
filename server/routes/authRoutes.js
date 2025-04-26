const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path
const authController = require('../controllers/authController'); // Adjust path

router.get('/me', authMiddleware, authController.getMe);

module.exports = router;