const express = require('express');
const router = express.Router();

const BookController = require('../../app/controllers/site/books.controller');

router.get('/', BookController.index);

module.exports = app => app.use('/books', router);
