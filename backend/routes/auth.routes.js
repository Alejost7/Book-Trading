const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);
router.patch('/users/:id/name', authController.updateUserName);
router.patch('/users/:id/config', authController.updateUserConfig);

module.exports = router;