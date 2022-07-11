const express = require('express');
const router = express.Router();

const AuthController = require('../../app/controllers/admin/auth.controller');

router.get('/login', AuthController.login);
router.post('/login', AuthController.loginValidate);
router.get('/logout', AuthController.logout);

module.exports = app => app.use('/admin', router);
