const httpErrors = require('http-errors');

const {
    categories: categoryRepository,
    authors: authorRepository,
} = require('../../repositories');

const route = '/categories';
const path = 'site/categories/';

module.exports = {
    show: async (req, res, next) => {
        try {
            const { slug } = req.params;
            const query = req.query;
            query.title = query.search || query.title || '';
            delete query.search;

            const category = await categoryRepository.find(slug);

            if (category.statusCode) {
                return next(httpErrors.NotFound());
            }

            const books = await categoryRepository.getBooks(slug, req.query);
            const categories = await categoryRepository.all();
            const authors = await authorRepository.all();
            
            res.render(`${path}show`, {
                title: category.data.attributes.name,
                description: category.data.attributes.description,
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
