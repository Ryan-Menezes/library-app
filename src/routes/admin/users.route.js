const express = require('express');
const router = express.Router();

const UserController = require('../../app/controllers/admin/users.controller');
const AuthMiddleware = require('../../app/middlewares/auth.middleware');

router.use(AuthMiddleware);

router.get('/', UserController.index);
router.get('/new', UserController.create);
router.get('/:id/edit', UserController.edit);

module.exports = app => app.use('/admin/users', router);
