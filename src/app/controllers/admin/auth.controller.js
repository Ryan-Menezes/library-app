const httpErrors = require('http-errors');

const { auth: authRepository } = require('../../repositories');
const { auth: authSchema } = require('../../schemas');
const errorsUtil = require('../../../utils/errors.util');

const route = '/admin';
const path = 'admin/auth/';

module.exports = {
    login: async (req, res, next) => {
        try {
            res.render(`${path}login`, {
                layout: false,
                title: 'Login'
            });
        } catch (e) {
            next(httpErrors.BadRequest());
        }
    },

    loginValidate: async (req, res, next) => {
        try {
            const { username, password } = await errorsUtil.treatRequest(req, res, authSchema, `${route}/login`);

            const response = await authRepository.login(username, password);

            if (response.statusCode) {
                req.flash('errors', [ 'Invalid username or password' ]);
                return res.redirect(`${route}/login`);
            }

            res.send(response);
        } catch (e) {
            next(httpErrors.BadRequest());
        }
    },

    logout: async (req, res, next) => {
        try {
            const response = await authRepository.logout(req.token);

            if (response.statusCode) {
                req.flash('errors', [ 'Could not get out' ]);
                return res.redirect(route);
            }

            return res.redirect(route);
        } catch (e) {
            next(httpErrors.BadRequest());
        }
    },
};
