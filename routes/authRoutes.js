const express = require('express');
const { signup, login } = require('../controllers/authController'); // Make sure these are correctly imported
const router = express.Router();

router.post('/register', signup);
router.post('/login', login);

module.exports = router;
