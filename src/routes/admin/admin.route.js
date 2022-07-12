const express = require('express');
const router = express.Router();

const AdminController = require('../../app/controllers/admin/admin.controller');
const AuthMiddleware = require('../../app/middlewares/auth.middleware');

router.use(AuthMiddleware);

router.get('/', AdminController.index);

module.exports = app => app.use('/admin', router);
