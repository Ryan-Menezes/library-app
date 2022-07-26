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
            const authors = await authorRepository.all(req.query);

            res.render(`${path}index`, {
                layout: 'admin',
                title: 'Authors',
                authors: authors.data || [],
                lastPage: authors.links.last ? authors.links.last.replace(/.*\?/ig, '?') : null,
                nextPage: authors.links.next ? authors.links.next.replace(/.*\?/ig, '?') : null,
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
            const { token } = req.admin;

            const payload = await errorsUtil.treatRequest(req, res, authorSchema, `${route}/new`);
            const result = await authorRepository.create(token, payload, files);

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
            const { slug } = req.params;

            const author = await authorRepository.find(slug);
            
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
            const { slug } = req.params;
            const { token } = req.admin;

            const author = await authorRepository.find(slug);

            if (author.statusCode) {
                return next(httpErrors.NotFound());
            }

            const payload = await errorsUtil.treatRequest(req, res, authorSchema, `${route}/${slug}/edit`);
            const result = await authorRepository.update(token, slug, payload, files);

            if (result) {
                req.flash('successes', [ 'Author updated successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not updated a author, there was an error updating' ]);
            }

            res.redirect(`${route}/${slug}/edit`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    delete: async (req, res, next) => {
        try {
            const { slug } = req.params;
            const { token } = req.admin;

            const author = await authorRepository.find(slug);

            if (author.statusCode) {
                return next(httpErrors.NotFound());
            }

            const result = await authorRepository.delete(token, slug);

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
