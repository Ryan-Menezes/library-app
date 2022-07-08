const express = require('express');
const router = express.Router();

const AuthorController = require('../../app/controllers/admin/author.controller');

router.get('/', AuthorController.index);
router.get('/new', AuthorController.create);
router.get('/:id/edit', AuthorController.edit);

module.exports = app => app.use('/admin/authors', router);
