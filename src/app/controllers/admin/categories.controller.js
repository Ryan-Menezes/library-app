const httpErrors = require('http-errors');

const route = '/admin/categories';
const path = 'admin/categories/';

module.exports = {
    index: async (req, res, next) => {
        try {
            res.render(`${path}index`, {
                layout: 'admin',
                title: 'Categories'
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    create: async (req, res, next) => {
        try {
            res.render(`${path}create`, {
                layout: 'admin',
                title: 'New Category'
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    edit: async (req, res, next) => {
        try {
            res.render(`${path}edit`, {
                layout: 'admin',
                title: 'Edit Category'
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
