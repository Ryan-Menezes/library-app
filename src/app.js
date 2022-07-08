// Inicialization
require('dotenv').config();

// External Dependencies 
const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const morgan = require('morgan');

// Internal Dependencies 
const errorUtil = require('./utils/error.util');
const { session: sessionConfig } = require('./config');

// Instances
const app = express();
const hbs = handlebars.create({
    defaultLayout: 'site'
});

// Settings

// - Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// - Logs
app.use(morgan('dev'));

// - Cors
app.use(cors());

// - Views
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, 'resources', 'views'));

// - Directories
app.use('/', express.static(path.resolve(__dirname, 'public', 'assets')));

// - Session
app.use(session(sessionConfig));
app.use(flash());

// - Globals
app.use((req, res, next) => {
    const config = require('./config');

    req.config = config;
    res.locals.config = config;
    next();
})

// - Routes
require('./routes/admin/auth.route')(app);
require('./routes/admin/admin.route')(app);
require('./routes/admin/users.route')(app);
require('./routes/admin/books.route')(app);
require('./routes/admin/categories.route')(app);
require('./routes/admin/authors.route')(app);

require('./routes/site/index.route')(app);
require('./routes/site/books.route')(app);

// - Errors
app.use((req, res, next) => {
    next(errorUtil.generate(404, 'Not Found'));
});

app.use((error, req, res, next) => {
    const { statusCode = 500, message } = error;

    res.status(statusCode).render('error', {
        layout: false,
        statusCode,
        message,
        title: `${statusCode} ${message}`,
    });
});

module.exports = app;
