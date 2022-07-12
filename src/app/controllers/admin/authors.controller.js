const httpErrors = require('http-errors');

const route = '/admin/authors';
const path = 'admin/authors/';

module.exports = {
    index: async (req, res, next) => {
        try {
            res.render(`${path}index`, {
                layout: 'admin',
                title: 'Authors'
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    create: async (req, res, next) => {
        try {
            res.render(`${path}create`, {
                layout: 'admin',
                title: 'New Author'
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    edit: async (req, res, next) => {
        try {
            res.render(`${path}edit`, {
                layout: 'admin',
                title: 'Edit Author'
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};

