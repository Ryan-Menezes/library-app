const httpErrors = require('http-errors');

const {
    categories: categoryRepository,
    authors: authorRepository,
} = require('../../repositories');

const route = '/authors';
const path = 'site/authors/';

module.exports = {
    show: async (req, res, next) => {
        try {
            const { slug } = req.params;
            const query = req.query;
            query.title = query.search || query.title || '';
            delete query.search;

            const author = await authorRepository.find(slug);

            if (author.statusCode) {
                return next(httpErrors.NotFound());
            }

            // Book data
            const authorData = author.data || {};

            authorData.attributes.description = authorData.attributes.description.replace(/(\r\n|\n)/ig, '<br>');

            // Get all
            const books = await authorRepository.getBooks(slug, req.query);
            const categories = await categoryRepository.all();
            const authors = await authorRepository.all();
            
            res.render(`${path}show`, {
                title: author.data.attributes.name,
                description: author.data.attributes.description,
                author: authorData,
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
};
