const httpErrors = require('http-errors');

const {
    books: bookRepository,
    categories: categoryRepository,
    authors: authorRepository,
} = require('../../repositories');

const route = '/books';
const path = 'site/books/';

module.exports = {
    index: async (req, res, next) => {
        try {
            const query = req.query;
            query.title = query.search || query.title || '';
            delete query.search;

            const books = await bookRepository.all(query);
            const categories = await categoryRepository.all();
            const authors = await authorRepository.all();
            
            res.render(`${path}index`, {
                title: 'Books',
                books: books.data || [],
                categories: categories.data || [],
                authors: authors.data || [],
                lastPage: books.links.last ? books.links.last.replace(/.*\?/ig, '?') : null,
                nextPage: books.links.next ? books.links.next.replace(/.*\?/ig, '?') : null,
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    show: async (req, res, next) => {
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

            bookData.attributes.description = bookData.attributes.description.replace(/(\r\n|\n)/ig, '<br>');
            bookData.attributes.details = bookData.attributes.details.replace(/(\r\n|\n)/ig, '<br>');

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

            res.render(`${path}show`, {
                title: bookData.attributes.title,
                book: bookData,
                authors: authors.data || [],
                categories: categories.data || [],
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
