const httpErrors = require('http-errors');

const route = '/books';
const path = 'site/books/';

module.exports = {
    index: async (req, res, next) => {
        try {
            res.render(`${path}index`, {
                title: 'Books',
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
