const express = require('express');
const router = express.Router();

const UserController = require('../../app/controllers/admin/users.controller');
const AuthMiddleware = require('../../app/middlewares/auth.middleware');

router.use(AuthMiddleware);

router.get('/', UserController.index);
router.get('/new', UserController.create);
router.post('/new', UserController.store);
router.get('/:id/edit', UserController.edit);
router.post('/:id/edit', UserController.update);
router.get('/:id/delete', UserController.delete);

module.exports = app => app.use('/admin/users', router);
