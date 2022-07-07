const express = require('express');
const router = express.Router();

const AuthController = require('../../app/controllers/admin/auth.controller');

router.get('/login', AuthController.login);

module.exports = app => app.use('/admin', router);
