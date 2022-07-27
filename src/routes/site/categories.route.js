const express = require('express');
const router = express.Router();

const CategoryController = require('../../app/controllers/site/categories.controller');

// router.get('/', CategoryController.index);
router.get('/:slug', CategoryController.show);

module.exports = app => app.use('/categories', router);
