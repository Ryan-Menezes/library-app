const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('site/index', {
        title: 'Your library online'
    });
});

module.exports = app => app.use('/', router);
