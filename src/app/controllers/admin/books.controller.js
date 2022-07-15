const httpErrors = require('http-errors');

const {
    books: bookRepository,
    categories: categoryRepository,
    authors: authorRepository,
} = require('../../repositories');
const { books: bookSchema } = require('../../schemas');
const errorsUtil = require('../../../utils/errors.util');3
const fileUtil = require('../../../utils/file.util');

const route = '/admin/books';
const path = 'admin/books/';

module.exports = {
    index: async (req, res, next) => {
        try {
            const books = await bookRepository.all(req.admin.token, req.query);
            
            res.render(`${path}index`, {
                layout: 'admin',
                title: 'Books',
                books: books.data || [],
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    create: async (req, res, next) => {
        try {
            const categories = await categoryRepository.all(req.admin.token);
            const authors = await authorRepository.all(req.admin.token);

            res.render(`${path}create`, {
                layout: 'admin',
                title: 'New book',
                categories: categories.data || [],
                authors: authors.data || [],
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    store: async (req, res, next) => {
        try {
            const { fields, files } = await fileUtil.parse(req);
            req.body = fields;

            const payload = await errorsUtil.treatRequest(req, res, bookSchema, `${route}/new`);
            const result = await bookRepository.create(req.admin.token, payload, files);

            if (result) {
                req.flash('successes', [ 'Book created successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not create a new book, there was an error creating' ]);
            }

            res.redirect(`${route}/new`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    edit: async (req, res, next) => {
        try {
            const book = await bookRepository.find(req.admin.token, req.params.slug);

            if (book.statusCode) {
                return next(httpErrors.NotFound());
            }

            const images = await bookRepository.getImages(req.admin.token, book.data.attributes.slug);
            const categories = await categoryRepository.all(req.admin.token);
            const authors = await authorRepository.all(req.admin.token);

            res.render(`${path}edit`, {
                layout: 'admin',
                title: 'Edit Book',
                book: book.data || {},
                images: images.data || [],
                categories: categories.data || [],
                authors: authors.data || [],
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    update: async (req, res, next) => {
        try {
            const { fields, files } = await fileUtil.parse(req);
            req.body = fields;

            const book = await bookRepository.find(req.admin.token, req.params.slug);

            if (book.statusCode) {
                return next(httpErrors.NotFound());
            }

            const payload = await errorsUtil.treatRequest(req, res, bookSchema, `${route}/${book.data.attributesslug}/edit`);
            const result = await bookRepository.update(req.admin.token, book.data.attributes.slug, payload, files);

            if (result) {
                req.flash('successes', [ 'Book updated successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not updated a book, there was an error updating' ]);
            }

            res.redirect(`${route}/${book.data.attributes.slug}/edit`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    delete: async (req, res, next) => {
        try {
            const book = await bookRepository.find(req.admin.token, req.params.slug);

            if (book.statusCode) {
                return next(httpErrors.NotFound());
            }

            const result = await bookRepository.delete(req.admin.token, book.data.attributes.slug);

            if (result) {
                req.flash('successes', [ 'Book deleted successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not delete a book, there was an error deleting' ]);
            }

            res.redirect(`${route}`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    deleteImage: async (req, res, next) => {
        try {
            const { slug, filename } = req.params;
            const book = await bookRepository.find(req.admin.token, slug);

            if (book.statusCode) {
                return next(httpErrors.NotFound());
            }

            const result = await bookRepository.deleteImage(req.admin.token, slug, filename);

            if (result) {
                req.flash('successes', [ 'Image removed from gallery successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not remove image from gallery, there was an error deleting' ]);
            }

            res.redirect(`${route}/${slug}/edit`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
