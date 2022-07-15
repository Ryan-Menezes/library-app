const express = require('express');
const router = express.Router();

const BookController = require('../../app/controllers/admin/books.controller');
const AuthMiddleware = require('../../app/middlewares/auth.middleware');

router.use(AuthMiddleware);

router.get('/', BookController.index);
router.get('/new', BookController.create);
router.post('/new', BookController.store);
router.get('/:slug/edit', BookController.edit);
router.post('/:slug/edit', BookController.update);
router.get('/:slug/delete', BookController.delete);
router.get('/:slug/images/:filename/delete', BookController.deleteImage);

module.exports = app => app.use('/admin/books', router);
