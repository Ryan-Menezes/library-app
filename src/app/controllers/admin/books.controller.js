const httpErrors = require('http-errors');

const {
    books: bookRepository,
    categories: categoryRepository,
    authors: authorRepository,
} = require('../../repositories');
const { books: bookSchema } = require('../../schemas');
const errorsUtil = require('../../../utils/errors.util');3
const fileUtil = require('../../../utils/file.util');
const booksRepository = require('../../repositories/books.repository');

const route = '/admin/books';
const path = 'admin/books/';

module.exports = {
    index: async (req, res, next) => {
        try {
            const books = await bookRepository.all(req.query);
            
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
            const categories = await categoryRepository.all();
            const authors = await authorRepository.all();

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

            if (result.status === 201) {
                const book = result.response;
                
                // Add images
                if (Array.isArray(files.gallery)) {
                    files.gallery.forEach(async image => {
                        await booksRepository.addImage(req.admin.token, book.data.attributes.slug, { image });
                    });
                }

                // Add categories
                if (Array.isArray(req.body.categories)) {
                    req.body.categories.forEach(async category => {
                        await booksRepository.addCategory(req.admin.token, book.data.attributes.slug, category);
                    });
                }

                // Add authors
                if (Array.isArray(req.body.authors)) {
                    req.body.authors.forEach(async author => {
                        await booksRepository.addAuthor(req.admin.token, book.data.attributes.slug, author);
                    });
                }

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
            const book = await bookRepository.find(req.params.slug);

            if (book.statusCode) {
                return next(httpErrors.NotFound());
            }

            const images = await bookRepository.getImages(book.data.attributes.slug);
            const categories = await categoryRepository.all();
            const authors = await authorRepository.all();

            const bookData = book.data || {};

            bookData.attributes.categories = await bookRepository
                .getCategories(bookData.attributes.slug);
            bookData.attributes.categories = bookData.attributes.categories.data || [];

            bookData.attributes.authors = await bookRepository
                .getAuthors(bookData.attributes.slug);
            bookData.attributes.authors = bookData.attributes.authors.data || [];

            if (bookData.attributes.release_date) {
                bookData.attributes.release_date = bookData.attributes.release_date
                    .toString()
                    .replace(/T.*Z/ig, '');
            }

            res.render(`${path}edit`, {
                layout: 'admin',
                title: 'Edit Book',
                book: bookData,
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

            const book = await bookRepository.find(req.params.slug);

            if (book.statusCode) {
                return next(httpErrors.NotFound());
            }

            const payload = await errorsUtil.treatRequest(req, res, bookSchema, `${route}/${book.data.attributes.slug}/edit`);
            const result = await bookRepository.update(req.admin.token, book.data.attributes.slug, payload, files);
            
            if (result) {
                // Add images
                if (Array.isArray(files.gallery)) {
                    files.gallery.forEach(async image => {
                        await booksRepository.addImage(req.admin.token, book.data.attributes.slug, { image });
                    });
                }

                // Add categories
                if (Array.isArray(req.body.categories)) {
                    req.body.categories.forEach(async category => {
                        await booksRepository.addCategory(req.admin.token, book.data.attributes.slug, category);
                    });
                }

                // Add authors
                if (Array.isArray(req.body.authors)) {
                    req.body.authors.forEach(async author => {
                        await booksRepository.addAuthor(req.admin.token, book.data.attributes.slug, author);
                    });
                }

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
            const book = await bookRepository.find(req.params.slug);

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
            const book = await bookRepository.find(slug);

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
