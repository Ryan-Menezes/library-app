const httpErrors = require('http-errors');

const { authors: authorRepository } = require('../../repositories');
const { authors: authorSchema } = require('../../schemas');
const errorsUtil = require('../../../utils/errors.util');3
const fileUtil = require('../../../utils/file.util');

const route = '/admin/authors';
const path = 'admin/authors/';

module.exports = {
    index: async (req, res, next) => {
        try {
            const authors = await authorRepository.all(req.admin.token, req.query);

            res.render(`${path}index`, {
                layout: 'admin',
                title: 'Authors',
                authors: authors.data || [],
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    create: async (req, res, next) => {
        try {
            res.render(`${path}create`, {
                layout: 'admin',
                title: 'New Author',
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    store: async (req, res, next) => {
        try {
            const { fields, files } = await fileUtil.parse(req);
            req.body = fields;

            const payload = await errorsUtil.treatRequest(req, res, authorSchema, `${route}/new`);
            const result = await authorRepository.create(req.admin.token, payload, files);

            if (result) {
                req.flash('successes', [ 'Author created successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not create a new author, there was an error creating' ]);
            }

            res.redirect(`${route}/new`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    edit: async (req, res, next) => {
        try {
            const author = await authorRepository.find(req.admin.token, req.params.slug);
            
            if (author.statusCode) {
                return next(httpErrors.NotFound());
            }

            res.render(`${path}edit`, {
                layout: 'admin',
                title: 'Edit Author',
                author: author.data || {},
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    update: async (req, res, next) => {
        try {
            const { fields, files } = await fileUtil.parse(req);
            req.body = fields;

            const author = await authorRepository.find(req.admin.token, req.params.slug);

            if (author.statusCode) {
                return next(httpErrors.NotFound());
            }

            const payload = await errorsUtil.treatRequest(req, res, authorSchema, `${route}/${author.data.attributesslug}/edit`);
            const result = await authorRepository.update(req.admin.token, author.data.attributes.slug, payload, files);

            if (result) {
                req.flash('successes', [ 'Author updated successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not updated a author, there was an error updating' ]);
            }

            res.redirect(`${route}/${author.data.attributes.slug}/edit`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    delete: async (req, res, next) => {
        try {
            const author = await authorRepository.find(req.admin.token, req.params.slug);

            if (author.statusCode) {
                return next(httpErrors.NotFound());
            }

            const result = await authorRepository.delete(req.admin.token, author.data.attributes.slug);

            if (result) {
                req.flash('successes', [ 'Author deleted successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not delete a author, there was an error deleting' ]);
            }

            res.redirect(`${route}`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
