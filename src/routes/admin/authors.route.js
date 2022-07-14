const express = require('express');
const router = express.Router();

const AuthorController = require('../../app/controllers/admin/authors.controller');
const AuthMiddleware = require('../../app/middlewares/auth.middleware');

router.use(AuthMiddleware);

router.get('/', AuthorController.index);
router.get('/new', AuthorController.create);
router.post('/new', AuthorController.store);
router.get('/:slug/edit', AuthorController.edit);
router.post('/:slug/edit', AuthorController.update);
router.get('/:slug/delete', AuthorController.delete);

module.exports = app => app.use('/admin/authors', router);
