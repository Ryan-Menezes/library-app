const express = require('express');
const router = express.Router();

const UserController = require('../../app/controllers/admin/user.controller');

router.get('/', UserController.index);
router.get('/new', UserController.create);
router.get('/:id/edit', UserController.edit);

module.exports = app => app.use('/admin/users', router);
