const httpErrors = require('http-errors');

const route = '/admin/books';
const path = 'admin/books/';

module.exports = {
    index: async (req, res, next) => {
        try {
            res.render(`${path}index`, {
                layout: 'admin',
                title: 'Books'
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    create: async (req, res, next) => {
        try {
            res.render(`${path}create`, {
                layout: 'admin',
                title: 'New Book'
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    edit: async (req, res, next) => {
        try {
            res.render(`${path}edit`, {
                layout: 'admin',
                title: 'Edit Book'
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
