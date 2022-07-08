const express = require('express');
const router = express.Router();

const CategoryController = require('../../app/controllers/admin/category.controller');

router.get('/', CategoryController.index);
router.get('/new', CategoryController.create);
router.get('/:id/edit', CategoryController.edit);

module.exports = app => app.use('/admin/categories', router);
