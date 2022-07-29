const httpErrors = require('http-errors');

const route = '/admin';
const path = 'admin/';

module.exports = {
    index: async (req, res, next) => {
        try {
            res.render(`${path}index`, {
                layout: 'admin',
                title: 'Home',
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
