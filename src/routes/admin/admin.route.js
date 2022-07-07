const express = require('express');
const router = express.Router();

const AdminController = require('../../app/controllers/admin/admin.controller');

router.get('/', AdminController.index);

module.exports = app => app.use('/admin', router);
