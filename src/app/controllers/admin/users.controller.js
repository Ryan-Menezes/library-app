const httpErrors = require('http-errors');

const { users: userRepository } = require('../../repositories');
// const { users: userSchema } = require('../../schemas');
const errorsUtil = require('../../../utils/errors.util');

const route = '/admin/users';
const path = 'admin/users/';

module.exports = {
    index: async (req, res, next) => {
        try {
            const users = await userRepository.all(req.admin.token, req.query);

            res.render(`${path}index`, {
                layout: 'admin',
                title: 'Users',
                users: users.data || [],
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    create: async (req, res, next) => {
        try {
            res.render(`${path}create`, {
                layout: 'admin',
                title: 'New User',
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    edit: async (req, res, next) => {
        try {
            const user = await userRepository.find(req.admin.token, req.params.id);

            if (user.statusCode) {
                return next(httpErrors.NotFound());
            }

            res.render(`${path}edit`, {
                layout: 'admin',
                title: 'Edit User',
                user: user.data || {},
            });
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
