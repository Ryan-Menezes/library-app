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
                lastPage: users.links.last ? users.links.last.replace(/.*\?/ig, '?') : null,
                nextPage: users.links.next ? users.links.next.replace(/.*\?/ig, '?') : null,
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
        try {
            const { fields, files } = await fileUtil.parse(req);
            req.body = fields;
            const { token } = req.admin;

            const payload = await errorsUtil.treatRequest(req, res, userSchema, `${route}/new`);         
            const result = await userRepository.create(token, payload, files);

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
            const { id } = req.params;
            const { token } = req.admin;

            const user = await userRepository.find(token, id);
            
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

    update: async (req, res, next) => {
        try {
            const { fields, files } = await fileUtil.parse(req);
            req.body = fields;
            const { id } = req.params;
            const { token } = req.admin;

            const user = await userRepository.find(token, id);

            if (user.statusCode) {
                return next(httpErrors.NotFound());
            }

            const payload = await errorsUtil.treatRequest(req, res, userSchema, `${route}/${id}/edit`);         
            
            if (!payload.password) {
                delete payload.password;
            }
            
            const result = await userRepository.update(token, id, payload, files);

            if (result) {
                req.flash('successes', [ 'User updated successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not updated a user, there was an error updating' ]);
            }

            res.redirect(`${route}/${id}/edit`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { token } = req.admin;

            const user = await userRepository.find(token, id);

            if (user.statusCode) {
                return next(httpErrors.NotFound());
            }

            const result = await userRepository.delete(token, id);

            if (result) {
                req.flash('successes', [ 'User deleted successfully!' ]);
            } else {
                req.flash('errors', [ 'Could not delete a user, there was an error deleting' ]);
            }

            res.redirect(`${route}`);
        } catch (e) {
            next(httpErrors.InternalServerError());
        }
    },
};
