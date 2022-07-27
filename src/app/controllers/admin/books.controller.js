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
            const books = await bookRepository.all(req.query);
            
            res.render(`${path}index`, {
                layout: 'admin',
                title: 'Books',
                books: books.data || [],
                lastPage: books.links.last ? books.links.last.replace(/.*\?/ig, '?') : null,
                nextPage: books.links.next ? books.links.next.replace(/.*\?/ig, '?') : null,
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
            const data = req.body = fields;
            const { token } = req.admin;

            if (!Array.isArray(files.gallery)) {
                files.gallery = [ files.gallery ];
            }

            const payload = await errorsUtil.treatRequest(req, res, bookSchema, `${route}/new`);
            const { status, response } = await bookRepository.create(token, payload, files);

            if (status === 201) {
                const slug = response.data.attributes.slug;

                // Add images
                if (Array.isArray(files.gallery)) {
                    files.gallery.forEach(async image => {
                        await bookRepository.addImage(token, slug, { image });
                    });
                }

                // Add categories
                if (Array.isArray(data.categories)) {
                    data.categories.forEach(async category => {
                        await bookRepository.addCategory(token, slug, category);
                    });
                }

                // Add authors
                if (Array.isArray(data.authors)) {
                    data.authors.forEach(async author => {
                        await bookRepository.addAuthor(token, slug, author);
                    });
                }

                req.flash('successes', [ 'Book created successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not create a new book, there was an error creating' ]);
            }

            res.redirect(`${route}/new`);
        } catch (e) {
            next(httpErrors.InternalServerError(e));
        }
    },

    edit: async (req, res, next) => {
        try {
            const { slug } = req.params;

            const book = await bookRepository.find(slug);

            if (book.statusCode) {
                return next(httpErrors.NotFound());
            }

            const categories = await categoryRepository.all();
            const authors = await authorRepository.all();

            // Book data
            const bookData = book.data || {};

            // Images book
            bookData.attributes.images = await bookRepository.getImages(slug);
            bookData.attributes.images = bookData.attributes.images.data || [];

            // Categories book
            bookData.attributes.categories = await bookRepository.getCategories(slug);
            bookData.attributes.categories = bookData.attributes.categories.data || [];

            // Authors book
            bookData.attributes.authors = await bookRepository.getAuthors(slug);
            bookData.attributes.authors = bookData.attributes.authors.data || [];

            // Parse realease_date
            if (bookData.attributes.release_date) {
                bookData.attributes.release_date = bookData.attributes.release_date
                    .toString()
                    .replace(/T.*Z/ig, '');
            }

            res.render(`${path}edit`, {
                layout: 'admin',
                title: 'Edit Book',
                book: bookData,
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
            const data = req.body = fields;
            const { slug } = req.params;
            const { token } = req.admin;

            const book = await bookRepository.find(slug);
            
            if (book.statusCode) {
                return next(httpErrors.NotFound());
            }

            if (!Array.isArray(files.gallery)) {
                files.gallery = [ files.gallery ];
            }

            const payload = await errorsUtil.treatRequest(req, res, bookSchema, `${route}/${slug}/edit`);
            const { status } = await bookRepository.update(token, slug, payload, files);
            
            if (status === 200) {
                // Remove all categories and authors
                await bookRepository.deleteAllCategories(token, slug);
                await bookRepository.deleteAllAuthors(token, slug);

                // Add images
                if (Array.isArray(files.gallery)) {
                    files.gallery.forEach(async image => {
                        await bookRepository.addImage(token, slug, { image });
                    });
                }

                // Add categories
                if (Array.isArray(data.categories)) {
                    data.categories.forEach(async category => {
                        await bookRepository.addCategory(token, slug, category);
                    });
                }

                // Add authors
                if (Array.isArray(data.authors)) {
                    data.authors.forEach(async author => {
                        await bookRepository.addAuthor(token, slug, author);
                    });
                }

                req.flash('successes', [ 'Book updated successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not updated a book, there was an error updating' ]);
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

            const book = await bookRepository.find(slug);
            
            if (book.statusCode) {
                return next(httpErrors.NotFound());
            }

            const result = await bookRepository.delete(token, slug);

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
            const { token } = req.admin;

            const book = await bookRepository.find(slug);

            if (book.statusCode) {
                return next(httpErrors.NotFound());
            }

            const result = await bookRepository.deleteImage(token, slug, filename);

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
