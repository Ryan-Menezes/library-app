const express = require('express');
const router = express.Router();

const BookController = require('../../app/controllers/admin/book.controller');

router.get('/', BookController.index);
router.get('/new', BookController.create);
router.get('/:id/edit', BookController.edit);

module.exports = app => app.use('/admin/books', router);
