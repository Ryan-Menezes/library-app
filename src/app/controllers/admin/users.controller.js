const httpErrors = require('http-errors');

const { users: userRepository } = require('../../repositories');
const { users: userSchema } = require('../../schemas');
const errorsUtil = require('../../../utils/errors.util');3
const fileUtil = require('../../../utils/file.util');

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

    store: async (req, res, next) => {
        const files = await fileUtil.parse(req);
        return res.send(files);

        try {
            const payload = await errorsUtil.treatRequest(req, res, userSchema, `${route}/new`);

            const result = await userRepository.create(req.admin.token, payload);

            if (result) {
                req.flash('successes', [ 'User created successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not create a new user, there was an error creating' ]);
            }

            res.redirect(`${route}/new`);
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
