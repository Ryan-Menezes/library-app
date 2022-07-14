const express = require('express');
const router = express.Router();

const CategoryController = require('../../app/controllers/admin/categories.controller');
const AuthMiddleware = require('../../app/middlewares/auth.middleware');

router.use(AuthMiddleware);

router.get('/', CategoryController.index);
router.get('/new', CategoryController.create);
router.post('/new', CategoryController.store);
router.get('/:slug/edit', CategoryController.edit);
router.post('/:slug/edit', CategoryController.update);
router.get('/:slug/delete', CategoryController.delete);

module.exports = app => app.use('/admin/categories', router);
