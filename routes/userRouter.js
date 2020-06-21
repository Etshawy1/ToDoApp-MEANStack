const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);

// any endpoint written after the following line is protected
router.use(authController.protect(true));

module.exports = router;
