const express = require('express');
const router = express.Router();

const AuthorController = require('../../app/controllers/site/authors.controller');

// router.get('/', AuthorController.index);
router.get('/:slug', AuthorController.show);

module.exports = app => app.use('/authors', router);
