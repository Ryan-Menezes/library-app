const httpErrors = require('http-errors');

const {
    books: bookRepository,
    categories: categoryRepository,
    authors: authorRepository,
} = require('../../repositories');

const route = '/';
const path = 'site/';

module.exports = {
    index: async (req, res, next) => {
        try {
            const books = await bookRepository.all(req.query);
            const categories = await categoryRepository.all();
            const authors = await authorRepository.all();
            
            res.render(`${path}index`, {
                title: 'Your library online',
                books: books.data || [],
                categories: categories.data || [],
                authors: authors.data || [],
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
