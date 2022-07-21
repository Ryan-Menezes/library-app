const httpErrors = require('http-errors');

const { categories: categoryRepository } = require('../../repositories');
const { categories: categorySchema } = require('../../schemas');
const errorsUtil = require('../../../utils/errors.util');3

const route = '/admin/categories';
const path = 'admin/categories/';

module.exports = {
    index: async (req, res, next) => {
        try {
            const categories = await categoryRepository.all(req.query);

            res.render(`${path}index`, {
                layout: 'admin',
                title: 'Categories',
                categories: categories.data || [],
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    create: async (req, res, next) => {
        try {
            res.render(`${path}create`, {
                layout: 'admin',
                title: 'New Category',
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    store: async (req, res, next) => {
        try {
            const payload = await errorsUtil.treatRequest(req, res, categorySchema, `${route}/new`);
            const result = await categoryRepository.create(req.admin.token, payload);

            if (result) {
                req.flash('successes', [ 'Category created successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not create a new category, there was an error creating' ]);
            }

            res.redirect(`${route}/new`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    edit: async (req, res, next) => {
        try {
            const category = await categoryRepository.find(req.params.slug);
            
            if (category.statusCode) {
                return next(httpErrors.NotFound());
            }

            res.render(`${path}edit`, {
                layout: 'admin',
                title: 'Edit Category',
                category: category.data || {},
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    update: async (req, res, next) => {
        try {
            const category = await categoryRepository.find(req.params.slug);

            if (category.statusCode) {
                return next(httpErrors.NotFound());
            }

            const payload = await errorsUtil.treatRequest(req, res, categorySchema, `${route}/${category.data.attributesslug}/edit`);
            const result = await categoryRepository.update(req.admin.token, category.data.attributes.slug, payload);

            if (result) {
                req.flash('successes', [ 'Category updated successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not updated a category, there was an error updating' ]);
            }

            res.redirect(`${route}/${category.data.attributes.slug}/edit`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    delete: async (req, res, next) => {
        try {
            const category = await categoryRepository.find(req.params.slug);

            if (category.statusCode) {
                return next(httpErrors.NotFound());
            }

            const result = await categoryRepository.delete(req.admin.token, category.data.attributes.slug);

            if (result) {
                req.flash('successes', [ 'Category deleted successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not delete a category, there was an error deleting' ]);
            }

            res.redirect(`${route}`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
