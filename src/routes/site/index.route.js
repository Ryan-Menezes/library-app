const express = require('express');
const router = express.Router();

const SiteController = require('../../app/controllers/site/site.controller');

router.get('/', SiteController.index);

module.exports = app => app.use('/', router);
