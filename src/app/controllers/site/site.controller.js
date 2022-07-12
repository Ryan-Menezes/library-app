const httpErrors = require('http-errors');

const route = '/';
const path = 'site/';

module.exports = {
    index: async (req, res, next) => {
        try {
            res.render(`${path}index`, {
                title: 'Your library online'
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
